import { Alert, View } from "react-native";
import Label from "../../../components/Label";
import colors from "../../../styles/colors";
import { OnboardingFlowCoordinatorProps } from "../OnboardingFlowCoordinator";
import CustomButton from "../../../components/CustomButton";
import { useTranslation } from "react-i18next";
import TextField from "../../../components/TextField";
import { icon_key, icon_mail } from "../../../assets/images";
import { useContext, useState } from "react";
import padding from "../../../styles/padding";
import { BackendServiceContext } from "../../../services/BackendServiceProvider";
import LoginRequestDTO from "../../../models/services/LoginRequestDTO";
import { AccountServiceContext } from "../../../services/AccountServiceProvider";

type LoginProps = {
  parentProps: OnboardingFlowCoordinatorProps
  navigation: any
  nav: {[key: string]: any}
}

function Login(props: LoginProps) {
  const { t } = useTranslation()
  const aContext = useContext(AccountServiceContext)
  const bsContext = useContext(BackendServiceContext)
  const [userName, setUserName] = useState("")
  const [userPassword, setUserPassword] = useState("")

  const validate = () => {
    if (userName && userPassword) {
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
        color={colors.primaryDark} 
        style={{marginBottom: padding.half, marginLeft: padding.quarter}}>
          {t("login.login")}
      </Label>

      <TextField 
        label={t("login.username")} 
        value={userName}
        icon={icon_mail} 
        iconStyle={{height: 25}}
        autoCapitalize="none"
        autoCorrect={false}
        onChangeText={(text) => { setUserName(text) }}/>
      <TextField 
        label={t("login.password")} 
        value={userPassword}
        icon={icon_key} 
        secureTextEntry
        onChangeText={(text) => { setUserPassword(text) }}
        style={{marginBottom: padding.double}}/>
        
      <CustomButton 
        text={t("login.login")} 
        type="primary" 
        onPress={() => {
          if (validate()) {
            props.parentProps.handleLoader(true)
            const loginRequest: LoginRequestDTO = { username: userName, password: userPassword }
            bsContext?.beService.login(loginRequest).then((loginResponse) => {
              aContext?.aService.setAccount(userName)
              bsContext.setAuthToken(loginResponse)
              bsContext.saveAuthToken(loginResponse)
            }).catch((loginError) => {
              Alert.alert(loginError.message)
            }).finally(() => {
              props.parentProps.handleLoader(false)
            })
          }
        }} />
      {/* <CustomButton 
        text={t("login.register")} 
        type="transparent" 
        onPress={props.nav.registration}
        style={{marginTop: -padding.sixth}} /> */}
    </View>
  )
}

export default Login