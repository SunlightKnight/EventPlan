import { View } from "react-native";
import Label from "../../../components/Label";
import colors from "../../../styles/colors";
import { OnboardingFlowCoordinatorProps } from "../OnboardingFlowCoordinator";
import CustomButton from "../../../components/CustomButton";
import { useTranslation } from "react-i18next";
import TextField from "../../../components/TextField";
import { icon_key, icon_mail } from "../../../assets/images";
import { ScrollView } from "react-native-gesture-handler";
import commonStyles from "../../../styles/styles";
import { useState } from "react";
import padding from "../../../styles/padding";
import { formatSubtitle } from "../../../utils/Helper";

type LoginProps = {
  parentProps: OnboardingFlowCoordinatorProps
  navigation: any
  nav: {[key: string]: any}
}

function Login(props: LoginProps) {
  const { t } = useTranslation()
  const [userMail, setUserMail] = useState("")
  const [userPassword, setUserPassword] = useState("")

  const validate = () => {
    if (userMail && userPassword) {
      return true
    }
    return false
  }

  return (
    <View style={{flex: 1, justifyContent: "flex-start", marginHorizontal: padding.full}}>
      <View style={{flexDirection: "row", justifyContent: "center", marginBottom: padding.double}}>
        <Label dimension="veryBig" weight="bold" color={colors.primary}>EVENT</Label>
        <Label dimension="veryBig" weight="bold" color={colors.secondary} style={{marginLeft: padding.quarter}}>PLAN</Label>
      </View>
        
      <Label 
        dimension="big" 
        weight="semibold" 
        color={colors.primary} 
        style={{marginBottom: padding.half, marginLeft: padding.quarter}}>
          {formatSubtitle(t("login.login"))}
      </Label>

      <TextField 
        label={t("login.email")} 
        icon={icon_mail} 
        iconStyle={{height: 25}}
        onChangeText={(text) => { setUserMail(text) }}/>
      <TextField 
        label={t("login.password")} 
        icon={icon_key} 
        secureTextEntry
        onChangeText={(text) => { setUserPassword(text) }}
        style={{marginBottom: padding.double}}/>
        
      <CustomButton 
        text={t("login.login")} 
        type="primary" 
        onPress={() => {
          if (validate()) {
            props.nav.login()
          }
        }} />
      <CustomButton 
        text={t("login.register")} 
        type="transparent" 
        onPress={props.nav.registration}
        style={{marginTop: -padding.sixth}} />
    </View>
  )
}

export default Login