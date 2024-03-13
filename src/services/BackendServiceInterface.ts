import { CreateEventRequestDTO } from "../models/services/CreateEventRequestDTO";
import { EventsListResponseDTO } from "../models/services/EventsListResponseDTO";
import LoginRequestDTO from "../models/services/LoginRequestDTO";
import { UserDTO } from "../models/services/UserDTO";
import { AuthToken, IJSON } from "./BackendServiceProvider";

// BackendServiceProvider MUST implement all the functions defined inside its interface.
export default interface BackendServiceInterface {
  login: (payload: LoginRequestDTO) => Promise<AuthToken>
  getUsersList: () => Promise<Array<UserDTO>>
  payEvent: (pID: number) => Promise<IJSON>
  createEvent: (payload: CreateEventRequestDTO) => Promise<IJSON>
  getEventList: () => Promise<EventsListResponseDTO>
}