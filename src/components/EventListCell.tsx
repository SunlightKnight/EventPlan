import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { EventDTO } from "../models/services/EventDTO";
import colors from "../styles/colors";
import DropShadow from "react-native-drop-shadow";
import {icon_double_arrow} from "../assets/images/index"
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";

type EventListCellProps = {
  event: EventDTO
  onCellPress?: () => void
};

function EventListCell(props: EventListCellProps) {
  const navigation = useNavigation<any>()

  const [event, getEvent] = useState(props.event)

  return (
    <DropShadow style={styles.containerShadow}>
      <View style={styles.container}>
        <View style={styles.textContainer}>
          <Text style={styles.eventName} numberOfLines={1} ellipsizeMode="tail">
            {event.nome}
          </Text>
          <Text style={styles.eventDate}>
            {event.dataEv}
          </Text>
        </View>
        <View style={styles.detailsButtonContainer}>
          <TouchableOpacity style={styles.detailsButton} onPress={() => {navigation.navigate("EventDetail", {event}) }}>
            <Image source={icon_double_arrow} style={styles.arrowIcon}/>
          </TouchableOpacity>
        </View>
      </View>
    </DropShadow>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 12,
    marginVertical: 6,
    borderRadius: 8,
    padding: 12,
    backgroundColor: colors.white,
    flexDirection: 'row'
  },
  containerShadow: {
    shadowColor: colors.mainText,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: .3,
    shadowRadius: 5,
  },

  textContainer: {
    flex:1,
  },
  detailsButtonContainer: {
    flex:0,
  },

  arrowIcon: {
    tintColor: colors.background,
    alignSelf: 'center',
    height: '100%',
    width: '100%'
  },

  detailsButton: {
    flex:1,
    height: '100%',
    aspectRatio: 1,
    borderRadius: 6,
    padding: 4,
    backgroundColor: colors.secondary,
    flexDirection: 'row'
  },

  eventName: {
    fontSize: 22,
    color: colors.highlightText,
  },
  eventDate: {
    fontSize: 16,
    fontStyle: 'italic',
    color: colors.mainText,
  }
});

export default EventListCell