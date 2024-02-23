import moment from "moment"
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

export const formatDate = (
  date: string,
  currentFormat: string,
  newFormat: string,
): string => {
  moment.locale('it');
  var correctDate = moment(date, currentFormat).subtract(1, "hours").format(newFormat);
  return correctDate
};

export const formatCardExpiry = (text: string) => {
  if (!text.includes("/") && text.length == 2) {
    return text
  }

  let correctExpiry = text.replace(
    /^([1-9]\/|[2-9])$/g, '0$1/' // 3 > 03/
  ).replace(
    /^(0[1-9]|1[0-2])$/g, '$1/' // 11 > 11/
  ).replace(
    /^([0-1])([3-9])$/g, '0$1/$2' // 13 > 01/3
  ).replace(
    /^(0?[1-9]|1[0-2])([0-9]{2})$/g, '$1/$2' // 141 > 01/41
  ).replace(
    /^([0]+)\/|[0]+$/g, '0' // 0/ > 0 and 00 > 0
  ).replace(
    /[^\d\/]|^[\/]*$/g, '' // To allow only digits and `/`
  ).replace(
    /\/\//g, '/' // Prevent entering more than 1 `/`
  );
  return correctExpiry
}
