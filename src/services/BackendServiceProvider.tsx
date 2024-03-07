import { createContext } from "react";
import { throwError } from "./BackendError";
import { useTranslation } from "react-i18next";
import * as Keychain from "react-native-keychain"
import * as AppConfig from '../config/config';
import BackendServiceInterface from "./BackendServiceInterface";
import LoginRequestDTO from "../models/services/LoginRequestDTO";
import { RefreshTokenRequestDTO } from "../models/services/RefreshTokenRequestDTO";
import { UserDTO } from "../models/services/UserDTO";
import { CreateEventRequestDTO } from "../models/services/CreateEventRequestDTO";

const FETCH_TIMEOUT = 30;
const RECALL_API_AFTER_REFRESH_TOKEN_KEY = "401.refreshToken.OK"
const API_BASE_URL: string = AppConfig.TEST_ENDPOINT
const AUTH_OBJECT_KEY = "AUTH"

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
  clientToken: string
  exp: number
  expDateTime: string
  refreshToken: string
}

interface BackendServiceContextType {
  setAuthToken: (token: AuthToken | undefined) => void
  saveAuthToken: (token: AuthToken | undefined) => void
  hasToken: () => boolean
  removeAuthToken: () => Promise<boolean>
  beService: BackendServiceInterface
}

export const BackendServiceContext = createContext<BackendServiceContextType | null>(null)

const BackendServiceProvider = ({ children } : any) => {
  const { t } = useTranslation()

  let userToken: AuthToken | undefined;

  const setAuthToken = (token: AuthToken | undefined) => {
    userToken = token
  }

  const hasToken = () => {
    console.log("*** BackendServiceProvider - hasToken: ", userToken !== undefined)
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

      if (userToken) {
        headers = {
          ...headers,
          'Authorization': 'Bearer ' + (userToken.clientToken)
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
        if (error === RECALL_API_AFTER_REFRESH_TOKEN_KEY) {
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

  const callJSONRefresh = async (
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

      if (userToken) {
        headers = {
          ...headers,
          'Authorization': 'Bearer ' + (userToken.clientToken)
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
        throw error
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
    console.log("*** BackendService - Response -> ", response)
    try {
      if (response.status !== 200) {
        if (response.status === 401 && retry) {
          // RefreshToken
          let refreshRequest: RefreshTokenRequestDTO = {refreshToken: userToken?.refreshToken ?? ""}
          await refreshToken(refreshRequest).then((refreshResponse) => {
            setAuthToken(refreshResponse)
            saveAuthToken(refreshResponse)
            throw RECALL_API_AFTER_REFRESH_TOKEN_KEY
          }).catch((refreshError) => {
            if (refreshError === RECALL_API_AFTER_REFRESH_TOKEN_KEY) throw refreshError
            throwError({
              status: 401,
              message: t("errors.unathorized"),
              messageKey: "error.unauthorize"
            })
          })
        } else {
          throwError({
            status: response.status,
            message: t("errors.generic"),
            messageKey: "error.generic"
          })
        }
      }

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
      } 
    } catch (error: any) {
      if (error == 401) {
        throw error;
      } else {
        console.log(
          '*** BackendService:manageResponse: ' +
            response.url +
            ': got error => ',
          error.message,
        );
        throw error
      }
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

  const refreshToken = (payload: RefreshTokenRequestDTO) => {
    return callJSONRefresh(
      API_BASE_URL + "/auth/refresh", 
      HTTPMethod.POST, 
      payload, 
      HTTPContentType.json, 
      false);
  }

  const saveAuthToken = async (token: AuthToken | undefined) => {
    console.log("*** BackendService - saveAthToken - AuthToken is:\n" + JSON.stringify(token))
    userToken = token
    await Keychain.setGenericPassword(AUTH_OBJECT_KEY, JSON.stringify(token))
  }

  const removeAuthToken = async () => {
    console.log("*** BackendService - Removing token")
    setAuthToken(undefined)
    return await Keychain.resetGenericPassword()
  }

  const login = (payload: LoginRequestDTO): Promise<AuthToken> => {
    return callJSON(
      API_BASE_URL + `/auth`, 
      HTTPMethod.POST, 
      payload, 
      HTTPContentType.json
    );
  }

  const getUsersList = (): Promise<Array<UserDTO>> => {
    return callJSON(
      API_BASE_URL + `/eventi/utenti`,
      HTTPMethod.GET,
      undefined,
      HTTPContentType.json
    )
  }

  const createEvent = (payload: CreateEventRequestDTO): Promise<IJSON> => {
    return callJSON(
      API_BASE_URL + `/eventi/nuovo`,
      HTTPMethod.POST,
      payload,
      HTTPContentType.json
    )
  }

  const payEvent = (pID: number): Promise<IJSON> => {
    return callJSON(
      API_BASE_URL + `/eventi/paga/${pID}`,
      HTTPMethod.POST,
      undefined,
      HTTPContentType.json
    )
  }

  return <BackendServiceContext.Provider value={{
    setAuthToken: setAuthToken,
    saveAuthToken: saveAuthToken,
    hasToken: hasToken,
    removeAuthToken: removeAuthToken,
    beService: {
      login: login,
      getUsersList: getUsersList,
      payEvent: payEvent,
      createEvent: createEvent
    }
  }}>
    {children}
  </BackendServiceContext.Provider>
}

export default BackendServiceProvider