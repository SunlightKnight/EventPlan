import LoginRequestDTO from "../models/services/LoginRequestDTO";
import { IJSON } from "./BackendServiceProvider";

export default interface BackendServiceInterface {
  login: (payload: LoginRequestDTO) => Promise<IJSON>
}