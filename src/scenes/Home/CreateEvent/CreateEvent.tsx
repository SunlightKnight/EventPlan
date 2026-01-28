import { useTranslation } from "react-i18next";
import Label from "../../../components/Label";
import { useContext, useState } from "react";
import colors from "../../../styles/colors";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import commonStyles from "../../../styles/styles";
import padding from "../../../styles/padding";
import { BackendServiceContext } from "../../../Providers/Backend/BackendServiceProvider";
import { Alert, Button, TextInput } from "react-native";
import { UserDTO } from "../../../models/services/UserDTO";
import CustomButton from "../../../components/CustomButton";
import { CreateEventRequestDTO } from "../../../models/services/CreateEventRequestDTO";
import { AppContext } from "../../../Providers/App/AppProvider";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native"
import React from "react";
import DateTextField from "../../../components/DateTextField";
import { ScrollView } from "react-native-gesture-handler";



type CreateEventProps = {
  parentProps: any
};

function CreateEvent(props: CreateEventProps) {
  const { t } = useTranslation();

  const appContext = useContext(AppContext)
  const backendService = useContext(BackendServiceContext);

  const [userList, setUserList] = useState<Array<UserDTO>>([]);
  const [nameEvent, setNameEvent] = useState<string>("");
  const [descEvent, setDescEvent] = useState<string>("");
  const [eventTotal, setEventTotal] = useState<number | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<Array<UserDTO>>([]);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [text, onChangeText] = useState<string>('');

  const getUserList = () => {
    appContext?.app.handleLoader(true);
    backendService?.beService.getUsersList().then((userListResponse) => {

    }).catch((userListError) => {
      if (userListError.status === 401) {
        Alert.alert(t("general.error"), t("errors.unauthorized"), [
          {
            text: t("general.ok").toUpperCase(),
            onPress: () => {
              props.parentProps.logout()
            },
          }
        ]);
      } else {
        Alert.alert(t("general.error"), userListError.message)
      }
    }).finally(() => {
      appContext?.app.handleLoader(false);
    });
  };

  const saveEvent = () => {
    let creator: UserDTO = new UserDTO()

    if (nameEvent && selectedDate && eventTotal && creator && selectedUsers) {
      appContext?.app.handleLoader(true)
      let createEventRequest: CreateEventRequestDTO = new CreateEventRequestDTO()

      backendService?.beService.createEvent(createEventRequest).then((_) => {

      }).catch((createEventError) => {
        Alert.alert(t("general.error"), createEventError.message + ": " + createEventError.status)
      }).finally(() => {
        appContext?.app.handleLoader(false)
      })
    }
  }



  return (
    <KeyboardAwareScrollView
      style={commonStyles.scrollingContent}
      contentContainerStyle={{ paddingBottom: padding.double }}
      bottomOffset={padding.double}>
      <Label
        dimension="veryBig"
        weight="semibold"
        color={colors.primaryDark}
        style={{ marginBottom: padding.half, marginLeft: padding.quarter }}>
        {t("home.create_event")}
      </Label>

      <ScrollView>
        <View>
          <Label
            dimension="normal"
            weight="semibold"
            color={colors.mainText}
            marginLeft={'5%'}
            style={{ marginLeft: padding.quarter }}>
            {t("create.name_event")}
          </Label>
          <TextInput
            style={styles.inputName}
            onChangeText={onChangeText}
            value={text}
          />
        </View>
        <View style={styles.columnContainer}>
          <View>
            <Label
              dimension="normal"
              weight="semibold"
              color={colors.mainText}
              marginLeft={'5%'}
              flex={5}
              style={{}}>
              {t("create.event_data")}
            </Label>
            <DateTextField open={datePickerOpen} onConfirm={(date:Date)=>{
              setSelectedDate(date)
              setDatePickerOpen(false)
            }}
             onCancel={()=>{setDatePickerOpen(false)}}
             onDeletePress={()=>{setSelectedDate(undefined)}}
             onDatePickerPress={()=>{setDatePickerOpen(true)}
            }
            >
              

            </DateTextField>
          </View>
         
        </View>
      </ScrollView>


      <CustomButton
        text={t("home.create_event")}
        style={{ marginTop: padding.full }}
        onPress={() => {
          saveEvent()
        }} />
    </KeyboardAwareScrollView>
  );

}

const styles = StyleSheet.create({
  inputName: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    marginLeft: padding.quarter
  },

  nameContainer: {

  },

  columnContainer: {
    
  },

  DataContainer: {
    marginLeft: "20%"

  },

  timeContainer: {
    marginLeft: "20%"

  }

});


export default CreateEvent;
