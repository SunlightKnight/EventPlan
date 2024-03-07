import { useTranslation } from "react-i18next";
import Label from "../../../components/Label";
import DateTextField from "../../../components/DateTextField";
import { useContext, useEffect, useState } from "react";
import colors from "../../../styles/colors";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import commonStyles from "../../../styles/styles";
import padding from "../../../styles/padding";
import { HomeFlowCoordinatorProps } from "../HomeFlowCoordinator";
import { BackendServiceContext } from "../../../services/BackendServiceProvider";
import { Alert, View } from "react-native";
import { UserDTO } from "../../../models/services/UserDTO";
import TextField from "../../../components/TextField";
import CurrencyTextField from "../../../components/CurrencyTextField";
import NameListCell from "../../../components/NameListCell";
import { AccountServiceContext } from "../../../services/AccountServiceProvider";
import CustomButton from "../../../components/CustomButton";
import { CreateEventRequestDTO } from "../../../models/services/CreateEventRequestDTO";
import { formatDate } from "../../../utils/Helper";
import { createEventAPIDateTime, fullDate } from "../../../utils/Constants";

type CreateEventProps = {
  parentProps: HomeFlowCoordinatorProps;
  navigation: any;
};

let tempUsers: Array<UserDTO> = []

function CreateEvent(props: CreateEventProps) {
  const { t } = useTranslation();
  const backendService = useContext(BackendServiceContext);
  const accountService = useContext(AccountServiceContext)
  const [userList, setUserList] = useState<Array<UserDTO>>([]);
  const [nameEvent, setNameEvent] = useState<string>("");
  const [descEvent, setDescEvent] = useState<string>("");
  const [eventTotal, setEventTotal] = useState<number | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<Array<UserDTO>>([]);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  useEffect(() => {
    getUserList();
    tempUsers.push({username: accountService?.aService.getUserName() ?? ""})
    setSelectedUsers(tempUsers)
  }, []);

  const manageParticipantsArray = (user: UserDTO) => {
    if(tempUsers.filter((U) => U.username == user.username).length > 0) {
      tempUsers = tempUsers.filter((U) => U.username != user.username)
    } else {
      tempUsers.push({"username": user.username})
    }
    console.log(tempUsers)
    setSelectedUsers(tempUsers)
  }

  const getUserList = () => {
    props.parentProps.handleLoader(true);
    backendService?.beService
      .getUsersList()
      .then((userListResponse) => {
        setUserList(userListResponse);
      })
      .catch((userListError) => {
        if (userListError.status === 401) {
          Alert.alert(t("general.error"), t("errors.unauthorized"), [
            {
              text: t("general.ok").toUpperCase(),
              onPress: () => {
                props.navigation.popToTop()
                props.parentProps.manageLogout()
              },
            }
          ]);
        } else {
          Alert.alert(t("general.error"), userListError.message)
        }
      })
      .finally(() => {
        props.parentProps.handleLoader(false);
      });
  };

  const saveEvent = () => {
    let creator: UserDTO = {
      "username": accountService?.aService.getUserName() ?? ""
    }
    if(nameEvent && selectedDate && eventTotal && creator && selectedUsers) {
      props.parentProps.handleLoader(true)
      let createEventRequest: CreateEventRequestDTO = {
        "nome": nameEvent,
        "descr": descEvent,
        "dataEv": formatDate(selectedDate.toISOString(), fullDate, createEventAPIDateTime)  ?? (new Date()).toISOString(),
        "spesa": eventTotal ?? 0,
        "creatore": creator,
        "partecipantiList": selectedUsers,
      }
       backendService?.beService.createEvent(createEventRequest).then((_) => {
         Alert.alert(
           t("create.alert_title"), 
           t("create.alert_message"), 
           [
             {
               text: t("general.ok").toUpperCase(),
               onPress: () => {
                 props.navigation.goBack()
               },
             }
           ])
       }).catch((createEventError) => {
         Alert.alert(t("general.error"), createEventError.message + ": " + createEventError.status)
       }).finally(() => {
         props.parentProps.handleLoader(false)
       })
    }
  }

  return (
    <KeyboardAwareScrollView
      style={commonStyles.scrollingContent}
      contentContainerStyle={{paddingBottom: padding.double}}
      extraScrollHeight={padding.double}
    >
      <Label
        dimension="big"
        weight="semibold"
        color={colors.primaryDark}
        style={{ marginBottom: padding.half, marginLeft: padding.quarter }}
      >
        {t("home.create_event")}
      </Label>

      <TextField
        label={t("create.name_event")}
        value={nameEvent}
        onChangeText={(text) => {
          setNameEvent(text);
        }}
      />

      <TextField
        label={t("create.desc_event")}
        value={descEvent}
        onChangeText={(text) => {
          setDescEvent(text);
        }}
      />

      <CurrencyTextField
        label={t("create.total_event")}
        value={eventTotal}
        onChangeValue={(expense) => {
          setEventTotal(expense);
        }}
      />

      <DateTextField
        outerViewStyle={{}}
        fieldTitle={"Date"}
        fieldTitleStyle={{ marginLeft: 0 }}
        open={datePickerOpen}
        mode={"datetime"}
        selectedDate={selectedDate}
        minDate={new Date()}
        iconsStyle={{ tintColor: colors.blackOpacity25, width: 30, height: 30 }}
        onConfirm={(date: Date) => {
          setSelectedDate(date);
          setDatePickerOpen(false);
        }}
        onCancel={() => {
          setDatePickerOpen(false);
        }}
        onDeletePress={() => {
          setSelectedDate(undefined);
        }}
        onDatePickerPress={() => {
          setDatePickerOpen(true);
        }}
      />

      <View style={{marginVertical: padding.onehalf, marginHorizontal: padding.half, height: 1, backgroundColor: colors.blackOpacity25}}/>

      <Label
        dimension="normal"
        weight="semibold"
        color={colors.primaryDark}
        style={{ marginBottom: padding.half, marginLeft: padding.full }}
      >
        {t("create.list_title")}
      </Label>

      {userList.map((user) => {
        return (
          user.username == accountService?.aService.getUserName() ? null :
          <NameListCell
            key={user.username}
            name={user.nome ?? ""}
            surname={user.cognome ?? ""}
            onCellPress={() => {
              manageParticipantsArray(user)
            }}
          />
        )
      })}

      <CustomButton 
        text={t("home.create_event")}
        style={{marginTop: padding.full}}
        onPress={() => {
          saveEvent()
        }} />
    </KeyboardAwareScrollView>
  );
}

export default CreateEvent;
