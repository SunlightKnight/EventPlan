import { TouchableOpacity, View, Image } from "react-native";
import Label from "./Label";
import colors from "../styles/colors";
import padding from "../styles/padding";
import { EventDTO } from "../models/services/EventDTO";
import { icon_user } from "../assets/images";
import { formatDate, formattedCurrency } from "../utils/Helper";
import { createEventAPIDateTime, displayDateTime } from "../utils/Constants";
import { useTranslation } from "react-i18next";
import LinearGradient from "react-native-linear-gradient";

type EventListCellProps = {
  event: EventDTO
  currentUsername: string
  onCellPress: () => void
};

function EventListCell(props: EventListCellProps) {
  const {t} = useTranslation()

  const isUserPresent = () => {
    if (props.event.partecipantiList.filter((u) => u.username == props.currentUsername).length > 0){ 
      return true
    }
    return false
  }

  const hasUserAlreadyPaid = () => {
    let p = props.event.partecipantiList.filter((u) => u.username == props.currentUsername)
    if (p.length > 0) {
      return p[0].username == props.event.creatore.username ? false : p[0].dataPagamento != undefined
    }
    return false
  }

  const getAmount = () => {
    let amount: number = 0
    if (props.currentUsername == props.event.creatore.username) {
      props.event.partecipantiList.forEach((p) => {
        if (p.username != props.currentUsername && !p.dataPagamento) {
          amount += p.spesa
        }
      })
    } else {
      props.event.partecipantiList.forEach((p) => {
        if (p.username == props.currentUsername) {
          amount = p.spesa
        }
      })
    }
    return amount
  }

  const eventPaid = () => {
    let everyonePaid = true
    props.event.partecipantiList.forEach((p) => {
      if (!p.dataPagamento) everyonePaid = false
    })
    return everyonePaid
  }

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={eventPaid() ? undefined : props.onCellPress}
      style={{
        backgroundColor: colors.white,
        marginVertical: 10,
        marginHorizontal: padding.full,
        borderRadius: padding.half
      }}>
      <LinearGradient 
        start={{x: 0.90, y: 1.0}} 
        end={{x: 0.0, y: 0.25}}
        colors={[
          eventPaid() && props.currentUsername == props.event.creatore.username ? 
            colors.deepGreen : hasUserAlreadyPaid() ? 
              colors.lightGreen : !isUserPresent() ? colors.red : colors.lightGrey, 
          colors.white, 
          colors.white]} 
        style={{
          padding: 10, 
          borderRadius: padding.half, 
          borderWidth: 1,
          borderColor: colors.blackOpacity25
        }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between"
          }}>
          <Label
            weight="bold"
            style={{
              paddingRight: 5,
            }}>
              {props.event.nome}
          </Label>
          <View style={{flexDirection: "row", alignItems: "center"}}>
            <Image 
              source={icon_user} 
              style={{
                width: 20, 
                height: 20, 
                marginRight: padding.quarter, 
                tintColor: colors.blackOpacity40}}/> 
            <Label>{props.event.partecipantiList.length}</Label>
          </View>      
        </View>
        <View style={{flexDirection: "row", justifyContent: "space-between", marginTop: padding.quarter}}>
          <Label dimension="small">{formatDate(props.event.dataEv, createEventAPIDateTime, displayDateTime)}</Label>
          <Label dimension="small">{formattedCurrency(String(props.event.spesa), false, true, 2)}</Label>
        </View>
        {isUserPresent() ? (
          hasUserAlreadyPaid() ? (
            <Label 
              dimension="small" 
              weight="semibold" 
              color={colors.deepGreen} 
              style={{marginTop: padding.half}}>
                {t("home.already_paid")}
            </Label>
          ) : (
            eventPaid() && props.currentUsername == props.event.creatore.username ? (
              <Label 
                dimension="small" 
                weight="semibold" 
                color={colors.deepGreen} 
                style={{marginTop: padding.half}}>
                  {t("home.event_paid")}
              </Label>
            ) : (
              <Label dimension="small" style={{marginTop: padding.half}}>
                {props.currentUsername == props.event.creatore.username ?
                  t("home.receive", {AMOUNT: formattedCurrency(String(getAmount()), false, true, 2)}):
                  t("payment.pay", {AMOUNT: formattedCurrency(String(getAmount()), false, true, 2)})}
              </Label>
            )
          )
        ) : (
          <Label 
            dimension="small" 
            weight="semibold" 
            color={colors.deepRed} 
            style={{marginTop: padding.half}}>
              {t("home.not_partecipating")}
          </Label>
        )}
      </LinearGradient>
    </TouchableOpacity>
  )
}

export default EventListCell