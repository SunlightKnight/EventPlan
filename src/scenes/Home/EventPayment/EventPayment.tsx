import { useTranslation } from "react-i18next"
import CustomButton from "../../../components/CustomButton"
import Label from "../../../components/Label"
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { HomeFlowCoordinatorProps } from "../HomeFlowCoordinator"
import { useContext, useState } from "react"
import commonStyles from "../../../styles/styles"
import padding from "../../../styles/padding"
import colors from "../../../styles/colors"
import { formatCardExpiry, formattedCurrency } from "../../../utils/Helper"
import TextField from "../../../components/TextField"
import { Alert, View } from "react-native"
import { BackendServiceContext } from "../../../services/BackendServiceProvider"

type EventPaymentProps = {
  parentProps: HomeFlowCoordinatorProps
  navigation: any
  route?: any
}

function EventPayment(props: EventPaymentProps) {
  const { t } = useTranslation()
  const bsContext = useContext(BackendServiceContext)
  const [recipientIban, setRecipientIban] = useState("IT60X0542811101000000123456")
  const [cardOwner, setCardOwner] = useState("")
  const [cardNumber, setCardNumber] = useState("")
  const [cardExpiry, setCardExpiry] = useState("")
  const [cardCVV, setCardCVV] = useState("")

  const validate = () => {
    if (recipientIban && cardOwner && cardNumber && cardExpiry && cardCVV) {
      return true
    }
    return false
  }

  return (
    <KeyboardAwareScrollView style={commonStyles.scrollingContent} extraScrollHeight={padding.double}>
      <Label 
        dimension="big" 
        weight="semibold" 
        color={colors.primaryDark} 
        style={{marginTop: padding.full, marginBottom: padding.half, marginLeft: padding.quarter}}>
          {t("payment.payment")}
      </Label>

      <TextField 
        label={t("payment.recipient_iban")} 
        value={recipientIban}
        editable={false} />
      <TextField 
        label={t("payment.card_owner")} 
        value={cardOwner}
        onChangeText={(text) => { setCardOwner(text) }} />
      <TextField 
        label={t("payment.card_number")} 
        value={cardNumber}
        keyboardType="number-pad" // Should be tested with regex too.
        maxLength={16}
        onChangeText={(text) => { setCardNumber(text) }} />
      <View style={{flex: 1, flexDirection: "row", justifyContent: "space-between"}}>
        <TextField 
          label={t("payment.card_expiry")} 
          value={cardExpiry}
          keyboardType="number-pad"
          maxLength={5}
          onChangeText={(text) => { setCardExpiry(formatCardExpiry(text)) }}
          style={{flex: 1}} />
        <TextField 
          label={t("payment.card_cvv")} 
          value={cardCVV}
          keyboardType="number-pad"
          maxLength={3}
          onChangeText={(text) => { setCardCVV(text) }}
          style={{flex: 1}} />
      </View>

      <CustomButton 
        text={t("payment.pay", {AMOUNT: formattedCurrency(String(props.route.params.paymentAmount), false, true, 2)})} 
        onPress={() => {
          if (validate()) {
            props.parentProps.handleLoader(true)
            bsContext?.beService.payEvent(props.route.params.pID).then((_) => {
              Alert.alert(
                t("payment.payment"), 
                t("payment.payment_success"), 
                [
                  {
                    text: t("general.ok").toUpperCase(),
                    onPress: () => {
                      props.navigation.popToTop()
                    },
                  }
                ])
            }).catch((paymentError) => {
              Alert.alert(t("general.error"), paymentError.message)
            }).finally(() => {
              props.parentProps.handleLoader(false)
            })
          }
        }}
        style={{marginTop: padding.full}} />
    </KeyboardAwareScrollView>
  )
}

export default EventPayment