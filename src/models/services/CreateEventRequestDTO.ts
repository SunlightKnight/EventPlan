import { UserDTO } from "./UserDTO"

export class CreateEventRequestDTO {
  
  id?: number;
  nome!: string;
  descr?: string;
  dataEv!: string;
  spesa!: number;
  creatore!: UserDTO;
  categoria!: string;
  partecipantiList!: Array<UserDTO>;
}