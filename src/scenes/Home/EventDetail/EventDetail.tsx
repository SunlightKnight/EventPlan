import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import Label from "../../../components/Label"
import { useTranslation } from "react-i18next"
import colors from "../../../styles/colors"
import padding from "../../../styles/padding"
import { useRoute } from "@react-navigation/native"
import icons from "../../../assets/images/eventIcons"
import { icon_expand, icon_collapse } from "../../../assets/images/index"
import { AutoSizeText, ResizeTextMode } from "react-native-auto-size-text"
import DropShadow from "react-native-drop-shadow"
import { DO_NOT_USE_OR_YOU_WILL_BE_FIRED_EXPERIMENTAL_IMG_SRC_TYPES, useState } from "react"
import { PartecipantDTO } from "../../../models/services/PartecipantDTO"
import Modal from "react-native-modal"
import { CreditCardFormData, CreditCardFormField, CreditCardInput, CreditCardView } from "react-native-credit-card-input"
import { KeyboardAvoidingView } from "react-native-keyboard-controller"

type EventDetailProps = {
  route?: any
}

function EventDetail(props: EventDetailProps) {
  const { t } = useTranslation()
  const { event } = props.route?.params

  const [participantsOpen, setParticipantsOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [creditCardInfo, setCreditCardInfo] = useState<CreditCardFormData>()
  const [focusedField, setFocusedField] = useState<CreditCardFormField>()

  const getImage = () => {
    let url = icons.undefined

    return url
  }

  const createParticipantEntries = (participants: Array<PartecipantDTO>) => {
    if (participants == undefined) {
      return <View>

      </View>
    }

    let cells = new Array()
    let i: number = 0

    for (i = 0; i < (participants.length); i++) {
      cells[participants[i].idPartecipante] = <View style={styles.participantsEntry}>
        <Text style={styles.participantsEntryName}>
          {(participants[i].cognome ? participants[i].cognome : 'Doe') + " " + (participants[i].nome ? participants[i].nome : 'John')}
        </Text>

        <Text style={styles.participantsEntryEntry}>
          {'Username: ' + (participants[i].username ? participants[i].username : 'N/A')}
        </Text>
        <Text style={styles.participantsEntryEntry}>
          {'Spesa: €' + (participants[i].spesa ? participants[i].spesa : '0')}
        </Text>
        <Text style={styles.participantsEntryEntry}>
          {'Data di pagamento: ' + (participants[i].dataPagamento ? participants[i].dataPagamento : 'NON EFFETTUATO')}
        </Text>
      </View>
    }

    return cells
  }

  const participantCells = createParticipantEntries(event.partecipantiList)

  return (
    <ScrollView>
      <Modal
        isVisible={modalOpen}
        onBackdropPress={() => { setModalOpen(false) }}>
        <KeyboardAvoidingView behavior="padding" style={{flex: 1, justifyContent: 'center'}}>
          <View style={{backgroundColor: colors.background, paddingVertical: 20}}>
            <CreditCardView
              focusedField={focusedField}
              type={creditCardInfo?.values.type}
              number={creditCardInfo?.values.number}
              expiry={creditCardInfo?.values.expiry}
              cvc={creditCardInfo?.values.cvc}
              style={{ alignSelf: "center" }}
            />
            <CreditCardInput onChange={(data) => { setCreditCardInfo(data) }} />
          </View>
        </KeyboardAvoidingView>
      </Modal>

      <View style={styles.topContainer}>
        <View style={styles.topRectangle}>
          <View style={styles.iconContainer}>
            <Image source={getImage()} style={styles.categoryIcon} />
          </View>
        </View>
        <Text style={styles.eventTitle} numberOfLines={2}>
          {event.nome}
        </Text>
      </View>
      <View style={styles.detailsContainer}>
        <DropShadow style={styles.generalShadow}>
          <View style={styles.descriptionContainer}>
            <View style={styles.spacer} />
            <View style={styles.dateCategoryContainer}>
              <Text style={styles.eventDate}>
                {event.dataEv}
              </Text>
              <Text style={styles.eventCategory}>
                {event.category ? event.category : t('event_categories.undefined')}
              </Text>
            </View>
            <View style={styles.spacer} />
            <View style={styles.mainDescriptionContainer}>
              <Text style={styles.eventDescription}>
                {'"' + event.descr + '"'}
              </Text>
            </View>
          </View>
        </DropShadow>

        <DropShadow style={styles.generalShadow}>
          <View style={styles.participantsContainer}>
            <View style={styles.participantHeader}>
              <Text style={styles.participantsTitle}>
                {t("detail.participants")}
              </Text>
              <TouchableOpacity style={styles.participantsButtonHolder} onPress={() => { setParticipantsOpen(!participantsOpen) }}>
                <Image source={participantsOpen ? icon_collapse : icon_expand} style={styles.participantsButtonIcon} />
              </TouchableOpacity>
            </View>
            {participantsOpen ? <View style={styles.participantMainView}>
              {participantCells}
            </View> : null}
          </View>
        </DropShadow>

        <DropShadow style={styles.generalShadow}>
          <TouchableOpacity style={styles.paymentContainer} onPress={() => { setModalOpen(!modalOpen) }}>
            <Text style={styles.paymentText}>
              {t("payment.proceed_to_payment")}
            </Text>
          </TouchableOpacity>
        </DropShadow>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  generalShadow: {
    shadowColor: colors.mainText,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: .3,
    shadowRadius: 6,
  },
  spacer: {
    height: 2,
    backgroundColor: colors.secondary,
    marginHorizontal: 8,
    marginVertical: 4
  },

  eventTitle: {
    flex: 1,
    marginHorizontal: 6,
    fontWeight: 'bold',
    fontSize: 36,
    color: colors.primaryDark,
  },
  eventDate: {
    flex: 1,
    fontSize: 16,
    fontStyle: 'italic',
    color: colors.secondaryDark,
  },
  eventCategory: {
    flex: 0,
    fontSize: 16,
    fontWeight: '500',
    color: colors.secondaryDark,
    height: '100%',
  },
  eventDescription: {
    flex: 0,
    fontSize: 18,
    fontWeight: '400',
    color: colors.mainText,
    height: '100%',
  },
  paymentText: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.white,
  },
  participantsTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.secondaryDark
  },
  participantsEntry: {
    marginVertical: 6
  },
  participantsEntryName: {
    marginLeft: 8,
    fontSize: 20,
    color: colors.highlightText
  },
  participantsEntryEntry: {
    marginLeft: 16,
    fontSize: 16,
    color: colors.mainText
  },

  categoryIcon: {
    height: '100%',
    aspectRatio: 1,
  },
  participantsButtonIcon: {
    height: '100%',
    aspectRatio: 1,

    tintColor: colors.secondary
  },
  iconContainer: {
    flex: 1,
    height: '100%',
  },

  topContainer: {
    flex: 1,
    flexDirection: 'row',
    padding: 12
  },
  topRectangle: {
    width: '25%',
    aspectRatio: 1,
    borderRadius: 8,
    backgroundColor: colors.primary,
  },
  participantsButtonHolder: {
    height: 32,
    aspectRatio: 1,
  },
  detailsContainer: {
    flex: 4,
  },
  descriptionContainer: {
    flex: 5,

    backgroundColor: colors.background,
    paddingVertical: 4,
    borderRadius: 6,
    marginHorizontal: 12,
    marginVertical: 6,
  },
  paymentContainer: {
    flex: 1,
    alignItems: 'center',

    marginHorizontal: 12,
    marginVertical: 6,
    padding: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
    backgroundColor: colors.paymentGreen,
  },
  paymentContainerDisabled: {
    flex: 1,

    marginHorizontal: 12,
    marginVertical: 6,
    padding: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
    backgroundColor: colors.disabledGrey,
  },
  participantsContainer: {
    marginHorizontal: 12,
    marginVertical: 6,
    padding: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
    flex: 2,

    backgroundColor: colors.background,
  },
  participantHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  participantMainView: {

  },
  dateCategoryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  mainDescriptionContainer: {
    marginVertical: 6,
    paddingHorizontal: 8,
  },

});



export default EventDetail