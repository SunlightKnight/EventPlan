import { useEffect, useRef } from "react";
import { DefaultTheme, NavigationContainer, NavigationState } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import colors from "../../styles/colors";

import Login from "../Onboarding/Login/Login"
import { HEADER_HEIGHT, slideAnimation } from "../../styles/styles";
import commonStyles from "../../styles/styles";
import { Image, Platform, View } from "react-native";
import Registration from "./Registration/Registration";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { icon_back } from "../../assets/images";
import padding from "../../styles/padding";

export type OnboardingFlowCoordinatorProps = {
  // Function passed down as prop from AppFlowCoordinator.
  handleLoader: (l: boolean) => void
}

// Stack navigator creation. For more info: https://reactnavigation.org/docs/stack-navigator/
const Stack = createStackNavigator()
// Stack navigator theme. For more info: https://reactnavigation.org/docs/themes/
const Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.paleGrey
  },
};

function OnboardingFlowCoordinator(props: OnboardingFlowCoordinatorProps) {
  // Navigation ref. By using the useRef hook, we assure that its value never changes between renders.
  const navRef = useRef<any>()

  // Options defined for each navigator screen. For more info: https://reactnavigation.org/docs/screen-options/
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
    headerBackImage: () => (
      <Image
        source={icon_back}
        resizeMode="contain"
        style={{
          width: 30, 
          height: 30, 
          tintColor: colors.primaryDark, 
          marginHorizontal: padding.half,
          marginTop: Platform.OS === "ios" ? padding.full : padding.double
        }} />
    )
  };
  
  useEffect(() => {
    console.log("*** OnboardingFlowCoordinator - RENDERED")
  }, [])

  const navigateToRegistration = () => {
    if (navRef) {
      // "navigate" is the method that allows to go from a screen to another.
      // For more info: https://reactnavigation.org/docs/navigating/#summary
      navRef.current.navigate("Registration")
    }
  }

  // Simple JS object that contains all the screens in the stack.
  const pages: {[key: string]: any} = {
    Login: {
      // The actual component (aka screen), that the navigator contains.
      component: Login,
      // Props passed down from parent: in this case OnboardingFlowCoordinator.
      parentProps: props,
      // Object that contains references to navigation functions.
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
          console.log(`*** OnBoarding:onStateChange: navigationState=${JSON.stringify(navigationState)}`)
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
                      <SafeAreaProvider style={{paddingTop: HEADER_HEIGHT}}>
                        <PageComponent
                          {...props}
                          parentProps={page.parentProps}
                          nav={page.nav ? page.nav : undefined}
                        />
                      </SafeAreaProvider>
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