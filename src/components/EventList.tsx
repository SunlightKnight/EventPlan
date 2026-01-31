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
    events: EventsListResponseDTO | undefined
    categoryFilters: Array<string>
    paymentFilter: number
    creatorFilter: number
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


    const createCells = (events : EventsListResponseDTO | undefined, filterCategory : Array<string>, filterPayment:number, filterCreator:number) => {
        if (events == undefined) {
            return <View> </View>
        }
        let flag : boolean = false
        let cells = new Array()
        let i : number = 0
        let j : number =0
        for (i = 0; i < (events.eventiList.length); i++) {
            if(isCurrentUserInParticipantsList(events.eventiList[i])) {
                if(filterPayment==-1&&filterCreator==-1&&filterCategory.length==0){
                    cells[events.eventiList[i].id] = <EventListCell event={events.eventiList[i]}></EventListCell>
                    continue
                }
                switch(filterCreator){
                    case 1:{
                        if(events.eventiList[i].creatore.username==accountContext?.aService.getUserName()){
                            flag=true
                        }
                        break
                    }
                    case 0:{
                        if(events.eventiList[i].creatore.username!=accountContext?.aService.getUserName()){
                            flag=true
                        }
                        break
                    }
                }

                switch(filterPayment){
                    case 0:{
                        if(events.eventiList[i].partecipantiList[index].dataPagamento!=null){
                            flag=true
                        }
                        break
                    }
                    case 1:{
                        if(events.eventiList[i].partecipantiList[index].dataPagamento==null){
                            flag=true
                        }
                        break
                    }
                }

                if(filterCategory.length>0){
                    for(j=0;j<filterCategory.length; j++){
                        if(filterCategory[j]==events.eventiList[i].categoria){
                            flag=true
                            break
                        }
                    }
                }

                if(flag==true){
                    cells[events.eventiList[i].id] = <EventListCell event={events.eventiList[i]}></EventListCell>
                }
            }
        }

        return cells
    }

    const cells = createCells(props.events, props.categoryFilters,props.paymentFilter,props.creatorFilter)

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