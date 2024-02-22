import CustomButton from "../../../components/CustomButton"
import Label from "../../../components/Label"
import { HomeFlowCoordinatorProps } from "../HomeFlowCoordinator"

type EventDetailProps = {
  parentProps: HomeFlowCoordinatorProps
  nav: any
}

function EventDetail(props: EventDetailProps) {
  return (
    <CustomButton text={"Go to payment"} onPress={() => props.nav.eventPayment("15.00")}/>
  )
}

export default EventDetail