import { Dispatch, SetStateAction } from "react";

// AppProvider MUST implement all the functions defined inside its interface.
export default interface AppInterface {
  handleLoader: Dispatch<SetStateAction<boolean>>
}