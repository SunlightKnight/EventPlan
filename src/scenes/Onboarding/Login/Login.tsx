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
import { BackendServiceContext } from "../../../Providers/Backend/BackendServiceProvider";
import LoginRequestDTO from "../../../models/services/LoginRequestDTO";
import { AccountServiceContext } from "../../../Providers/Account/AccountServiceProvider";
import { useNavigation } from "@react-navigation/native";
import { AppContext } from "../../../Providers/App/AppProvider";

type LoginProps = {

}

function Login(props: LoginProps) {
  // useTranslation hook, for handling translations.
  // For more info: https://react.i18next.com/latest/usetranslation-hook
  const { t } = useTranslation()
  const navigation = useNavigation<any>()

  const appContext = useContext(AppContext)
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
    <View style={{flex: 1, justifyContent: "flex-start", marginHorizontal: padding.full, backgroundColor: colors.background}}>
      <View style={{flexDirection: "row", justifyContent: "center", marginBottom: padding.double}}>
        <Label dimension="veryBig" weight="bold" color={colors.primary}>EVENT</Label>
        <Label dimension="veryBig" weight="bold" color={colors.secondaryDark} style={{marginLeft: padding.quarter}}>PLAN</Label>
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
        onChangeText={(text) => { setUserName(text) }}
        style={{color: colors.primary}}
        />
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
            appContext?.app.handleLoader(true)
            const loginRequest: LoginRequestDTO = { username: userName, password: userPassword }
            bsContext?.beService.login(loginRequest).then((loginResponse) => {
              aContext?.aService.setAccount(userName)
              bsContext.setAuthToken(loginResponse)
              bsContext.saveAuthToken(loginResponse)
            }).catch((loginError) => {
              Alert.alert(loginError.message)
            }).finally(() => {
              appContext?.app.handleLoader(false)
            })
          }
        }} />
      <CustomButton 
        text={t("login.register")} 
        type="transparent" 
        onPress={() => { navigation.navigate("Registration") }}
        style={{marginTop: -padding.sixth}} />
    </View>
  )
}

export default Login