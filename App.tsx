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

import BackendServiceProvider from './src/Providers/Backend/BackendServiceProvider';
import AppFlowCoordinator from './src/scenes/AppFlowCoordinator';
import AccountServiceProvider from './src/Providers/Account/AccountServiceProvider';
import styles from './src/styles/styles';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import AppProvider from './src/Providers/App/AppProvider';

function App(): React.JSX.Element {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <KeyboardProvider>
        {/* App context, that allows all children to use exposed functionalities. */}
        <AppProvider>
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
        </AppProvider>
      </KeyboardProvider>
    </GestureHandlerRootView>
  );
}

export default App;
