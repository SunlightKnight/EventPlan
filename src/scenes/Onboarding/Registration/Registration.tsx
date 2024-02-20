import { View } from "react-native";
import Label from "../../../components/Label";
import colors from "../../../styles/colors";
import { OnboardingFlowCoordinatorProps } from "../OnboardingFlowCoordinator";

type RegistrationProps = {
  parentProps: OnboardingFlowCoordinatorProps
  navigation: any
}

function Registration(props: RegistrationProps) {
  return (
    <View>
      <Label color={colors.black}>REGISTRATION</Label>
    </View>
  )
}

export default Registration