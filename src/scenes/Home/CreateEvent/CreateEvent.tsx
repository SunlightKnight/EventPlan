import { useTranslation } from "react-i18next"
import Label from "../../../components/Label"
import DateTextField from "../../../components/DateTextField"
import { useState } from "react"
import colors from "../../../styles/colors"
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"
import commonStyles from "../../../styles/styles"
import padding from "../../../styles/padding"

type CreateEventProps = {

}

function CreateEvent(props: CreateEventProps) {
  const { t } = useTranslation()
  const [datePickerOpen, setDatePickerOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  
  return (
    <KeyboardAwareScrollView style={commonStyles.scrollingContent} extraScrollHeight={padding.double}>
      <Label 
        dimension="big" 
        weight="semibold" 
        color={colors.primaryDark} 
        style={{marginBottom: padding.half, marginLeft: padding.quarter}}>
          {t("home.create_event")}
      </Label>
      
      <DateTextField 
        outerViewStyle={{}}
        fieldTitle={"Date"}
        fieldTitleStyle={{marginLeft: 0}}
        open={datePickerOpen}
        mode={"datetime"}
        selectedDate={selectedDate}
        minDate={new Date()}
        iconsStyle={{tintColor: colors.blackOpacity25, width: 30, height: 30}}
        onConfirm={(date: Date) => {
          setSelectedDate(date)
          setDatePickerOpen(false)
        }}
        onCancel={() => { setDatePickerOpen(false) }}
        onDeletePress={() => { setSelectedDate(undefined) }}
        onDatePickerPress={() => { setDatePickerOpen(true) }}/>
    </KeyboardAwareScrollView>
  )
}

export default CreateEvent