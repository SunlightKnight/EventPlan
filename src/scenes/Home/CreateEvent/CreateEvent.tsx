import { useTranslation } from "react-i18next"
import Label from "../../../components/Label"

type CreateEventProps = {

}

function CreateEvent(props: CreateEventProps) {
  const { t } = useTranslation()
  
  return (
    <Label>CREATE EVENT</Label>
  )
}

export default CreateEvent