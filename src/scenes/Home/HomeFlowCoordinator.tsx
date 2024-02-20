import { useEffect, useRef } from "react";
import Label from "../../components/Label";
import colors from "../../styles/colors";
import padding from "../../styles/padding";
import commonStyles, { HEADER_HEIGHT, slideAnimation } from "../../styles/styles";
import Home from "./Home/Home";
import { createStackNavigator } from "@react-navigation/stack";
import { View } from "react-native";
import { DefaultTheme, NavigationContainer, NavigationState } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { getTopInset } from "../../utils/Helper";

type HomeFlowCoordinatorProps = {
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

function HomeFlowCoordinator(props: HomeFlowCoordinatorProps) {
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
    headerBackground: () => (
      <View
        style={{
          width: '100%',
          height: HEADER_HEIGHT,
          backgroundColor: colors.primary
        }}
      />
    ),
  };
  
  useEffect(() => {
    console.log("*** HomeFlowCoordinator - RENDERED")
  }, [])

  const pages: {[key: string]: any} = {
    Home: {
      component: Home,
      parentProps: props,
      nav: { }
    }
  };

  return ( 
    <View style={{width: "100%", height: "100%"}}>
      <NavigationContainer
        ref={navRef}
        theme={Theme}
        onStateChange={(navigationState: NavigationState | undefined) => {
          console.log(`*** OnBoarding:onStateChange: navigationState=${JSON.stringify(navigationState)}`)
        }}>
        
        <Stack.Navigator
          initialRouteName={'Home'}
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

export default HomeFlowCoordinator