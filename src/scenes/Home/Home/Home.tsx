import { Alert, Image, StyleSheet, TouchableOpacity, View } from "react-native"
import Label from "../../../components/Label"
import padding from "../../../styles/padding"
import colors from "../../../styles/colors"
import { useTranslation } from "react-i18next"
import { useContext, useEffect, useState } from "react"
import { BackendServiceContext } from "../../../Providers/Backend/BackendServiceProvider"
import { useNavigation } from "@react-navigation/native"
import { AppContext } from "../../../Providers/App/AppProvider"
import EventList from "../../../components/EventList"
import { EventsListResponseDTO } from "../../../models/services/EventsListResponseDTO"
import { ScrollView } from "react-native-gesture-handler"
import {icon_add} from "../../../assets/images/index"

type HomeProps = {
  parentProps: any
  
}

function Home(props: HomeProps) {
  const { t } = useTranslation()
  const navigation = useNavigation<any>()
  const appContext = useContext(AppContext)
  const backendService = useContext(BackendServiceContext)

  const [eventListData, setEventListData] = useState<EventsListResponseDTO>()

  useEffect(() => {
    const listener = function() {
      console.log("*** Home - useEffect - Listening...")
      fetchEventList()
    }
    const unsubscribe = navigation.addListener("focus", listener)
    return unsubscribe // Cleanup
  }, [])

  const fetchEventList = () => {
    appContext?.app.handleLoader(true)
    backendService?.beService.getEventList().then((eventListResponse) => {
      setEventListData(eventListResponse)
    }).catch((eventListError: any) => {
      // Handling session expired error.
      // If even refreshToken returns 401, user must be logged out.
      if (eventListError.status === 401) {
        Alert.alert(t("general.error"), t("errors.unauthorized"), [
          {
            text: t("general.ok").toUpperCase(),
            onPress: () => {
              props.parentProps.logout()
            },
          }
        ]);
      } else {
        Alert.alert(t("general.error"), eventListError.message)
      }
    }).finally(() => {
      
      appContext?.app.handleLoader(false)
    })
  }

  return (
    <ScrollView style={{flex: 1, marginTop: padding.full}}>
      <View style={styles.container}>
        <Label 
          dimension="veryBig" 
          weight="semibold" 
          flex={5}
          alignSelf="center"
          color={colors.primaryDark} 
          style={{marginBottom: padding.half, marginLeft: padding.full}}>
            {t("home.events")}
        </Label>
        <View style={styles.addEventButtonContainer}>
          <TouchableOpacity style={styles.addEventButton} onPress={() => {navigation.navigate("CreateEvent") }}>
            <Image source={icon_add} style={styles.addIcon}/>
          </TouchableOpacity>
        </View>
      </View>
      <EventList events={eventListData}/>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  labelEvent:{

  },
  
  container: {
    height: '100%',
      flex: 1,
      marginRight: '5%',
      flexDirection: 'row',
      marginBottom: 10,
      
    },

  addEventButtonContainer: {
    flex:1
  },

  addIcon: {
      tintColor: colors.primaryDark,
      height: '100%',
      aspectRatio: 1,
    },

  addEventButton: {
      height: '100%',
      aspectRatio: 1,
      padding: 4,
      backgroundColor: colors.background,
      borderColor: colors.primaryDark,
      borderWidth: 3,
      borderRadius: '100%'
    }
});

export default Home