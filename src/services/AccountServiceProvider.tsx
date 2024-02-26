import { createContext } from "react"
import AccountServiceInterface from "./AccountServiceInterface"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { AccountDataDTO } from "../models/services/AccountDataDTO"

interface AccountServiceContextType {
  aService: AccountServiceInterface
}

export const USER_DATA_KEY = "USER_DATA"

export const AccountServiceContext = createContext<AccountServiceContextType | null>(null)

const AccountServiceProvider = ({ children } : any) => {
  const setAccount = async (userData: AccountDataDTO) => {
    try {
      await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(userData))
    } catch (error) {
      console.log("*** AccountServiceProvider: Error retrieving user data: " + error)
    }
  }
  
  const getAccount = async () => {
    try {
      const userData = await AsyncStorage.getItem(USER_DATA_KEY)
      const user = userData ? (JSON.parse(userData) as AccountDataDTO) : undefined
      return user
    } catch (error) {
      console.log("*** AccountServiceProvider: Error retrieving user data: " + error)
    }
  }

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
      removeAccount: removeAccount
    }
  }}>
    {children}
  </AccountServiceContext.Provider>
}

export default AccountServiceProvider