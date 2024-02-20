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

type LoginProps = {
  parentProps: OnboardingFlowCoordinatorProps
  navigation: any
  nav: {[key: string]: any}
}

function Login(props: LoginProps) {
  const { t } = useTranslation()

  return (
    <ScrollView style={commonStyles.scrollingContent}>
      <Label color={colors.black}>LOGIN</Label>
      <TextField label="text" icon={icon_mail} iconStyle={{height: 25}}/>
      <TextField label="text" icon={icon_key} secureTextEntry/>
      
      <CustomButton text={t("login.register")} type="transparent" onPress={props.nav.registration} />
    </ScrollView>
  )
}

export default Login