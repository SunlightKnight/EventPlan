import { UserDTO } from "./UserDTO"

export interface CreateEventRequestDTO {
    id?: number,
    nome: string,
    descr?: string,
    dataEv: Date,
    spesa: number,
    creatore: UserDTO,
    partecipantiList: Array<UserDTO>
}