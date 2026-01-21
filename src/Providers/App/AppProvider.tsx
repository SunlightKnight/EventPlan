import { createContext, useContext, useEffect, useState } from "react"
import AppInterface from "./AppInterface"
import { BackHandler } from "react-native"
import Loader from "../../components/Loader"
import { AccountServiceContext } from "../Account/AccountServiceProvider"
import { BackendServiceContext } from "../Backend/BackendServiceProvider"

/**
 * appContext type.
 * 
 * @var app - Object that contains all methods available app-wide.
 */
interface AppContextType {
  app: AppInterface
}

// Context object creation. In conjunction with "useContext" hook, it allows to use all
// AppProvider functionalities. For more info:
// https://react.dev/reference/react/useContext
export const AppContext = createContext<AppContextType | null>(null)

/**
 * Component that handles app-wide functionalities (in our case, only the loader).
 * 
 * @param children - Components tree wrapped by AppProvider. 
 * @returns AppProvider component with exposed functionalities.
 */
const AppProvider = ({ children } : any) => {
  const accountService = useContext(AccountServiceContext)
  const backendService = useContext(BackendServiceContext)

  const [loading, setLoading] = useState(false)

  // Disables Android back button press while loading
  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', () => {
      if (loading) {
        return true
      } else {
        return false
      }
    });
  }, [loading])

  return <AppContext.Provider value={{
    app: {
      handleLoader: setLoading
    }
  }}>
    {children}
    <Loader loading={loading} />
  </AppContext.Provider>
}

export default AppProvider