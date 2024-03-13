import { useContext, useEffect, useState } from 'react';
import {
  BackHandler,
  View,
} from 'react-native';

import * as Keychain from "react-native-keychain"

import OnboardingFlowCoordinator from "./Onboarding/OnboardingFlowCoordinator"
import HomeFlowCoordinator from './Home/HomeFlowCoordinator';
import { AccountServiceContext } from '../services/AccountServiceProvider';
import { AuthToken, BackendServiceContext } from '../services/BackendServiceProvider';

import Loader from "./../components/Loader"
import styles from '../styles/styles';

export default function AppFlowCoordinator() {
  // State variable that manages the Loader's (see line 98) operation.
  const [loading, setLoading] = useState(true)
  const accountService = useContext(AccountServiceContext)
  const backendService = useContext(BackendServiceContext)

  // useEffect hook: no dependencies between the [] are defined, hence it's called only once.
  // For more info: https://react.dev/reference/react/useEffect
  useEffect(() => {
    loadData()
  }, [])

  // Retrieves user's username and saved token.
  const loadData = async () => {
    let tokenObject = await retrieveTokenObject()
    await accountService?.aService.getAccount()

    if (tokenObject && backendService) {
      backendService.setAuthToken(tokenObject)
      setLoading(false)
    } else {
      setLoading(false)
    }

    console.log("*** AppFlowCoordinator - LOADED")
  }

  // Retrieves token object from Keychain.
  const retrieveTokenObject = async () => {
    try {
      const token = await Keychain.getGenericPassword()
      const tokenObject = token ? (JSON.parse(token.password) as AuthToken) : undefined
      console.log("*** AppFlowCoordinator - Token retrieved: ", JSON.stringify(tokenObject))
      return tokenObject
    } catch (error) {
      console.log("Error retrieving token object: " + error)
    }
  }

  // Handles Loader by using "setLoader" function (see line 19).
  const handleLoader = (loading: boolean) => {
    setLoading(loading)
    if (loading) {
      BackHandler.addEventListener('hardwareBackPress', handleAndroidBackButtonPress);
    } else {
      BackHandler.removeEventListener('hardwareBackPress', handleAndroidBackButtonPress);
    }
  }

  // Disables Android back button while Loader is active.
  const handleAndroidBackButtonPress = () => {
    return true
  }

  // Handles logout.
  // Deletes account from AsyncStorage and token from Keychain.
  const manageLogout = async () => {
    let accountRemoved = await accountService?.aService.removeAccount()
    let tokenRemoved = await backendService?.removeAuthToken()

    if (tokenRemoved && accountRemoved) {
      setLoading(false)
    } else {
      console.log("*** AppFlowCoordinator - A problem ocurred while logging user out")
      setLoading(false)
    }
  }

  // If token is present (hence, the user is logged in) HomeFlowCoordinator is rendered.
  // Otherwise, the user will see OnboardingFlowCoordinator and will only be able to login.
  // "handleLoader" and "manageLogout" are passed as props to both coordinators.
  // 
  let children = null
  if (backendService?.hasToken()) {
    children = <HomeFlowCoordinator handleLoader={handleLoader} manageLogout={manageLogout} />
  } else {
    children = <OnboardingFlowCoordinator handleLoader={handleLoader} />
  }

  return (
    <View style={styles.container}>
      {children}
      <Loader loading={loading} />
    </View>
  )
}
