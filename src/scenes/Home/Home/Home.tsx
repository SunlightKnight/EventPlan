import { Dimensions, View } from "react-native"
import Label from "../../../components/Label"
import padding from "../../../styles/padding"
import { HomeFlowCoordinatorProps } from "../HomeFlowCoordinator"
import CustomButton from "../../../components/CustomButton"
import colors from "../../../styles/colors"
import { formatSubtitle } from "../../../utils/Helper"
import { useTranslation } from "react-i18next"
import { useState } from "react"

type HomeProps = {
  parentProps: HomeFlowCoordinatorProps
  nav: any
}

function Home(props: HomeProps) {
  const { t } = useTranslation()
  const [eventList, setEventList] = useState([])

  return (
    <View style={{marginTop: padding.full}}>
      <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
        <Label 
          dimension="big" 
          weight="semibold" 
          color={colors.primary} 
          style={{marginBottom: padding.half, marginLeft: padding.full}}>
            {formatSubtitle(t("home.events"))}
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
      
    </View>
  )
}

export default Home