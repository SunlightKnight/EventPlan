import { useTranslation } from "react-i18next";
import Label from "../../../components/Label";
import { useContext, useState } from "react";
import colors from "../../../styles/colors";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import commonStyles from "../../../styles/styles";
import padding from "../../../styles/padding";
import { BackendServiceContext } from "../../../Providers/Backend/BackendServiceProvider";
import { Alert, Button, GestureResponderEvent, Text, TextInput } from "react-native";
import { UserDTO } from "../../../models/services/UserDTO";
import CustomButton from "../../../components/CustomButton";
import { CreateEventRequestDTO } from "../../../models/services/CreateEventRequestDTO";
import { AppContext } from "../../../Providers/App/AppProvider";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native"
import React from "react";
import DateTextField from "../../../components/DateTextField";
import { ScrollView } from "react-native-gesture-handler";
import { icon_collapse, icon_expand } from "../../../assets/images";
import DropShadow from "react-native-drop-shadow";
import { AccountServiceContext } from "../../../Providers/Account/AccountServiceProvider";



type CreateEventProps = {
  parentProps: any
};



function CreateEvent(props: CreateEventProps) {
  const { t } = useTranslation();

  const appContext = useContext(AppContext)
  const accountServiceContext = useContext(AccountServiceContext)
  const backendService = useContext(BackendServiceContext);

  const [userList, setUserList] = useState<Array<UserDTO>>([]);
  const [nameEvent, setNameEvent] = useState<string>("");
  const [descEvent, setDescEvent] = useState<string>("");
  const [eventTotal, setEventTotal] = useState<number | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<Array<UserDTO>>([]);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [text, onChangeText] = useState<string>('');
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");

let category = [
    ('event_categories.undefined'),
    ('event_categories.school')
  ]

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
    creator.username = accountServiceContext?.aService.getUserName() ?? ""

    if (nameEvent && selectedDate && eventTotal && creator && selectedUsers) {
      appContext?.app.handleLoader(true)
      let createEventRequest: CreateEventRequestDTO = new CreateEventRequestDTO()
      createEventRequest.nome
      //assegna a Create event request
      backendService?.beService.createEvent(createEventRequest).then((_) => {
        //torna alla pag principale
      }).catch((createEventError) => {
        Alert.alert(t("general.error"), createEventError.message + ": " + createEventError.status)
      }).finally(() => {
        appContext?.app.handleLoader(false)
      })
    }
  }


  

  const createCategoryEntries = () => {
    if (category.length == undefined) {
      return <View>

      </View>
    }

    let cells = new Array()

    for (let i = 0; i < (category.length); i++) {
      let view = (
      <View style={styles.categoryEntry}>
        <TouchableOpacity  onPress={() => {setSelectedCategory(category[i]); setCategoryOpen(false)}}>
          <Text>
            {t('' + category[i])}
          </Text>
        </TouchableOpacity>
      </View>)
      cells.push(view)
    }

    return cells
  }

  //const categoryCells = createCategoryEntries();

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

      {/* <Label
        dimension="normal"
        weight="semibold"
        color={colors.mainText}
        marginLeft={'5%'}
        flex={5}
        style={{}}>
        {t("create.event_data")}
      </Label> */}
      <DateTextField
        fieldTitle={t("create.event_data")}
        open={datePickerOpen}
        selectedDate={selectedDate}
        mode={"datetime"}
        onConfirm={(date: Date) => {
          setSelectedDate(date)
          setDatePickerOpen(false)
        }}
        onCancel={() => { setDatePickerOpen(false) }}
        onDeletePress={() => { setSelectedDate(undefined) }}
        onDatePickerPress={() => { setDatePickerOpen(true) }
        } />


      <DropShadow style={styles.generalShadow}>
        <View style={styles.categoryContainer}>
          <View style={styles.categoryHeader}>
            <Text style={styles.categoryTitle}>
              {t(selectedCategory)}
            </Text>
            <TouchableOpacity style={styles.categoryButtonHolder} onPress={() => { setCategoryOpen(!categoryOpen) }}>
              <Image source={categoryOpen ? icon_collapse : icon_expand} style={styles.categoryButtonIcon} />

            </TouchableOpacity>
          </View>
          {categoryOpen ? <View style={styles.categoryMainView}>
            {createCategoryEntries()}
          </View> : null}
        </View>
      </DropShadow>
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

  categoryButtonHolder: {
    height: 32,
    aspectRatio: 1,

  },

  categoryButtonIcon: {
    height: '100%',
    aspectRatio: 1,
    tintColor: colors.secondary,
    flex: 1
  },
  generalShadow: {
    shadowColor: colors.mainText,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: .3,
    shadowRadius: 6,
  },
  categoryContainer: {
    marginHorizontal: 12,
    marginVertical: 6,
    padding: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
    flex: 2,

    backgroundColor: colors.background,
  },
  categoryHeader: {
    flexDirection: 'row',

  },
  categoryMainView: {

  },
  categoryTitle: {
    flex: 1,
    fontSize: 24,
    fontWeight: '600',
    color: colors.secondaryDark,
    justifyContent: 'flex-start',

  },
  categoryEntry: {
    marginLeft: 8,
    fontSize: 20,
    color: colors.highlightText
  }


});


export default CreateEvent;
function setCount(arg0: (prevCount: any) => any) {
  throw new Error("Function not implemented.");
}

