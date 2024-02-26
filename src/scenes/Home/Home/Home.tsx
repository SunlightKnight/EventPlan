import { Dimensions, View } from "react-native"
import Label from "../../../components/Label"
import padding from "../../../styles/padding"
import { HomeFlowCoordinatorProps } from "../HomeFlowCoordinator"
import CustomButton from "../../../components/CustomButton"
import colors from "../../../styles/colors"
import { useTranslation } from "react-i18next"
import { useState } from "react"
import { EventDTO } from "../../../models/services/EventDTO"
import FloatingButton from "../../../components/FloatingButton"
import { icon_add } from "../../../assets/images"

type HomeProps = {
  parentProps: HomeFlowCoordinatorProps
  nav: any
}

function Home(props: HomeProps) {
  const { t } = useTranslation()
  const [eventList, setEventList] = useState([])
  const testEvent: EventDTO = {
    adminId: 1, 
    eventName: "Event TEST", 
    eventDate: "2024-03-15T01:30:00.000Z",
    eventDescription: "TEST TEST TEST", 
    eventAmount: "50.00", 
    participants: [
      {userId: 0, firstName: "Mario", lastName: "Giallo", email: "test@test.com"},
      {userId: 1, firstName: "Maria", lastName: "Blu", email: "test@test.com"},
      {userId: 2, firstName: "Hulk", lastName: "Hogan", email: "test@test.com"}
    ]
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
        <Label>LISTA</Label>
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

      <CustomButton 
        text={"detail"} 
        type="transparent" 
        onPress={() => props.nav.eventDetail(testEvent)} />

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