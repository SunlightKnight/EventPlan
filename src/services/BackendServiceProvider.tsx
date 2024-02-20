import { createContext } from "react";
import { throwError } from "./BackendError";
import { useTranslation } from "react-i18next";
import BackendServiceInterface from "./BackendServiceInterface";
import LoginRequestDTO from "../models/services/LoginRequestDTO";

const FETCH_TIMEOUT = 30;
const REFRESH_TOKEN_ERROR = "error.session.expired" // TEMP
const API_BASE_URL = ""

export interface IJSON {
  [key: string]: any;
}

enum HTTPMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
}

enum HTTPContentType {
  none = '',
  json = 'application/json',
  image = 'application/png',
  pdf = 'application/pdf',
}

export type AuthToken = {
  refreshToken: string | null
  accessToken: string
  idToken: string
  tokenType: string
  expirationDate: string
}

interface BackendServiceContextType {
  setAuthToken: (token: string, type?: 'user' | 'client') => void
  hasToken: (type?: 'user' | 'client') => boolean
  beService: BackendServiceInterface
}

export const BackendServiceContext = createContext<BackendServiceContextType | null>(null)

const BackendServiceProvider = ({ children } : any) => {
  const { t } = useTranslation()

  let userToken: string;
  let clientToken: string;

  const setAuthToken = (token: string, type?: 'user' | 'client') => {
    if (type === 'client') {
      clientToken = token;
    } else {
      userToken = token;
    }
  }

  const hasToken = (type?: 'user' | 'client') => {
    if (type === 'client') return clientToken !== undefined
    return userToken !== undefined;
  }

  // Http call with JSON request
  const callJSON = async (
    url: string,
    method: HTTPMethod,
    payload: IJSON | undefined,
    responseContentType: HTTPContentType,
    retry: boolean = true,
  ): Promise<any> => {
    try {
      var headers: { [key: string]: string } = {
        'Content-Type': 'application/json',
        'Accept': responseContentType,
      };

      if (userToken || clientToken) {
        headers = {
          ...headers,
          'Authorization': 'Bearer ' + (userToken ? userToken : clientToken)
        }
      }

      const opts = {
        method: method,
        headers: headers,
        body: JSON.stringify(payload),
      };
      console.log(
        `*** BackendService:callJSON: fetching .../${url} with opts=${JSON.stringify(
          opts,
        )}`,
      );

      const response = await fetchWithTimeout(url, opts);

      return await manageResponse(
        response,
        responseContentType,
        retry,
      ).catch(async (error: any) => {
        // if RECALL_API_AFTER_REFRESH_TOKEN_KEY -> retry
        if (error === 401) {
          return callJSON(url, method, payload, responseContentType, false)
        } else {
          throw error;
        }
      });
    } catch (error: any) {
      console.log(
        '*** BackendService:callJSON:' + url + ': got error => ',
        error.message || "empty error message"
      );
      if (error && error.message && error.message !== "Failed to fetch") {
        throwError({status: error.status || 500, message: error.message, messageKey: error.messageKey})
      } else {
        throwError({status: error.status || 500, message: t("errors.generic"), messageKey: "error.fetch"})
      }
    }
  }

  const manageResponse = async (
    response: Response,
    responseContentType: HTTPContentType,
    retry: boolean,
  ): Promise<any> => {
    if (response.status === 201 || response.status === 200 || response.status === 204) {
      if (responseContentType === HTTPContentType.none) {
        return;
      }
      let contentType = response.headers.get('Content-Type');
      if (contentType !== null) {
        contentType = contentType.split(';')[0]; // ignore things like "...;charset=..."
      }
      if (contentType !== responseContentType) {
        throwError({
          status: 415,
          message: `Bad content type <${contentType}>`,
          messageKey: 'bad_content_type',
        })
      }
      switch (contentType) {
        case HTTPContentType.json:
          const json = await response.json();
          console.log(
            `*** BackendService:manageResponse: got json for ${response.url} => ${JSON.stringify(json)}`,
          );
          return json;
        case HTTPContentType.image:
          const image = await response.text();
          // TODO: is <image> encoded in some way?
          console.log(
            `*** BackendService:manageResponse: got image for ${response.url} => ${image.length} bytes`,
          );
          return image;
        case HTTPContentType.pdf:
          const pdf = await response.text();
          // TODO: is <pdf> encoded in some way?
          console.log(
            `*** BackendService:manageResponse: got pdf for ${response.url} => ${pdf.length} bytes`,
          );
          return pdf;
        default:
          throwError({
            status: 415,
            message: `Invalid content type <${contentType}>`,
            messageKey: 'invalid_content_type',
          })
      }
    } if (response.status === 401) {
      // RefreshToken
      if (retry) {
        await refreshToken().then((refreshResponse) => {

        }).catch((refreshError) => {
          throw refreshError
        })
      } else {
        throwError({
          status: 401,
          message: t("errors.unathorized"),
          messageKey: "error.unauthorize"
        })
      }
    } else {
      let json = {} as any;
      try {
        json = await response.json();
        console.error("Error JSON: " + JSON.stringify(json));
      } catch (error: any) {
        console.log(
          `*** BackendService:manageResponse: got error while parsing response => ${error.message}`,
        );
      }
      // let messageKey = json.messageKey || (json.provider_errors && json.provider_errors.faultCode) || (json.errors && json.errors[0] && json.errors[0].message_key) || "error.generic";
      // let message = t("errors.generic")
      // if (messageKey === "field.notValid" && json.errors && json.errors.length > 0) {
      //   try {
      //     message = "" + strings.formatString(strings.errors.not_valid, json.errors[0].field_value)
      //     if (json.errors[0].field_name === "email") {
      //       messageKey = "filed.notValid.email"
      //     }
      //   } catch {
      //     message = t("errors.not_valid")
      //   }
      // } else {
      //   message = json.message || (json.provider_errors && json.provider_errors.message) || (json.errors && json.errors[0] && json.errors[0].message) || strings.errors.generic;
      // }
    }
  }

  const fetchWithTimeout = async (
    url: string,
    options: RequestInit,
    timeout: number = FETCH_TIMEOUT,
  ): Promise<any> => {
    const headers = (options.headers || {}) as any;
    headers['Request-Timeout'] = timeout;
    return Promise.race([
      fetch(url, options),
      new Promise((_, reject) =>
        setTimeout(
          () => reject({status: 408, message: t("errors.timeout"), messageKey: 'timeout'}),
          timeout * 1000,
        ),
      ),
    ]);
  }

  const refreshToken = async () => {

  }

  const login = (payload: LoginRequestDTO) => {
    return callJSON(API_BASE_URL + "/login", HTTPMethod.POST, payload, HTTPContentType.json);
  }


  return <BackendServiceContext.Provider value={{
    setAuthToken: setAuthToken,
    hasToken: hasToken,
    beService: {
      login: login
    }
  }}>
    {children}
  </BackendServiceContext.Provider>
}

export default BackendServiceProvider