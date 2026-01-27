import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { AppContext } from "../Providers/App/AppProvider";
import { StyleSheet, View, ViewStyle } from "react-native";
import colors from "../styles/colors";
import { EventsListResponseDTO } from "../models/services/EventsListResponseDTO";
import Label from "./Label";
import padding from "../styles/padding";
import EventListCell from "./EventListCell";
import { createAnimatedComponent } from "react-native-reanimated/lib/typescript/createAnimatedComponent";

type EventListProps = {
    events: EventsListResponseDTO | undefined
};

function EventList(props: EventListProps) {
    const { t } = useTranslation()
    const appContext = useContext(AppContext)

    const createCells = (events : EventsListResponseDTO | undefined) => {
        if (events == undefined) {
            return <View>

            </View>
        }

        let cells = new Array()
        let i : number = 0

        for (i = 0; i < (events.eventiList.length); i++) {
            cells[events.eventiList[i].id] = <EventListCell event={events.eventiList[i]}></EventListCell>
        }

        return cells
    }

    const cells = createCells(props.events)

    return (
        <View style={styles.container}>
            {cells}
        </View>
    )
}

const styles = StyleSheet.create({
  container: { backgroundColor: colors.white },
  
});

export default EventList