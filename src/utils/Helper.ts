import { Platform, StatusBar } from "react-native"
import DeviceInfo from "react-native-device-info"

export const getTopInset = () => {
  if (Platform.OS === "android") {
    return StatusBar.currentHeight ?? 0
  } else if (Platform.OS === "ios") {
    return (DeviceInfo.hasNotch() || DeviceInfo.hasDynamicIsland()) ? 30 : 0
  } else {
    return 0
  }
}

export const formatSubtitle = (text: string) => {
  return "/ " + text + " /"
}