import { useCallback, useContext, useEffect, useState } from 'react';
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
  const [loading, setLoading] = useState(true)
  const accountService = useContext(AccountServiceContext)
  const backendService = useContext(BackendServiceContext)

  useEffect(() => {
    loadData()
  }, [])

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

  // const done = (name: string) => { 
  //   switch (name) {
  //     case "OnboardingFlowCoordinator":
        
  //       break
  //     case "MainFlowCoordinator":
        
  //       break
  //   }
  // }

  const handleLoader = (loading: boolean) => {
    setLoading(loading)
    if (loading) {
      BackHandler.addEventListener('hardwareBackPress', handleAndroidBackButtonPress);
    } else {
      BackHandler.removeEventListener('hardwareBackPress', handleAndroidBackButtonPress);
    }
  }

  const handleAndroidBackButtonPress = () => {
    return true
  }

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
