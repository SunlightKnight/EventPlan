import { Alert, View } from "react-native";
import Label from "../../../components/Label";
import colors from "../../../styles/colors";
import { OnboardingFlowCoordinatorProps } from "../OnboardingFlowCoordinator";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import commonStyles from "../../../styles/styles";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import padding from "../../../styles/padding";
import { formatSubtitle } from "../../../utils/Helper";
import TextField from "../../../components/TextField";
import CustomButton from "../../../components/CustomButton";

type RegistrationProps = {
  parentProps: OnboardingFlowCoordinatorProps
  navigation: any
}

function Registration(props: RegistrationProps) {
  const { t } = useTranslation()
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [userMail, setUserMail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const validate = () => {
    if (firstName && lastName && userMail && password && (password === confirmPassword)) {
      return true
    }
    return false
  }

  return (
    <KeyboardAwareScrollView style={commonStyles.scrollingContent} extraScrollHeight={padding.double}>
      <Label 
        dimension="big" 
        weight="semibold" 
        color={colors.primary} 
        style={{marginBottom: padding.half, marginLeft: padding.quarter}}>
          {formatSubtitle(t("registration.registration"))}
      </Label>

      <TextField 
        label={t("registration.first_name")} 
        iconStyle={{height: 25}}
        onChangeText={(text) => { setFirstName(text) }}/>
      <TextField 
        label={t("registration.last_name")} 
        iconStyle={{height: 25}}
        onChangeText={(text) => { setLastName(text) }}/>
      <TextField 
        label={t("login.email")} 
        iconStyle={{height: 25}}
        onChangeText={(text) => { setUserMail(text) }}/>
      <TextField 
        label={t("login.password")} 
        iconStyle={{height: 25}}
        secureTextEntry
        onChangeText={(text) => { setPassword(text) }}/>
      <TextField 
        label={t("registration.confirm_password")} 
        iconStyle={{height: 25}}
        secureTextEntry
        onChangeText={(text) => { setConfirmPassword(text) }}/>
          
      <CustomButton 
        text={t("login.register")} 
        type="primary" 
        onPress={() => {
          if (validate()) {
            Alert.alert("Registration", "Success")
          }
        }}
        style={{marginTop: padding.double}} />
    </KeyboardAwareScrollView>
  )
}

export default Registration