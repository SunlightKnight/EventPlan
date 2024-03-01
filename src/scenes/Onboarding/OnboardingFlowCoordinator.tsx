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
  handleLoader: (l: boolean) => void
}

const Stack = createStackNavigator()
const Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.paleGrey
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