import { createContext, useState } from "react"
import AccountServiceInterface from "./AccountServiceInterface"
import AsyncStorage from "@react-native-async-storage/async-storage"

// Key used to save AuthToken object in AsyncStorage. It's basically a reference, so when we look for "USER_DATA_KEY"
// inside AsyncStorage, we find the object we are interested in.
export const USER_DATA_KEY = "USER_DATA"

/**
 * AccountServiceContext type.
 * 
 * @var aService - Object that contains all methods to save, get and delete user's username.
 */
interface AccountServiceContextType {
  aService: AccountServiceInterface
}

// Context object creation. In conjunction with "useContext" hook, it allows to use all
// AccountServiceProvider functionalities. For more info:
// https://react.dev/reference/react/useContext
export const AccountServiceContext = createContext<AccountServiceContextType | null>(null)

/**
 * Component that handles locally save user info (in our case, only username value).
 * 
 * @param children - Components tree wrapped by AccountServiceProvider. 
 * @returns AccountServiceProvider component with exposed functionalities.
 */
const AccountServiceProvider = ({ children } : any) => {
  // State variable that holds user's username
  const [userName, setUserName] = useState("")

  /**
   * Async function used to save the user's username in AsyncStorage.
   * 
   * @param userName - user's username, taken from the Login screen.
   */
  const setAccount = async (userName: string) => {
    try {
      await AsyncStorage.setItem(USER_DATA_KEY, userName)
      setUserName(userName)
    } catch (error) {
      console.log("*** AccountServiceProvider: Error retrieving user data: " + error)
    }
  }
  
  /**
   * Async function used to retrieve user's username from AsyncStorage.
   */
  const getAccount = async () => {
    try {
      const user = await AsyncStorage.getItem(USER_DATA_KEY)
      const userName = user ? (user as string) : undefined
      setUserName(userName ?? "")
    } catch (error) {
      console.log("*** AccountServiceProvider: Error retrieving user data: " + error)
    }
  }

  /**
   * Sync function (use this throughout the app) to retrieve user's username.
   * 
   * @returns current user's username.
   */
  const getUserName = () => {
    return userName
  }

  /**
   * Async function used to remove saved username from AsyncStorage.
   * 
   * @returns true if deletion is successful, false otherwise.
   */
  const removeAccount = async () => {
    try { 
      await AsyncStorage.removeItem(USER_DATA_KEY)
      return true
    } catch (error) {
      console.log("*** AccountServiceProvider: Error removing account: " + error)
      return false
    }
  }

  return <AccountServiceContext.Provider value={{
    aService: {
      setAccount: setAccount,
      getAccount: getAccount,
      getUserName: getUserName,
      removeAccount: removeAccount
    }
  }}>
    {children}
  </AccountServiceContext.Provider>
}

export default AccountServiceProvider