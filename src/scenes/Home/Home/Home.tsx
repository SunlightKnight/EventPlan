import { Alert, Dimensions, FlatList, View } from "react-native"
import Label from "../../../components/Label"
import padding from "../../../styles/padding"
import { HomeFlowCoordinatorProps } from "../HomeFlowCoordinator"
import CustomButton from "../../../components/CustomButton"
import colors from "../../../styles/colors"
import { useTranslation } from "react-i18next"
import { useContext, useEffect, useState } from "react"
import { EventDTO } from "../../../models/services/EventDTO"
import FloatingButton from "../../../components/FloatingButton"
import { icon_add } from "../../../assets/images"
import { BackendServiceContext } from "../../../services/BackendServiceProvider"
import EventListCell from "../../../components/EventListCell"
import { AccountServiceContext } from "../../../services/AccountServiceProvider"

type HomeProps = {
  parentProps: HomeFlowCoordinatorProps
  navigation: any
  nav: any
}

function Home(props: HomeProps) {
  const { t } = useTranslation()
  const accountService = useContext(AccountServiceContext)
  const backendService = useContext(BackendServiceContext)
  const [eventList, setEventList] = useState<Array<EventDTO>>([])
  const [isRefreshing, setIsRefreshing] = useState(false)
  let currentUserName = accountService?.aService.getUserName()

  useEffect(() => {
    const listener = function() {
      console.log("*** Home - useEffect - Listening...")
      fetchEventList()
    }
    const unsubscribe = props.navigation.addListener("focus", listener)
    return unsubscribe // Cleanup
  }, [])

  const fetchEventList = () => {
    props.parentProps.handleLoader(true)
    backendService?.beService.getEventList().then((eventListResponse) => {
      setEventList(eventListResponse.eventiList)
      console.log("Event list: ", JSON.stringify(eventListResponse))
    }).catch((eventListError: any) => {
      if (eventListError.status === 401) {
        Alert.alert(t("general.error"), t("errors.unauthorized"), [
          {
            text: t("general.ok").toUpperCase(),
            onPress: () => {
              props.parentProps.manageLogout()
            },
          }
        ]);
      } else {
        Alert.alert(t("general.error"), eventListError.message)
      }
    }).finally(() => {
      setIsRefreshing(false)
      props.parentProps.handleLoader(false)
    })
  }

  return (
    <View style={{flex: 1, marginTop: padding.full}}>
      <Label 
        dimension="big" 
        weight="semibold" 
        color={colors.primaryDark} 
        style={{marginBottom: padding.half, marginLeft: padding.full}}>
          {t("home.events")}
      </Label>

      {eventList.length > 0 ? (
        <FlatList
          data={eventList}
          renderItem={({item}) => 
            <EventListCell 
              event={item} 
              currentUsername={currentUserName ?? ""}
              onCellPress={() => {props.nav.eventDetail(item)}} />}
          keyExtractor={(item: EventDTO) => String(item.id)}
          onRefresh={() => {
            setIsRefreshing(true)
            fetchEventList()}}
          refreshing={isRefreshing}
          contentContainerStyle={{paddingBottom:padding.quintuple}}
            />
      ) : (
        <CustomButton 
          text={t("home.create_event")} 
          textStyle={{fontWeight: "800"}}
          type="transparent" 
          onPress={() => props.nav.createEvent()}
          style={{
            height: 100, 
            width: Dimensions.get("screen").width - 100, 
            alignSelf: "center", 
            marginTop: padding.double,
            borderWidth: 3}} />
      )}

      {eventList.length > 0 ? (
        <FloatingButton 
          width={60} 
          height={60} 
          radius={30} 
          bottomMargin={padding.full} 
          rightMargin={padding.full} 
          buttonIcon={icon_add} 
          buttonIconColor={colors.white} 
          onPress={() => { props.nav.createEvent() }} />
      ) : null}
      
    </View>
  )
}

export default Home