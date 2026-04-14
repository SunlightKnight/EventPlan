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
import { EventDTO } from "../models/services/EventDTO";
import { PartecipantDTO } from "../models/services/PartecipantDTO";
import { BackendServiceContext } from "../Providers/Backend/BackendServiceProvider";
import { AccountServiceContext } from "../Providers/Account/AccountServiceProvider";

type EventListProps = {
    events: EventDTO[] | null
    categoryFilters: Array<string>
    paymentFilter: number
};

const category = [
  ('event_categories.undefined'),
  ('event_categories.school'),
  ('event_categories.business'),
  ('event_categories.history'),
  ('event_categories.music'),
  ('event_categories.party'),
  ('event_categories.social'),
  ('event_categories.sport')
]

function EventList(props: EventListProps) {
    const { t } = useTranslation()
    const appContext = useContext(AppContext)
    const accountContext = useContext(AccountServiceContext)

    let index : number

    const isCurrentUserInParticipantsList = (event : EventDTO) => {
        let participantsList : Array<PartecipantDTO> = event.partecipantiList
        let i : number = 0

        for (i = 0; i < participantsList.length; i++) {
            if (!(participantsList[i].username == accountContext?.aService.getUserName())) {
                continue
            }
            index = i
            return true
        }

        return false
    }


    const createCells = (events : EventDTO[] | null, filterCategory : Array<string>, filterPayment:number) => {
        if (events == null) {
            return <View> </View>
        }
        
        let cells = new Array()
        let i : number = 0
        let j : number =0
        for (i = 0; i < (events.length); i++) {
            let flagP : boolean = false
            let flagC : boolean = false
            if(isCurrentUserInParticipantsList(events[i])) {
                if(filterPayment==-1&&filterCategory.length==0){
                    cells[events[i].id] = <EventListCell event={events[i]}></EventListCell>
                    continue
                }
                

                switch(filterPayment){
                    case 0:{
                        if(events[i].partecipantiList[index].dataPagamento!=null){
                            flagP=true
                        }
                        break
                    }
                    case 1:{
                        if(events[i].partecipantiList[index].dataPagamento==null){
                            flagP=true
                        }
                        break
                    }
                }
                
                if(filterCategory.length>0){
                    for(j=0;j<filterCategory.length; j++){
                        if(filterCategory[j]=="event_categories."+events[i].categoria){
                            flagC=true
                            break
                        }
                    }
                }

                if((filterPayment==-1 || flagP==true) && (filterCategory.length==0 || flagC)){
                    cells[events[i].id] = <EventListCell event={events[i]}></EventListCell>
                }


            }
        }

        return cells
    }

    const cells = createCells(props.events, props.categoryFilters,props.paymentFilter)

    return (
        <View style={styles.container}>
            {cells}
        </View>
    )
}

const styles = StyleSheet.create({
  container: { backgroundColor: colors.background },
  
});

export default EventList