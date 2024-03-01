import moment from "moment"
import 'moment/locale/en-gb';
import 'moment/locale/de';
import 'moment/locale/fr';
import 'moment/locale/it';
import 'moment/locale/pt';
import 'moment/locale/es';
import 'intl';
import 'intl/locale-data/jsonp/en';
import 'intl/locale-data/jsonp/it';
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
  var correctDate = moment(date, currentFormat).format(newFormat);
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

export const formattedCurrency = (
  amount: string,
  doNotShowSymbol?: boolean,
  putEurInFront?: boolean,
  numberOfDecimals?: number
): string => {
  if (amount && amount !== undefined) {
    var correctCurrency: string = '';
    amount += '';

    if (numberOfDecimals === 0) {
      correctCurrency = new Intl.NumberFormat('it-IT', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(parseFloat(amount));
    } else {
      correctCurrency = new Intl.NumberFormat('it-IT', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: numberOfDecimals ? numberOfDecimals : 2,
        maximumFractionDigits: numberOfDecimals ? numberOfDecimals : 2
      }).format(parseFloat(amount));
    }

    var currencyString = correctCurrency.toString();
    if (doNotShowSymbol) {
      return currencyString.substring(0, currencyString.length - 2);
    } else if (putEurInFront) {
      return (
        currencyString.substring(
          currencyString.length - 1,
          currencyString.length,
        ) +
        ' ' +
        currencyString.substring(0, currencyString.length - 2)
      );
    } else {
      return currencyString;
    }
  } else {
    return '';
  }
};

