import { Alert, Button, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native"
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
import { icon_add, icon_filter } from "../../../assets/images/index"
import Modal from "react-native-modal"
import DropShadow from "react-native-drop-shadow"

type HomeProps = {
  parentProps: any

}

function Home(props: HomeProps) {
  const { t } = useTranslation()
  const navigation = useNavigation<any>()
  const appContext = useContext(AppContext)
  const backendService = useContext(BackendServiceContext)

  const [eventListData, setEventListData] = useState<EventsListResponseDTO>()
  const [active, setactive] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false)

  useEffect(() => {
    const listener = function () {
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
    <ScrollView style={{ flex: 1, marginTop: padding.full }}>
      <Modal
        isVisible={active}
        onBackdropPress={() => { console.warn("closed"); }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Label style={styles.labelFilter}>
              {t("filter.filters")}
            </Label>
            <DropShadow style={styles.generalShadow}>

            </DropShadow>
            <DropShadow style={styles.generalShadow}>

            </DropShadow>
            <DropShadow style={styles.generalShadow}>

            </DropShadow>
            <View style={styles.modalButtonContainer}>
              <View style={styles.addEventButtonContainer}>
                <TouchableOpacity style={styles.modalButton} onPress={() => { setactive(!active) }}>
                  <Label style={styles.labelFilterButton}>
                    {t("general.confirm")}
                  </Label>
                </TouchableOpacity>
              </View>
              <View style={styles.addEventButtonContainer}>
                <TouchableOpacity style={styles.modalButton} onPress={() => { setactive(!active) }}>
                  <Label style={styles.labelFilterButton}>
                    {t("general.cancel")}
                  </Label>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
      <View style={styles.container}>
        <Label style={styles.labelEvent}>
          {t("home.events")}
        </Label>
        <View style={styles.filterButtonContainer}>
          <TouchableOpacity style={styles.addEventButton} onPress={() => { setactive(!active) }}>
            <Image source={icon_filter} style={styles.addIcon} />
          </TouchableOpacity>
        </View>
        <View style={styles.addEventButtonContainer}>
          <TouchableOpacity style={styles.addEventButton} onPress={() => { navigation.navigate("CreateEvent") }}>
            <Image source={icon_add} style={styles.addIcon} />
          </TouchableOpacity>
        </View>
      </View>
      <EventList events={eventListData} />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  labelEvent: {
    flex: 5,
    alignSelf: 'center',
    color: colors.primaryDark,
    marginBottom: padding.quarter,
    marginLeft: padding.full,
    fontWeight: 'bold',
    fontSize: 30

  },

  labelFilterButton: {
    alignSelf: 'center',
    color: colors.primaryDark,
    fontWeight: '500',
    fontSize: 20,
    margin: 5,
  },

  labelFilter: {
    flex: 5,
    alignSelf: 'center',
    color: colors.primaryDark,
    marginBottom: padding.quarter,
    fontWeight: 'bold',
    fontSize: 30
  },

  container: {
    height: '100%',
    flex: 1,
    marginRight: '9%',
    flexDirection: 'row',
    marginBottom: 10,
  },

  modalContainer: {
    flex: 1,
    backgroundColor: "transparent",
    alignItems: 'center',
    justifyContent: 'center',
  },

  modalButtonContainer: {
    height: '100%',
    flex: 1,
    flexDirection: 'row',
  },

  modalView: {
    backgroundColor: colors.background,
    height: '50%',
    width: '80%',
    alignItems: "center",
    justifyContent: "center"
  },

  modalButton: {
    height: '70%',
    width: '100%',
    aspectRatio: 3,
    alignSelf: 'center',
    backgroundColor: colors.background,
    borderColor: colors.primaryDark,
    borderWidth: 3,
  },

  addEventButtonContainer: {
    flex: 1
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
  },

  filterButtonContainer: {
    flex: 1,
    marginRight: '10%'
  },

  generalShadow: {
    shadowColor: colors.mainText,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: .3,
    shadowRadius: 6,
  },


});

export default Home