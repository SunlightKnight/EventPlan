import { useContext, useEffect, useState } from 'react';
import {
  BackHandler,
  View,
} from 'react-native';

import * as Keychain from "react-native-keychain"

import OnboardingFlowCoordinator from "./Onboarding/OnboardingFlowCoordinator"
import HomeFlowCoordinator from './Home/HomeFlowCoordinator';
import { AccountServiceContext } from '../Providers/Account/AccountServiceProvider';
import { AuthToken, BackendServiceContext } from '../Providers/Backend/BackendServiceProvider';

import styles from '../styles/styles';
import { AppContext } from '../Providers/App/AppProvider';

export default function AppFlowCoordinator() {
  const appContext = useContext(AppContext)
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
      appContext?.app.handleLoader(false)
    } else {
      appContext?.app.handleLoader(false)
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

  // If token is present (hence, the user is logged in) HomeFlowCoordinator is rendered.
  // Otherwise, the user will see OnboardingFlowCoordinator and will only be able to login.
  // "handleLoader" and "manageLogout" are passed as props to both coordinators.
  // 
  let children = null
  if (backendService?.hasToken()) {
    children = <HomeFlowCoordinator/>
  } else {
    children = <OnboardingFlowCoordinator/>
  }

  return (
    <View style={styles.container}>
      {children}
    </View>
  )
}
