import { useCallback, useContext, useEffect, useState } from 'react';
import {
  BackHandler,
  SafeAreaView,
  View,
} from 'react-native';

import * as Keychain from "react-native-keychain"

import OnboardingFlowCoordinator from "./Onboarding/OnboardingFlowCoordinator"
import HomeFlowCoordinator from './Home/HomeFlowCoordinator';
import { AccountServiceContext } from '../services/AccountServiceProvider';
import { AuthToken, BackendServiceContext } from '../services/BackendServiceProvider';

import Loader from "./../components/Loader"
import styles from '../styles/styles';
import colors from '../styles/colors';

export default function AppFlowCoordinator() {
  const [loading, setLoading] = useState(false)
  const accountService = useContext(AccountServiceContext)
  const backendService = useContext(BackendServiceContext)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    let tokenObject = await retrieveTokenObject()
    let user = accountService?.aService.getAccount()

    if (tokenObject && backendService) {
      backendService.setAuthToken(tokenObject.accessToken, "user")
    }

    if (user && accountService) {
      accountService.aService.setAccount(user)
    }

    console.log("*** AppFlowCoordinator - LOADED")
  }

  const retrieveTokenObject = async () => {
    try {
      const token = await Keychain.getGenericPassword()
      const tokenObject = token ? (JSON.parse(token.password) as AuthToken) : undefined
      return tokenObject
    } catch (error) {
      console.log("Error retrieving token object: " + error)
    }
  }

  const presentLogin = () => {
    
  }
  
  const done = (name: string) => { 
    switch (name) {
      case "OnboardingFlowCoordinator":
        
        break
      case "MainFlowCoordinator":
        
        break
    }
  }

  const handleLoader = useCallback(() => {
    setLoading(!loading)
    if (loading) {
      BackHandler.addEventListener('hardwareBackPress', handleAndroidBackButtonPress);
    } else {
      BackHandler.removeEventListener('hardwareBackPress', handleAndroidBackButtonPress);
    }
  }, [loading])

  const handleAndroidBackButtonPress = () => {
    return true
  }

  let children = null
    if (backendService?.hasToken("user")) {
      children = <HomeFlowCoordinator handleLoader={handleLoader} />
    } else {
      children = <OnboardingFlowCoordinator handleLoader={handleLoader} />
    }

  return (
    <SafeAreaView>
      <View style={styles.container}>
        {children}
        <Loader loading={loading} />
      </View>
    </SafeAreaView>
  )
}
