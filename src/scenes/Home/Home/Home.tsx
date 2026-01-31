import { Alert, Button, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import Label from "../../../components/Label"
import padding from "../../../styles/padding"
import colors from "../../../styles/colors"
import { useTranslation } from "react-i18next"
import { useContext, useEffect, useState } from "react"
import { BackendServiceContext } from "../../../Providers/Backend/BackendServiceProvider"
import { useNavigation } from "@react-navigation/native"
import { AppContext } from "../../../Providers/App/AppProvider"
import EventList from "../../../components/EventList"
import { EventsListResponseDTO } from "../../../models/services/EventsListResponseDTO"
import { ScrollView } from "react-native-gesture-handler"
import { icon_add, icon_filter } from "../../../assets/images/index"
import Modal from "react-native-modal"
import DropShadow from "react-native-drop-shadow"
import { icon_expand, icon_collapse } from "../../../assets/images/index"

type HomeProps = {
  parentProps: any

}

function Home(props: HomeProps) {
  const { t } = useTranslation()
  const navigation = useNavigation<any>()
  const appContext = useContext(AppContext)
  const backendService = useContext(BackendServiceContext)

  const [eventListData, setEventListData] = useState<EventsListResponseDTO>()
  const [active, setactive] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false)
  const [paymentOpen, setPaymentOpen] = useState(false)
  const [creatorOpen, setCreatorOpen] = useState(false)
  const [categoriesList, setCategoriesList] = useState<Array<string>>([]);
  const [selectedCategories, setSelectedCategories] = useState<Array<string>>([]);
  const [selectedPayment, setSelectedPayment] = useState(-1);
  const [selectedCreator, setSelectedCreator] = useState(-1);

  useEffect(() => {
    const listener = function () {
      console.log("*** Home - useEffect - Listening...")
      fetchEventList()
    }
    const unsubscribe = navigation.addListener("focus", listener)
    return unsubscribe // Cleanup
  }, [])

  const fetchEventList = () => {
    appContext?.app.handleLoader(true)
    backendService?.beService.getEventList().then((eventListResponse) => {
      setEventListData(eventListResponse)
    }).catch((eventListError: any) => {
      // Handling session expired error.
      // If even refreshToken returns 401, user must be logged out.
      if (eventListError.status === 401) {
        Alert.alert(t("general.error"), t("errors.unauthorized"), [
          {
            text: t("general.ok").toUpperCase(),
            onPress: () => {
              props.parentProps.logout()
            },
          }
        ]);
      } else {
        Alert.alert(t("general.error"), eventListError.message)
      }
    }).finally(() => {

      appContext?.app.handleLoader(false)
    })
  }

  const setSelectedPaymentOption = (index : number) => {
    if (index == selectedPayment) {
      setSelectedPayment(-1)
      return
    }

    setSelectedPayment(index)
  }

  const setSelectedCreatorOption = (index : number) => {
    if (index == selectedCreator) {
      setSelectedCreator(-1)
      return
    }

    setSelectedCreator(index)
  }

  //for category section of filter module

  const getCategoriesList = () => {
    appContext?.app.handleLoader(true);
    //prendo categorie da appContext
  };

  const addSelectedCategories = (category: string) => {
    if (selectedCategories.includes(category)) {
      console.log(selectedCategories, category, selectedCategories.includes(category))
      let newArray = selectedCategories.filter((item) => { return item != category })
      setSelectedCategories(newArray)
    } else {
      let newArray = selectedCategories.filter((item) => { return true })
      newArray.push(category)
      setSelectedCategories(newArray)
    }
  }

  const createCategoriesEntries = () => {
    if (categoriesList == undefined) {
      return <View>
      </View>
    }
    let cells = new Array()
    let i: number = 0
    for (i = 0; i < (categoriesList.length); i++) {
      const buttonCategory = categoriesList[i]
      cells[i] = <View style={styles.filterFieldMainView}>
        <TouchableOpacity onPress={() => { addSelectedCategories(buttonCategory) }} style={styles.filterFieldOption}>
          <View style={styles.filterFieldButton}>
            {selectedCategories.includes(buttonCategory) ? <View style={styles.filterFieldOptionSelected}>
            </View> : <View></View>}
          </View>
        </TouchableOpacity>
        <View >
          <Text style={styles.filterFieldText}>
            {(categoriesList[i])}
          </Text>
        </View>
      </View>
    }
    return cells
  }

  let categoriesCells = createCategoriesEntries()

  return (
    <ScrollView style={{ flex: 1, marginTop: padding.full }}>
      <Modal
        isVisible={active}
        onBackdropPress={() => { console.warn("closed"); }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.labelFilter}>
              {t("filter.filters")}
            </Text>
            <ScrollView style={styles.filterFieldContainer}>
              <TouchableOpacity style={styles.filterFieldHeader} onPress={() => { setCategoriesOpen(!categoriesOpen) }}>
                <Text style={styles.filterFieldTitle}>
                  {t("filter.categories")}
                </Text>
                <View style={styles.filterFieldButtonHolder}>
                  <Image source={categoriesOpen ? icon_collapse : icon_expand} style={styles.filterFieldButtonIcon} />
                </View>
              </TouchableOpacity>
              {categoriesOpen ? <View style={styles.filterFieldMainView}>
                {createCategoriesEntries()}
              </View> : null}
            </ScrollView>

            <View style={styles.filterFieldContainer}>
              <TouchableOpacity style={styles.filterFieldHeader} onPress={() => { setPaymentOpen(!paymentOpen) }}>
                <Text style={styles.filterFieldTitle}>
                  {t("filter.payment")}
                </Text>
                <View style={styles.filterFieldButtonHolder}>
                  <Image source={paymentOpen ? icon_collapse : icon_expand} style={styles.filterFieldButtonIcon} />
                </View>
              </TouchableOpacity>
              {paymentOpen ? <View style={styles.filterFieldMainView}>
                <View style={styles.filterFieldOption}>
                  <TouchableOpacity style={styles.filterFieldButton} onPress={() => {setSelectedPaymentOption(0)}}>
                    {selectedPayment == 0 ? <View style={styles.filterFieldOptionSelected}/> : <View/>}
                  </TouchableOpacity>
                  <Text style={styles.filterFieldText}>
                    {t("filter.payed")}
                  </Text>
                </View>
                <View style={styles.filterFieldOption}>
                  <TouchableOpacity style={styles.filterFieldButton} onPress={() => {setSelectedPaymentOption(1)}}>
                    {selectedPayment == 1 ? <View style={styles.filterFieldOptionSelected}/> : <View/>}
                  </TouchableOpacity>
                  <Text style={styles.filterFieldText}>
                    {t("filter.not_payed")}
                  </Text>
                </View>

              </View> : null}
            </View>

            <View style={styles.filterFieldContainer}>
              <TouchableOpacity style={styles.filterFieldHeader} onPress={() => { setCreatorOpen(!creatorOpen) }}>
                <Text style={styles.filterFieldTitle}>
                  {t("filter.creator")}
                </Text>
                <View style={styles.filterFieldButtonHolder}>
                  <Image source={creatorOpen ? icon_collapse : icon_expand} style={styles.filterFieldButtonIcon} />
                </View>
              </TouchableOpacity>
              {creatorOpen ? <View style={styles.filterFieldMainView}>
                <View style={styles.filterFieldOption}>
                  <TouchableOpacity style={styles.filterFieldButton} onPress={() => {setSelectedCreatorOption(0)}}>
                    {selectedCreator == 0 ? <View style={styles.filterFieldOptionSelected}/> : <View/>}
                  </TouchableOpacity>
                  <Text style={styles.filterFieldText}>
                    {t("filter.created_by_me")}
                  </Text>
                </View>
                <View style={styles.filterFieldOption}>
                  <TouchableOpacity style={styles.filterFieldButton} onPress={() => {setSelectedCreatorOption(1)}}>
                    {selectedCreator == 1 ? <View style={styles.filterFieldOptionSelected}/> : <View/>}
                  </TouchableOpacity>
                  <Text style={styles.filterFieldText}>
                    {t("filter.partecipating")}
                  </Text>
                </View>

              </View> : null}
            </View>

            <View style={styles.modalButtonContainer}>
              <View style={styles.addEventButtonContainer}>
                <TouchableOpacity style={styles.modalButton} onPress={() => { setactive(!active) }}>
                  <Label style={styles.labelFilterButton}>
                    {t("general.confirm")}
                  </Label>
                </TouchableOpacity>
              </View>
              <View style={styles.addEventButtonContainer}>
                <TouchableOpacity style={[styles.modalButton, { backgroundColor: colors.primary, marginLeft: 10 }]} onPress={() => { setactive(!active) }}>
                  <Label style={styles.labelFilterButton}>
                    {t("general.cancel")}
                  </Label>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
      <View style={styles.container}>
        <Label style={styles.labelEvent}>
          {t("home.events")}
        </Label>
        <View style={styles.filterButtonContainer}>
          <TouchableOpacity style={styles.addEventButton} onPress={() => { setactive(!active) }}>
            <Image source={icon_filter} style={styles.addIcon} />
          </TouchableOpacity>
        </View>
        <View style={styles.addEventButtonContainer}>
          <TouchableOpacity style={styles.addEventButton} onPress={() => { navigation.navigate("CreateEvent") }}>
            <Image source={icon_add} style={styles.addIcon} />
          </TouchableOpacity>
        </View>
      </View>
      <EventList events={eventListData} />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  labelEvent: {
    flex: 5,
    alignSelf: 'center',
    color: colors.primaryDark,
    marginBottom: padding.quarter,
    marginLeft: padding.full,
    fontWeight: 'bold',
    fontSize: 30

  },

  labelFilterButton: {
    alignSelf: 'center',
    color: colors.background,
    fontWeight: '700',
    fontSize: 20,
    margin: 5,
  },

  labelFilter: {
    width: '100%',
    alignSelf: 'center',
    color: colors.background,
    marginBottom: 10,
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 6,
    backgroundColor: colors.primary,
    fontWeight: 'bold',
    fontSize: 30
  },

  container: {
    height: '100%',
    flex: 1,
    marginRight: '9%',
    flexDirection: 'row',
    marginBottom: 10,
  },

  modalContainer: {
    flex: 1,

    backgroundColor: "transparent",
    alignItems: 'center',
    justifyContent: 'center',
  },

  modalButtonContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 15
  },

  modalView: {
    backgroundColor: colors.background,
    padding: 8,
    width: '90%',
    alignItems: "center",
    justifyContent: "center"
  },

  modalButton: {
    borderRadius: 6,
    backgroundColor: colors.paymentGreen,
  },

  addEventButtonContainer: {
    flex: 1
  },

  addIcon: {
    tintColor: colors.primaryDark,
    height: '100%',
    aspectRatio: 1,
  },

  addEventButton: {
    height: '100%',
    aspectRatio: 1,
    padding: 4,
    backgroundColor: colors.background,
    borderColor: colors.primaryDark,
    borderWidth: 3,
    borderRadius: '100%'
  },

  filterButtonContainer: {
    flex: 1,
    marginRight: '10%',
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

  filterFieldButtonHolder: {
    height: 32,
    aspectRatio: 1,
  },

  filterFieldButtonIcon: {
    height: '100%',
    aspectRatio: 1,
    tintColor: colors.secondary
  },

  filterFieldMainView: {
  },

  filterFieldContainer: {
    marginHorizontal: 12,
    marginVertical: 6,
    padding: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
    width: '100%',
  },

  filterFieldHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },

  filterFieldTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.secondary,
  },

  filterFieldText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.mainText,
  },

  filterFieldButton: {
    height: 30,
    aspectRatio: 1,
    borderColor: colors.disabledGrey,
    borderWidth: 2,
    borderRadius: '100%',
    marginRight: 10,
    justifyContent: 'center',
  },

  filterFieldOption: {
    flexDirection: 'row',
    marginBottom: 10
  },

  filterFieldOptionSelected: {
    backgroundColor: colors.disabledGrey,
    width: 20,
    height: 20,
    borderRadius: '100%',
    alignSelf: 'center',
  }


});

export default Home