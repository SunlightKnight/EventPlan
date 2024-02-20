import { useEffect, useRef } from "react";
import { DefaultTheme, NavigationContainer, NavigationState } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import colors from "../../styles/colors";

import Login from "../Onboarding/Login/Login"
import { slideAnimation } from "../../styles/styles";
import commonStyles from "../../styles/styles";
import { View } from "react-native";
import Registration from "./Registration/Registration";

export type OnboardingFlowCoordinatorProps = {
  handleLoader: () => void
}

const Stack = createStackNavigator()
const Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.white
  },
};

function OnboardingFlowCoordinator(props: OnboardingFlowCoordinatorProps) {
  const navRef = useRef<any>()

  const screenOptions = {
    title: '',
    backgroundColor: colors.white,
    headerStyle: {
      backgroundColor: colors.primary,
      shadowColor: 'transparent',
      elevation: 0, // https://github.com/react-navigation/react-navigation/issues/865
      height: 0,
    },
    headerTintColor: colors.primary,
    headerBackTitleVisible: false,
    cardStyleInterpolator: slideAnimation,
    gestureEnabled: false,
    headerMode: "float"
  };
  
  useEffect(() => {
    console.log("*** OnboardingFlowCoordinator - RENDERED")
  }, [])

  const navigateToRegistration = () => {
    console.log("REACHED ONBOARDINGFLOW ", navRef.current)
    if (navRef) {
      navRef.current.navigate("Registration")
    }
  }

  const pages: {[key: string]: any} = {
    Login: {
      component: Login,
      parentProps: props,
      nav: { "registration": navigateToRegistration }
    },
    Registration: {
      component: Registration,
      parentProps: props
    }
  };

  return (
    <View style={commonStyles.container}>
      <NavigationContainer
        ref={navRef}
        theme={Theme}
        onStateChange={(navigationState: NavigationState | undefined) => {
          console.log(`*** OnBoarding:onStateChange: navigationState=${JSON.stringify(navigationState,)}`)
        }}>
        <Stack.Navigator
          initialRouteName={'Login'}
          screenOptions={{cardStyle: {backgroundColor: 'transparent'}}}>
            {Object.keys(pages).map((key: string) => {
              const page = pages[key];
              const PageComponent = page.component;
              return (
                <Stack.Screen
                  key={key}
                  name={key}
                  options={screenOptions}>
                  {(props) => {
                    return (
                      <PageComponent
                        {...props}
                        parentProps={page.parentProps}
                        nav={page.nav ? page.nav : undefined}
                      />
                    );
                  }}
                </Stack.Screen>
              );
          })}
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  )
}

export default OnboardingFlowCoordinator