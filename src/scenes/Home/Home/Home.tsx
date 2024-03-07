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
  let currentUserName = accountService?.aService.getUserName()
  // const testEvent: any = {
  //   id: 0,
  //   nome: "TEST EVENT",
  //   descr: "Testing event detail",
  //   dataEv: "2022-03-15 12:30:22",
  //   spesa: 150,
  //   creatore: {
  //     username: "mario",
  //     nome: "Mario",
  //     cognome: "Giallo"
  //   },
  //   partecipantiList: [
  //     {
  //       username: "mario",
  //       nome: "Mario",
  //       cognome: "Giallo",
  //       idPartecipante: 0,
  //       spesa: 50,
  //       dataPagamento: "2024-02-29T13:36:05.452Z"
  //     },
  //     {
  //       username: "samuele",
  //       nome: "Samuele",
  //       cognome: "Tonelli",
  //       idPartecipante: 3,
  //       spesa: 50,
  //       dataPagamento: ""
  //     },
  //     {
  //       username: "elisa",
  //       nome: "Elisa",
  //       cognome: "Festa",
  //       idPartecipante: 1,
  //       spesa: 50,
  //       dataPagamento: ""
  //     },
  //     {
  //       username: "gabriele",
  //       nome: "Gabriele",
  //       cognome: "Valentini",
  //       idPartecipante: 2,
  //       spesa: 50,
  //       dataPagamento: "2024-02-29T13:36:05.452Z"
  //     }
  //   ]
  // }

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
      Alert.alert(t("general.error"), eventListError.message)
    }).finally(() => {
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

      {/* <CustomButton 
        text={"detail"} 
        type="transparent" 
        onPress={() => props.nav.eventDetail(testEvent)} /> */}

      {eventList.length > 0 ? (
        <FloatingButton 
          width={60} 
          height={60} 
          radius={30} 
          bottomMargin={padding.double} 
          rightMargin={padding.double} 
          buttonIcon={icon_add} 
          buttonIconColor={colors.white} 
          onPress={() => { props.nav.createEvent() }} />
      ) : null}
      
    </View>
  )
}

export default Home