import { UserDTO } from "./UserDTO"

export interface EventDTO {
  adminId: number
  eventName: string
  eventDate: string
  eventDescription: string
  eventAmount: string
  participants: Array<UserDTO>
}