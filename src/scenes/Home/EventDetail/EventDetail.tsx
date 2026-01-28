import { Image, ScrollView, StyleSheet, Text, View } from "react-native"
import Label from "../../../components/Label"
import { useTranslation } from "react-i18next"
import colors from "../../../styles/colors"
import padding from "../../../styles/padding"
import { useRoute } from "@react-navigation/native"
import icons from "../../../assets/images/eventIcons"
import { AutoSizeText, ResizeTextMode } from "react-native-auto-size-text"

type EventDetailProps = {
  route?: any
}

function EventDetail(props: EventDetailProps) {
  const { t } = useTranslation()
  const {event}= props.route?.params

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
        <AutoSizeText mode={ResizeTextMode.group} style={styles.eventTitle} numberOfLines={1}>
          {event.nome}
        </AutoSizeText>
      </View>
      <View style={styles.categoryContainer}>


        <Text style={styles.eventCategory} adjustsFontSizeToFit>
          {"PLACEHOLDER_CATEGORY"}
        </Text>

        <View style={styles.iconContainer}>
          <Image source={getImage()} style={styles.categoryIcon}>

          </Image>
        </View>
      </View>
      <View style={styles.detailsContainer}>
        <Text style={styles.eventDate}>
          {"PLACEHOLDER_DATE"}
        </Text>
      </View>
      <View style={styles.paymentContainer}>

      </View>
      <View style={styles.participantsContainer}>

      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  eventTitle: {
    flex: 1,
    maxHeight: '100%',
    marginHorizontal: 6,
    fontWeight: 'bold',
    color: colors.primaryDark,
    backgroundColor: colors.secondary
  },
  eventDate: {
    flex: 1,
    fontSize: 24,
    marginHorizontal: 8,
  },
  eventCategory: {
    fontSize: 20,
    color: colors.background,
    height: '100%',
  },

  categoryIcon: {
  },
  iconContainer: {
    flex: 1,
    height: '100%',
  },

  topContainer: {
    height: '15%',
    flexDirection: 'row',
    padding: 8
  },
  categoryContainer: {
    flex: 0,
    borderRadius: 6,
    marginVertical: 6,
    marginHorizontal: 8,
    padding: 4,
    height: '15%',
    backgroundColor: colors.secondary,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  topRectangle: {
    height: '100%',
    aspectRatio: 1,
    borderRadius: 8,
    backgroundColor: colors.primary,
  },
  detailsContainer: {},
  paymentContainer: {},
  participantsContainer: {}

});



export default EventDetail