/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {
  StatusBar,
  View,
} from 'react-native';

import './src/localization/i18n';

import BackendServiceProvider from './src/services/BackendServiceProvider';
import AppFlowCoordinator from './src/scenes/AppFlowCoordinator';
import AccountServiceProvider from './src/services/AccountServiceProvider';
import styles from './src/styles/styles';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

function App(): React.JSX.Element {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      {/* Backend service context, that allows all children to use his functions (Manages APIs). */}
      <BackendServiceProvider> 
        {/* Account service context, that allows all children to use his functions (Manages user account). */}
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
