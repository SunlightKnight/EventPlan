import { createContext, useState } from "react"
import AccountServiceInterface from "./AccountServiceInterface"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { AccountDataDTO } from "../models/services/AccountDataDTO"

interface AccountServiceContextType {
  aService: AccountServiceInterface
}

export const USER_DATA_KEY = "USER_DATA"

export const AccountServiceContext = createContext<AccountServiceContextType | null>(null)

const AccountServiceProvider = ({ children } : any) => {
  const [userName, setUserName] = useState("")

  const setAccount = async (userName: string) => {
    try {
      await AsyncStorage.setItem(USER_DATA_KEY, userName)
      setUserName(userName)
    } catch (error) {
      console.log("*** AccountServiceProvider: Error retrieving user data: " + error)
    }
  }
  
  const getAccount = async () => {
    try {
      const user = await AsyncStorage.getItem(USER_DATA_KEY)
      const userName = user ? (user as string) : undefined
      setUserName(userName ?? "")
    } catch (error) {
      console.log("*** AccountServiceProvider: Error retrieving user data: " + error)
    }
  }

  const getUserName = () => {
    return userName
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
      getUserName: getUserName,
      removeAccount: removeAccount
    }
  }}>
    {children}
  </AccountServiceContext.Provider>
}

export default AccountServiceProvider