import { useEffect, useRef, useState } from "react";
import colors from "../../styles/colors";
import { HEADER_HEIGHT, slideAnimation } from "../../styles/styles";
import Home from "./Home/Home";
import { createStackNavigator } from "@react-navigation/stack";
import { Image, View, TouchableOpacity, Platform } from "react-native";
import { DefaultTheme, NavigationContainer, NavigationState } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import EventDetail from "./EventDetail/EventDetail";
import EventPayment from "./EventPayment/EventPayment";
import { icon_back, icon_logout } from "../../assets/images";
import padding from "../../styles/padding";
import CreateEvent from "./CreateEvent/CreateEvent";
import { EventDTO } from "../../models/services/EventDTO";

export type HomeFlowCoordinatorProps = {
  handleLoader: () => void
  manageLogout: () => void
}

const Stack = createStackNavigator()
const Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.paleGrey
  },
};

function HomeFlowCoordinator(props: HomeFlowCoordinatorProps) {
  const [showLogout, setShowLogout] = useState(true)
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
    headerTintColor: colors.white,
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
    headerBackImage: () => (
      <Image
        source={icon_back}
        resizeMode="contain"
        style={{
          width: 30, 
          height: 30, 
          tintColor: colors.white, 
          marginHorizontal: padding.half,
          marginTop: Platform.OS === "ios" ? padding.full : padding.double
        }} />
    ),
    headerRight: () => {
      return showLogout ? (
        <TouchableOpacity style={{
          marginRight: padding.half
        }}
        onPress={() => { props.manageLogout() }}>
          <Image 
            source={icon_logout} 
            resizeMode="contain" 
            style={{
              width: 30, 
              height: 30,  
              tintColor: colors.white}} />
        </TouchableOpacity>
      ) : null
    },
  };
  
  useEffect(() => {
    console.log("*** HomeFlowCoordinator - RENDERED")
  }, [])

  const navigateToCreateEvent = () => {
    if (navRef) {
      setShowLogout(false)
      navRef.current.navigate("CreateEvent")
    }
  }

  const navigateToEventDetail = (eventData: EventDTO) => {
    if (navRef) {
      setShowLogout(false)
      navRef.current.navigate("EventDetail", { eventData: eventData })
    }
  }

  const navigateToEventPayment = (paymentAmount: string) => {
    if (navRef) {
      navRef.current.navigate("EventPayment", { paymentAmount: paymentAmount })
    }
  }

  const pages: {[key: string]: any} = {
    Home: {
      component: Home,
      parentProps: props,
      nav: { 
        "eventDetail": navigateToEventDetail, 
        "createEvent": navigateToCreateEvent, 
        "showLogout": setShowLogout 
      }
    },
    CreateEvent: {
      component: CreateEvent,
      parentProps: props,
      nav: { "showLogout": setShowLogout }
    },
    EventDetail: {
      component: EventDetail,
      parentProps: props,
      nav: { "eventPayment": navigateToEventPayment }
    },
    EventPayment: {
      component: EventPayment,
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
          if (navigationState?.routes.length === 1 && navigationState.routes[0].name === "Home") {
            setShowLogout(true)
          }
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