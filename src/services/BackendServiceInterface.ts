import { CreateEventRequestDTO } from "../models/services/CreateEventRequestDTO";
import LoginRequestDTO from "../models/services/LoginRequestDTO";
import { UserDTO } from "../models/services/UserDTO";
import { AuthToken, IJSON } from "./BackendServiceProvider";

export default interface BackendServiceInterface {
  login: (payload: LoginRequestDTO) => Promise<AuthToken>
  getUsersList: () => Promise<Array<UserDTO>>
  payEvent: (pID: number) => Promise<IJSON>
  createEvent: (payload: CreateEventRequestDTO) => Promise<IJSON>
}