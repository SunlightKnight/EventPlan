import { useTranslation } from "react-i18next"
import Label from "../../../components/Label"
import DateTextField from "../../../components/DateTextField"
import { useContext, useEffect, useState } from "react"
import colors from "../../../styles/colors"
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"
import commonStyles from "../../../styles/styles"
import padding from "../../../styles/padding"
import { HomeFlowCoordinatorProps } from "../HomeFlowCoordinator"
import { BackendServiceContext } from "../../../services/BackendServiceProvider"
import { Alert } from "react-native"
import { UserDTO } from "../../../models/services/UserDTO"

type CreateEventProps = {
  parentProps: HomeFlowCoordinatorProps
  navigation: any
}

// ADD CREATOR TO PARTICIPANTS LIST

function CreateEvent(props: CreateEventProps) {
  const { t } = useTranslation()
  const backendService = useContext(BackendServiceContext)
  const [userList, setUserList] = useState<Array<UserDTO>>([])
  const [selectedUsers, setSelectedUsers] = useState<Array<string>>([])
  const [datePickerOpen, setDatePickerOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)

  useEffect(() => {
    getUserList()
  }, [])

  const getUserList = () => {
    props.parentProps.handleLoader(true)
    backendService?.beService.getUsersList().then((userListResponse) => {
      setUserList(userListResponse)
    }).catch((userListError) => {
      Alert.alert(userListError.message)
    }).finally(() => {
      props.parentProps.handleLoader(false)
    })
  }
  
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

      {userList.map((user) => {
        return <Label>{user.nome + " " + user.cognome}</Label>
      })}
    </KeyboardAwareScrollView>
  )
}

export default CreateEvent