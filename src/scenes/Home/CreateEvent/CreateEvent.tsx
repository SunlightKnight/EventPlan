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
import { icon_school } from "../../../assets/images/index"
import { PartecipantDTO } from "../../../models/services/PartecipantDTO";
import { EventDTO } from "../../../models/services/EventDTO";


type CreateEventProps = {
  route: any;
  parentProps: any
};



function CreateEvent(props: CreateEventProps) {
  const { t } = useTranslation();

  const appContext = useContext(AppContext)
  const accountServiceContext = useContext(AccountServiceContext)
  const backendService = useContext(BackendServiceContext);
  const { event } = props.route?.params

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
  const accountContext = useContext(AccountServiceContext)

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
          <TouchableOpacity onPress={() => { setSelectedCategory(category[i]); setCategoryOpen(false) }}>
            <Text>
              {t('' + category[i])}
            </Text>
          </TouchableOpacity>
        </View>)
      cells.push(view)
    }

    return cells
  }

  const isCurrentUserInParticipantsList = (event: EventDTO) => {
      let participantsList: Array<PartecipantDTO> = event.partecipantiList
      let i: number = 0
  
      for (i = 0; i < participantsList.length; i++) {
        if (!(participantsList[i].username == accountContext?.aService.getUserName())) {
          continue
        }
  
        console.log(participantsList[i].idPartecipante, i)
  
        return [participantsList[i].idPartecipante, i]
      }
  
      return [-100, -100]
    }

  const createParticipantEntries = (participants: Array<PartecipantDTO>) => {
      if (participants == undefined) {
        return <View>
  
        </View>
      }
  
      let cells = new Array()
      let i: number = 0
  
      for (i = 0; i < (participants.length); i++) {
        cells[participants[i].idPartecipante] = <View style={styles.menuEntry}>
          <Text style={styles.menuEntryName}>
            {(participants[i].username == accountContext?.aService.getUserName() ? '> ' : '') + (participants[i].cognome ? participants[i].cognome : 'Doe') + " " + (participants[i].nome ? participants[i].nome : 'John')}
          </Text>
  
          <Text style={styles.menuEntryEntry}>
            {'Username: ' + (participants[i].username ? participants[i].username : 'N/A')}
          </Text>
          <Text style={styles.menuEntryEntry}>
            {'Spesa: €' + (participants[i].spesa ? participants[i].spesa : '0')}
          </Text>
          <Text style={styles.menuEntryEntry}>
            {'Data di pagamento: ' + (participants[i].dataPagamento ? participants[i].dataPagamento : 'NON EFFETTUATO')}
          </Text>
        </View>
      }
  
      return cells
    }

  //const categoryCells = createCategoryEntries();
  const participantCells = createParticipantEntries(event.partecipantiList)

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
          <DropShadow style={styles.generalShadow}>
            <View style={styles.categoryContainer}>
              <TouchableOpacity style={styles.categoryHeader} onPress={() => { setCategoryOpen(!categoryOpen) }}>
                <Text style={styles.categoryTitle}>
                  {t(selectedCategory)}
                </Text>
                <View style={styles.categoryButtonHolder} >
                  <Image source={categoryOpen ? icon_collapse : icon_expand} style={styles.categoryButtonIcon} />

                </View>
              </TouchableOpacity>
              {categoryOpen ? <View style={styles.categoryMainView}>
                {createCategoryEntries()}
              </View> : null}
            </View>
          </DropShadow>
          <View>
            <Image source={icon_school} style={styles.schoolIcon} />

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
      <TextInput
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
        onChangeText={setDescEvent}
        value={text}
      />
      <View style={styles.columnContainer}>
        <Label
        dimension="normal"
        weight="semibold"
        color={colors.mainText}
        marginLeft={'5%'}
        style={{ marginLeft: padding.quarter }}>
        {t("create._list_title")}
      </Label>
          <DropShadow style={styles.generalShadow}>
            <View style={styles.categoryContainer}>
              <TouchableOpacity style={styles.categoryHeader} onPress={() => { setCategoryOpen(!categoryOpen) }}>
                <Text style={styles.categoryTitle}>
                  {t(selectedCategory)}
                </Text>
                <View style={styles.categoryButtonHolder} >
                  <Image source={categoryOpen ? icon_collapse : icon_expand} style={styles.categoryButtonIcon} />

                </View>
              </TouchableOpacity>
              {categoryOpen ? <View style={styles.categoryMainView}>
                {participantCells}
              </View> : null}
            </View>
          </DropShadow>
          
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
    marginHorizontal: '1%',
    marginVertical: '2%',
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

  catContainer: {
    marginHorizontal: '-0.5%',
    marginVertical: '5%',
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
  schoolIcon: {
    height: '75%',
    aspectRatio: 1,
    alignSelf: 'center',
    backgroundColor: colors.primary,
    borderRadius: 6,
  },

  totalEvent:{
    backgroundColor: colors.secondary,

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



});


export default CreateEvent;
function setCount(arg0: (prevCount: any) => any) {
  throw new Error("Function not implemented.");
}

