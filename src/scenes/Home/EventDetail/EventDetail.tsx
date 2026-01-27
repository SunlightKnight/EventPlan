import { Image, ScrollView, StyleSheet, Text, View } from "react-native"
import Label from "../../../components/Label"
import { useTranslation } from "react-i18next"
import colors from "../../../styles/colors"
import padding from "../../../styles/padding"
import { useRoute } from "@react-navigation/native"
import icons from "../../../assets/images/eventIcons"

type EventDetailProps = {
  route?: any
}

function EventDetail(props: EventDetailProps) {
  const { t } = useTranslation()
  const route = useRoute()

  const getImage = () => {
    let url = icons.undefined

    return url
  }

  return (
    <ScrollView>
      <View style={styles.topContainer}>
        <Text style={styles.eventTitle}>
          {"PLACEHOLDER_TITLE"}
        </Text>
      </View>
      <View style={styles.categoryContainer}>
        <View style={styles.iconContainer}>
          <Image source={getImage()} style={styles.categoryIcon}>

          </Image>
        </View>

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
    fontSize: 26,
    fontWeight: 'bold',
    color: colors.primaryDark
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
    height: '100%',
    aspectRatio: 1,
  },
  iconContainer: {
    flex: 0
  },

  topContainer: {
    flexDirection: 'row',
    padding: 8
  },
  categoryContainer: {
    flex: 0,
    borderRadius: 6,
    marginTop: 6,
    marginHorizontal: 8,
    padding: 4,
    height: '15%',
    backgroundColor: colors.secondary,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  detailsContainer: {},
  paymentContainer: {},
  participantsContainer: {}

});



export default EventDetail