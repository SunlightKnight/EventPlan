import { Dimensions, View } from "react-native"
import Label from "../../../components/Label"
import padding from "../../../styles/padding"
import { HomeFlowCoordinatorProps } from "../HomeFlowCoordinator"
import CustomButton from "../../../components/CustomButton"
import colors from "../../../styles/colors"
import { useTranslation } from "react-i18next"
import { useState } from "react"
import { EventDTO } from "../../../models/services/EventDTO"

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
    <View style={{marginTop: padding.full}}>
      <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
        <Label 
          dimension="big" 
          weight="semibold" 
          color={colors.primaryDark} 
          style={{marginBottom: padding.half, marginLeft: padding.full}}>
            {t("home.events")}
        </Label>
        {eventList.length > 0 ? (
          <CustomButton 
            text={"+"} 
            type="secondary"
            textStyle={{fontWeight: "400", fontSize: 30, paddingBottom: padding.sixth}} 
            onPress={() => { props.nav.createEvent() }} 
            style={{width: 50, height: 40, marginVertical: 0, borderRadius: padding.full}} />
        ) : null}
      </View>

      {eventList.length > 0 ? (
        <Label>LISTA</Label>
      ) : (
        <CustomButton 
          text={t("home.create_event")} 
          type="transparent" 
          onPress={() => props.nav.createEvent()}
          style={{
            height: 100, 
            width: Dimensions.get("screen").width - 100, 
            alignSelf: "center", 
            marginTop: padding.double}} />
      )}

      <CustomButton 
        text={"detail"} 
        type="transparent" 
        onPress={() => props.nav.eventDetail(testEvent)} />
      
    </View>
  )
}

export default Home