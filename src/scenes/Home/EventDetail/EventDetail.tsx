import { ScrollView, StyleSheet, View } from "react-native"
import CustomButton from "../../../components/CustomButton"
import Label from "../../../components/Label"
import { HomeFlowCoordinatorProps } from "../HomeFlowCoordinator"
import { useTranslation } from "react-i18next"
import colors from "../../../styles/colors"
import padding from "../../../styles/padding"
import { formatDate } from "../../../utils/Helper"
import { UserDTO } from "../../../models/services/UserDTO"

type EventDetailProps = {
  parentProps: HomeFlowCoordinatorProps
  route?: any
  nav: any
}

function EventDetail(props: EventDetailProps) {
  const { t } = useTranslation()
  const { eventData } = props.route.params

  return (
    <ScrollView>
      <View style={{marginTop: padding.full}}>
        <Label 
          dimension="big" 
          weight="semibold" 
          color={colors.primaryDark} 
          style={{marginBottom: padding.onehalf, marginLeft: padding.full}}>
            {t("detail.detail")}
        </Label>

        <View style={detailStyles.detailContainer}>
          <Label 
            dimension="normal" 
            weight="semibold" 
            color={colors.primaryDark}>
              {eventData.eventName}
          </Label>
          <Label 
            dimension="small" 
            color={colors.black}
            style={{marginBottom: padding.half}}>
              {formatDate(eventData.eventDate, "YYYY-MM-DDTHH:mm:SS.sssZ", "DD/MM/YYYY HH:mm")}
          </Label>

          <Label 
            dimension="normal" 
            color={colors.black}
            style={{marginBottom: padding.half}}>
              {eventData.eventDescription}
          </Label>

          <View style={{flexDirection: "row", alignItems: "center"}}>
            <Label 
              dimension="normal" 
              weight="semibold" 
              color={colors.primaryDark} 
              style={{height: 40, marginTop: padding.full}}>
                {t("detail.participants")}
            </Label>
            <View style={{
              marginHorizontal: padding.full, 
              width: 30, 
              height: 30, 
              backgroundColor: "transparent", 
              borderWidth: 1, 
              borderColor: colors.primary, 
              borderRadius: 15,
              justifyContent: "center",
              alignItems: "center"}}>
              <Label
                dimension="normal"
                weight="normal">
                  {eventData.participants.length}
              </Label>
            </View>
          </View>

          {eventData.participants.length > 0 ? (
            eventData.participants.map((p: UserDTO) => {
              return <Label key={p.userId}>{p.firstName + " " + p.lastName}</Label>
            })
          ) : null}
        </View>

        <View style={{
          flexDirection: "row", 
          justifyContent: "space-between", 
          marginVertical: padding.onehalf, 
          marginHorizontal: padding.full}}>
          <Label 
            dimension="big" 
            weight="semibold" 
            color={colors.primaryDark}>
              {t("detail.expenses")}
          </Label>
          <Label 
            dimension="big" 
            weight="semibold" 
            color={colors.primaryDark}>
              {eventData.eventAmount}
          </Label>
        </View>
        
        <CustomButton 
          text={t("detail.pay_dues", { DUES: (Number(eventData.eventAmount) / eventData.participants.length).toPrecision(4) })} 
          onPress={() => props.nav.eventPayment((Number(eventData.eventAmount) / eventData.participants.length).toPrecision(4))}/>
      </View>
    </ScrollView>
    
  )
}

const detailStyles = StyleSheet.create({
  detailContainer: {
    marginHorizontal: padding.full, 
    borderWidth: 1, 
    borderColor: colors.primary, 
    borderRadius: padding.full, 
    padding: padding.half
  }
})

export default EventDetail