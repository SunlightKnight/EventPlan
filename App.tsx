/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {
  Platform,
  StatusBar,
  View,
} from 'react-native';

import './src/localization/i18n';

import BackendServiceProvider from './src/services/BackendServiceProvider';
import AppFlowCoordinator from './src/scenes/AppFlowCoordinator';
import AccountServiceProvider from './src/services/AccountServiceProvider';
import DeviceInfo from 'react-native-device-info';
import styles from './src/styles/styles';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

function App(): React.JSX.Element {
  const getTopInset = () => {
    if (Platform.OS === "android") {
      return StatusBar.currentHeight
    } else if (Platform.OS === "ios") {
      return (DeviceInfo.hasNotch() || DeviceInfo.hasDynamicIsland()) ? 30 : 0
    } else {
      return 0
    }
  }

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <BackendServiceProvider>
        <AccountServiceProvider>
          <View style={styles.container}>
            <StatusBar
              translucent
              barStyle={"dark-content"}
              backgroundColor={'transparent'}
            />
            <AppFlowCoordinator />
          </View>
        </AccountServiceProvider>
      </BackendServiceProvider>
    </GestureHandlerRootView>
  );
}

export default App;
