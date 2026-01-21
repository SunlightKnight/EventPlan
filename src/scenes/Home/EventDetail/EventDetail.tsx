import { ScrollView, StyleSheet, View } from "react-native"
import Label from "../../../components/Label"
import { useTranslation } from "react-i18next"
import colors from "../../../styles/colors"
import padding from "../../../styles/padding"

type EventDetailProps = {
  route?: any
}

function EventDetail(props: EventDetailProps) {
  const { t } = useTranslation()

  return (
    <ScrollView>
      <View style={{marginTop: padding.full}}>
        <Label 
          dimension="big" 
          weight="semibold" 
          color={colors.primaryDark} 
          style={{marginBottom: padding.onehalf, marginLeft: padding.full}}>
            {t("detail.detail")}
        </Label>

        </View>
    </ScrollView>
  )
}

const detailStyles = StyleSheet.create({
  
})

export default EventDetail