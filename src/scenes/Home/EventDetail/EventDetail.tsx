import { Image, ScrollView, StyleSheet, View } from "react-native"
import CustomButton from "../../../components/CustomButton"
import Label from "../../../components/Label"
import { HomeFlowCoordinatorProps } from "../HomeFlowCoordinator"
import { useTranslation } from "react-i18next"
import colors from "../../../styles/colors"
import padding from "../../../styles/padding"
import { formatDate, formattedCurrency } from "../../../utils/Helper"
import { UserDTO } from "../../../models/services/UserDTO"
import { useContext, useEffect, useState } from "react"
import { AccountServiceContext } from "../../../services/AccountServiceProvider"
import { icon_tick, icon_user } from "../../../assets/images"

type EventDetailProps = {
  parentProps: HomeFlowCoordinatorProps
  route?: any
  nav: any
}

function EventDetail(props: EventDetailProps) {
  const { t } = useTranslation()
  const aContext = useContext(AccountServiceContext)
  const [p, setP] = useState<any | undefined>(undefined)
  const { eventData } = props.route.params
  const userName = aContext?.aService.getUserName()

  useEffect(() => {
    getParticipant()
  }, [])

  const getParticipant = () => {
    eventData.partecipantiList.map((p: any) => {
      if (p.username == userName) {
        console.log("HERE")
        setP(p)
      }
    })
  }

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
              {eventData.nome + (p ? " - " + formattedCurrency(String(eventData.spesa), false, true, 2) : "")}
          </Label>
          <Label 
            dimension="small" 
            color={colors.black}
            style={{marginBottom: padding.half}}>
              {formatDate(eventData.dataEv, "YYYY-MM-DDTHH:mm:SS.sssZ", "DD/MM/YYYY HH:mm")}
          </Label>

          {eventData.descr ? (
            <Label 
              dimension="normal" 
              color={colors.black}
              style={{marginBottom: padding.half}}>
                {eventData.descr}
            </Label>
          ) : null}

          <View style={{marginTop: padding.full}}>
            <Label 
              dimension="normal" 
              weight="semibold" 
              color={colors.primaryDark}>
                {t("detail.creator")}
            </Label>
            <Label 
              dimension="normal" 
              color={colors.black}
              style={{marginBottom: padding.half}}>
                {eventData.creatore.nome + " " + eventData.creatore.cognome}
            </Label>
          </View>

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
                  {eventData.partecipantiList.length}
              </Label>
            </View>
          </View>

          {eventData.partecipantiList.length > 0 ? (
            eventData.partecipantiList.map((p: any) => {
              let element = null
              if (userName === eventData.creatore.username) {
                element = (
                  <View key={p.idPartecipante} style={detailStyles.participantContainer}>
                    <Image 
                      source={icon_user} 
                      resizeMode="contain" 
                      style={[detailStyles.userIcon, {
                        tintColor: p.username === eventData.creatore.username ? colors.gold : colors.blackOpacity25
                      }]} />
                    <Label>{p.nome + " " + p.cognome}</Label>
                    {p.dataPagamento || 
                      (userName === eventData.creatore.username && p.username === userName) ? (
                      <Image 
                        source={icon_tick} 
                        resizeMode="contain" 
                        style={detailStyles.tickIcon} />
                    ) : null}
                  </View>
                )
              } else {
                element = (
                  <View key={p.idPartecipante} style={detailStyles.participantContainer}>
                    <Image 
                      source={icon_user} 
                      resizeMode="contain" 
                      style={[detailStyles.userIcon, {
                        tintColor: p.username === eventData.creatore.username ? colors.gold : colors.blackOpacity25
                      }]} />
                    <Label>
                      {p.nome + " " + p.cognome}
                    </Label>
                  </View>
                )
              }
              return element
            })
          ) : null}
        </View>

        {(eventData.creatore.username == userName || 
          (p && p.dataPagamento) || !p) ? null : (
          <View>
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
                  {formattedCurrency(String(p ? p.spesa : 0), false, true, 2)}
              </Label>
            </View>
          
            <CustomButton 
              text={t("detail.pay_dues")}
              onPress={() => props.nav.eventPayment(String(p ? p.spesa : 0), p ? p.idPartecipante : 0)}/>
          </View>
        )}
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
  },
  tickIcon: {
    width: 20, 
    height: 20, 
    tintColor: colors.deepGreen,
    marginLeft: padding.half
  },
  userIcon: {
    width: 20, 
    height: 20, 
    marginRight: padding.half
  },
  participantContainer: {
    flexDirection: "row", 
    paddingVertical: padding.sixth
  }
})

export default EventDetail