import { useTranslation } from "react-i18next"
import CustomButton from "../../../components/CustomButton"
import Label from "../../../components/Label"
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller'
import { useState } from "react"
import commonStyles from "../../../styles/styles"
import padding from "../../../styles/padding"
import colors from "../../../styles/colors"
import { formattedCurrency } from "../../../utils/Helper"
import TextField from "../../../components/TextField"
import { View } from "react-native"

type EventPaymentProps = {
  route?: any
}

function EventPayment(props: EventPaymentProps) {
  const { t } = useTranslation()
  
  const [recipientIban, setRecipientIban] = useState("IT60X0542811101000000123456")
  

  const validate = () => {
    return false
  }

  return (
    <KeyboardAwareScrollView style={commonStyles.scrollingContent} bottomOffset={padding.double}>
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
        value={""}
        onChangeText={(text) => {  }} />
      <TextField 
        label={t("payment.card_number")} 
        value={""}
        keyboardType="number-pad" // Should be tested with regex too.
        maxLength={16}
        onChangeText={(text) => {  }} />
      <View style={{flex: 1, flexDirection: "row", justifyContent: "space-between"}}>
        <TextField 
          label={t("payment.card_expiry")} 
          value={""}
          keyboardType="number-pad"
          maxLength={5}
          onChangeText={(text) => {  }}
          style={{flex: 1}} />
        <TextField 
          label={t("payment.card_cvv")} 
          value={""}
          keyboardType="number-pad"
          maxLength={3}
          onChangeText={(text) => {  }}
          style={{flex: 1}} />
      </View>

      <CustomButton 
        text={t("payment.pay", {AMOUNT: formattedCurrency(String(props.route.params.paymentAmount), false, true, 2)})} 
        onPress={() => {
          if (validate()) {
            
          }
        }}
        style={{marginTop: padding.full}} />
    </KeyboardAwareScrollView>
  )
}

export default EventPayment