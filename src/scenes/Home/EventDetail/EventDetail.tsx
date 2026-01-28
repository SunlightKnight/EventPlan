import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import Label from "../../../components/Label"
import { useTranslation } from "react-i18next"
import colors from "../../../styles/colors"
import padding from "../../../styles/padding"
import { useRoute } from "@react-navigation/native"
import icons from "../../../assets/images/eventIcons"
import { AutoSizeText, ResizeTextMode } from "react-native-auto-size-text"
import DropShadow from "react-native-drop-shadow"

type EventDetailProps = {
  route?: any
}

function EventDetail(props: EventDetailProps) {
  const { t } = useTranslation()
  const { event } = props.route?.params

  const getImage = () => {
    let url = icons.undefined

    return url
  }

  return (
    <ScrollView>
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
          <TouchableOpacity style={styles.paymentContainer}>
            <Text style={styles.paymentText}>
              {t("payment.proceed_to_payment")}
            </Text>
          </TouchableOpacity>
        </DropShadow>

        <DropShadow style={styles.generalShadow}>
          <View style={styles.participantsContainer}>

          </View>
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
    fontSize: 22,
    fontWeight: '600',
    color: colors.white,
  },

  categoryIcon: {
    height: '100%',
    aspectRatio: 1,
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
  detailsContainer: {
    flex: 4,
  },
  descriptionContainer: {
    flex: 5,

    backgroundColor: colors.background,
    paddingVertical: 4,
    borderRadius: 6,
    margin: 12
  },
  paymentContainer: {
    flex: 1,
    alignItems: 'center',

    marginHorizontal: 12,
    padding: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
    backgroundColor: colors.paymentGreen,
  },
  paymentContainerDisabled: {
    flex: 1,

    marginHorizontal: 12,
    padding: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
    backgroundColor: colors.disabledGrey,
  },
  participantsContainer: {
    marginHorizontal: 12,
    padding: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
    flex: 2,
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