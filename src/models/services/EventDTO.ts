import { PartecipantDTO } from "./PartecipantDTO"
import { UserDTO } from "./UserDTO"

export interface EventDTO {
  id: number,
  nome: string,
  descr: string,
  dataEv: string,
  spesa: number,
  creatore: UserDTO,
  partecipantiList: Array<PartecipantDTO>
  }