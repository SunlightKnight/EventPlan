import { useTranslation } from "react-i18next";
import Label from "../../../components/Label";
import { useContext, useEffect, useState } from "react";
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
import icons from "../../../assets/images/eventIcons"
import { PartecipantDTO } from "../../../models/services/PartecipantDTO";
import { EventDTO } from "../../../models/services/EventDTO";
import { formatDate } from "../../../utils/Helper";
import { createEventAPIDateTime, fullDate } from "../../../utils/Constants";
import { StackActions, useNavigation } from "@react-navigation/native";


type CreateEventProps = {
  route: any;
  parentProps: any
};



function CreateEvent(props: CreateEventProps) {
  const { t } = useTranslation();
  const navigation = useNavigation<any>()

  const appContext = useContext(AppContext)
  const accountServiceContext = useContext(AccountServiceContext)
  const backendService = useContext(BackendServiceContext);

  const [userList, setUserList] = useState<Array<UserDTO>>([]);
  const [nameEvent, setNameEvent] = useState<string>("");
  const [descEvent, setDescEvent] = useState<string>("");
  const [eventTotal, setEventTotal] = useState<number | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<Array<any>>([]);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [text, onChangeText] = useState<string>('');
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("undefined");
  const accountContext = useContext(AccountServiceContext)
  const [userOpen, setUserOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState("");

  const category = [
    ('undefined'),
    ('school'),
    ('business'),
    ('history'),
    ('music'),
    ('party'),
    ('social'),
    ('sport')
  ]



  useEffect(() => {
    getUserList()
  }, [])

  const getUserList = () => {
    appContext?.app.handleLoader(true);
    backendService?.beService.getUsersList().then((userListResponse) => {
      setUserList(userListResponse)
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
    let creator: UserDTO = new UserDTO
    for (let i = 0; i < userList.length; i++) {
      if (userList[i].username == accountServiceContext?.aService.getUserName()) {
        creator = userList[i]
        break
      }
    }
    if (nameEvent && selectedDate && eventTotal && creator && selectedUsers) {
      appContext?.app.handleLoader(true)
      let createEventRequest: CreateEventRequestDTO = new CreateEventRequestDTO()
      createEventRequest.nome = nameEvent
      createEventRequest.dataEv = formatDate(selectedDate.toISOString(), fullDate, createEventAPIDateTime)
      createEventRequest.categoria = selectedCategory
      createEventRequest.spesa = eventTotal
      createEventRequest.descr = descEvent
      let newArray = selectedUsers.filter(() => { return true })
      console.log(newArray)
      for (let i = 0; i < userList.length; i++) {
        const buttonUser = userList[i]
        console.log(buttonUser, buttonUser.username, accountServiceContext?.aService.getUserName())
        if (buttonUser.username == accountServiceContext?.aService.getUserName()) {
          newArray.push(buttonUser)
        }
      }
      createEventRequest.partecipantiList = newArray
      createEventRequest.creatore = creator

      backendService?.beService.createEvent(createEventRequest).then((_) => {
         navigation.dispatch(StackActions).pop(1)
      }).catch((createEventError) => {
        Alert.alert(t("general.error"), createEventError.message + ": " + createEventError.status)
      }).finally(() => {
        appContext?.app.handleLoader(false)
      })
    }
  }

  const getImage = () => {
    let url = icons[selectedCategory.toLowerCase()] || icons.undefined

    return url
  }

  const formatUsers = (spesa: number) => {
    let newArray = selectedUsers.filter((item) => { return true })
    for (let i = 0; i < newArray.length; i++) {
      newArray[i].spesa = spesa;
    }
    return newArray
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
          <TouchableOpacity onPress={() => { setSelectedCategory(category[i]); setCategoryOpen(false) }}>
            <Text style={styles.menuEntryNameCategory}>
              {t('event_categories.' + category[i])}
            </Text>
          </TouchableOpacity>
        </View>)
      cells.push(view)
    }

    return cells
  }

  const addSelectedUser = (user: UserDTO) => {
    console.log(user, selectedUsers)
    if (selectedUsers.filter((item) => { return (user.username == item.username) }).length > 0) {
      console.log(selectedUsers, user, selectedUsers.includes(user))
      let newArray = selectedUsers.filter((item) => { return item.username != user.username })
      setSelectedUsers(newArray)
    } else {
      let newArray = selectedUsers.filter((item) => { return true })
      newArray.push(user)
      setSelectedUsers(newArray)
    }

  }

  const createUserEntries = () => {
    if (userList == undefined) {
      return <View>
      </View>
    }

    let cells = new Array()


    for (let i = 0; i < (userList.length); i++) {
      const buttonUser = userList[i]
      if (buttonUser.username == accountServiceContext?.aService.getUserName()) {
        continue
      }
      cells[i] = <View style={styles.partecipantColumn}>
        <TouchableOpacity onPress={() => { addSelectedUser(buttonUser) }} style={styles.partecipantEntry}>
          <View style={styles.PartecipantButton}>
            {(selectedUsers.filter((item) => { return (buttonUser.username == item.username) }).length > 0) ? <View style={styles.partecipantButtonInner}>

            </View> : <View></View>}
          </View>
        </TouchableOpacity>
        <View >
          <Text style={styles.menuEntryName}>
            {(userList[i].username == accountContext?.aService.getUserName() ? '> ' : '') + (userList[i].cognome ? userList[i].cognome : 'Doe') + " " + (userList[i].nome ? userList[i].nome : 'John')}
          </Text>

          <Text style={styles.menuEntryEntry}>
            {'Username: ' + (userList[i].username ? userList[i].username : 'N/A')}
          </Text>
        </View>

      </View>

    }

    return cells
  }


  let userCells = createUserEntries()
  return (
    <KeyboardAwareScrollView
      style={commonStyles.scrollingContent}
      contentContainerStyle={{ paddingBottom: padding.double }}
      bottomOffset={padding.double}>
      <Label
        dimension="veryBig"
        weight="bold"
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
        style={styles.totalEvent}
        onChangeText={(text) => setNameEvent(String(text))}
        value={nameEvent}
      />


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

      <View style={styles.catContainer}>
        <Label
          dimension="normal"
          weight="semibold"
          color={colors.mainText}
          marginLeft={'2%'}
          flex={1}
          style={{}}>
          {t("create.event_category")}
        </Label>

        <View style={styles.columnContainer}>
          <View style={styles.generalShadow}>
            <View style={styles.categoryContainer}>
              <TouchableOpacity style={styles.categoryHeader} onPress={() => { setCategoryOpen(!categoryOpen) }}>
                <Text style={styles.categoryTitle}>
                  {t('event_categories.' + selectedCategory)}
                </Text>
                <View style={styles.categoryButtonHolder} >
                  <Image source={categoryOpen ? icon_collapse : icon_expand} style={styles.categoryButtonIcon} />

                </View>
              </TouchableOpacity>
              {categoryOpen ? <View style={styles.categoryMainView}>
                {createCategoryEntries()}
              </View> : null}
            </View>
          </View>
          <View>
            <Image source={getImage()} style={styles.categoryIconChange} />

          </View>
        </View>
      </View>
      <Label
        dimension="normal"
        weight="semibold"
        color={colors.mainText}
        marginLeft={'5%'}
        style={{ marginLeft: padding.quarter }}>
        {t("create.total_event")}
      </Label>
      <TextInput style={styles.totalEvent}
        onChangeText={(text) => setEventTotal(Number(text) || 0)}
        keyboardType="numeric"
      />

      <Label
        dimension="normal"
        weight="semibold"
        color={colors.mainText}
        marginLeft={'5%'}
        style={{ marginLeft: padding.quarter }}>
        {t("create.desc_event")}
      </Label>
      <TextInput
        style={styles.totalEvent}
        onChangeText={(text) => setDescEvent(String(text))}
        value={descEvent}
      />
      <View style={styles.columnContainer}>
        <Label
          dimension="normal"
          weight="semibold"
          color={colors.mainText}
          marginLeft={'5%'}
          style={{ marginLeft: padding.quarter }}>
          {t("create.list_title")}
        </Label>
        <View style={styles.categoryContainer}>
          <TouchableOpacity style={styles.categoryHeader} onPress={() => { setUserOpen(!userOpen) }}>
            <Text style={styles.categoryTitle}>

            </Text>
            <View style={styles.categoryButtonHolder} >
              <Image source={userOpen ? icon_collapse : icon_expand} style={styles.categoryButtonIcon} />

            </View>
          </TouchableOpacity>
          {userOpen ? <View style={styles.categoryMainView}>
            {userCells}
          </View> : null}
        </View>

      </View>
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
    flex: 1,
    height: 40,
    padding: 10,
    alignSelf: 'stretch',
    backgroundColor: colors.disabledGrey,
    marginTop: '2%',
    marginBottom: '4%'

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
    flex: 1,

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
    marginVertical: '2%',
    marginBottom: '6%',
    padding: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
    flex: 2,

    borderWidth: 4,
    borderColor: colors.secondary,
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
    color: colors.highlightText,
    justifyContent: 'flex-start',


  },

  catContainer: {
    marginHorizontal: '-0.5%',
    marginVertical: '6%',
    marginBottom: '5%',
    padding: 10,
    paddingHorizontal: 7,
    borderRadius: 6,
    flex: 3,

    backgroundColor: colors.secondary,

  },
  categoryEntry: {
    marginLeft: 8,
    fontSize: 20,
    color: colors.highlightText
  },
  categoryIconChange: {
    alignSelf: 'center',
    backgroundColor: colors.primary,
    marginBottom: '4%',
    borderRadius: 10
  },

  totalEvent: {
    backgroundColor: colors.lightGrey,
    marginBottom: '4%',
    marginTop: '2%'

  },

  menuEntry: {
    marginVertical: 6
  },
  menuEntryName: {
    marginLeft: 8,
    fontSize: 20,
    color: colors.highlightText
  },
  menuEntryEntry: {
    marginLeft: 16,
    fontSize: 16,
    color: colors.mainText
  },

  PartecipantButton: {
    aspectRatio: 1,
    height: 20,
    borderColor: colors.disabledGrey,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  partecipantButtonInner: {
    aspectRatio: 1,
    height: 12,
    backgroundColor: colors.disabledGrey,
  },

  partecipantEntry: {
    marginVertical: 6,
  },
  partecipantColumn: {
    flexDirection: 'row',

  },
  menuEntryNameCategory: {
    fontSize: 17,
    marginTop: 3,
    marginBottom: 3,
    color: colors.mainText
  },
});


export default CreateEvent;
function setCount(arg0: (prevCount: any) => any) {
  throw new Error("Function not implemented.");
}

