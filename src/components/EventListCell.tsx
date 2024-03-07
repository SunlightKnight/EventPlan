import { TouchableOpacity, View, Image } from "react-native";
import Label from "./Label";
import colors from "../styles/colors";
import padding from "../styles/padding";
import { EventDTO } from "../models/services/EventDTO";
import { icon_user } from "../assets/images";
import { formatDate, formattedCurrency } from "../utils/Helper";
import { createEventAPIDateTime, displayDateTime } from "../utils/Constants";
import { useTranslation } from "react-i18next";

type EventListCellProps = {
  event: EventDTO
  currentUsername: string
  onCellPress: () => void
};

function EventListCell(props: EventListCellProps) {
    const {t} = useTranslation()
    const isUserPresent = () => {
        if(props.event.partecipantiList.filter((u) => u.username == props.currentUsername).length > 0){ 
            return true
        }
        return false
    }
    return (
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={
                props.onCellPress
            }
            style={{
                padding: 10,
                backgroundColor: colors.white,
                borderWidth: 1,
                borderColor: colors.black,
                marginVertical: 10,
                marginHorizontal: padding.full,
                borderRadius: padding.half
            }}
            >
            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "space-between"
                }}
            >
                <Label
                    weight="bold"
                    style={{
                        paddingRight: 5,
                    }}
                    >{props.event.nome}</Label>
                    <View style={{flexDirection: "row", alignItems: "center"}}>
                        <Image source={icon_user} style={{width: 20, height: 20, marginRight: padding.quarter, tintColor: colors.blackOpacity25}}/> 
                    <Label>{props.event.partecipantiList.length}</Label>
                    </View>
                    
            </View>
            <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                <Label dimension="small">{formatDate(props.event.dataEv, createEventAPIDateTime, displayDateTime)}</Label>
                <Label dimension="small">{formattedCurrency(String(props.event.spesa), false, true, 2)}</Label>
            </View>
            {isUserPresent() ? (
                <Label dimension="small">{
                    props.currentUsername == props.event.creatore.username ?
                     t("home.receive", {AMOUNT: formattedCurrency(String(((props.event.spesa/props.event.partecipantiList.length)*(props.event.partecipantiList.length-1))), false, true, 2)}):
                     t("payment.pay", {AMOUNT: formattedCurrency(String(props.event.spesa/props.event.partecipantiList.length), false, true, 2)})}</Label>
            ) : (
                <Label dimension="small" weight="semibold" color={colors.deepRed}>{t("home.not_partecipating")}</Label>
            )}
        </TouchableOpacity>
    )
}

export default EventListCell