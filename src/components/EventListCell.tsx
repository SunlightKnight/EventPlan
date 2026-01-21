import { EventDTO } from "../models/services/EventDTO";

type EventListCellProps = {
  event: EventDTO
  currentUsername: string
  onCellPress: () => void
};

function EventListCell(props: EventListCellProps) {
  
}

export default EventListCell