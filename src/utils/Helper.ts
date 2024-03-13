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

/**
 * Formats date string.
 * 
 * @param date - Current date string.
 * @param currentFormat - Current date format.
 * @param newFormat - Desired date format.
 * @returns Formatted date string or, in case date or format are not valid, "Invalid date".
 */
export const formatDate = (
  date: string,
  currentFormat: string,
  newFormat: string,
): string => {
  moment.locale('it');
  var correctDate = moment(date, currentFormat).format(newFormat);
  return correctDate
};

/**
 * Automatically formats the credit card expiry date (MM/AA).
 * 
 * @param text - Credit card expiry date string.
 * @returns Formatted card expiry date string.
 */ 
export const formatCardExpiry = (text: string) => {
  let correctExpiry = text.replace(
    /[^0-9]/g, '' // To allow only numbers
  ).replace(
      /^([2-9])$/g, '0$1' // To handle 3 > 03
  ).replace(
      /^(1{1})([3-9]{1})$/g, '0$1/$2' // 13 > 01/3
  ).replace(
      /^0{1,}/g, '0' // To handle 00 > 0
  ).replace(
      /^([0-1]{1}[0-9]{1})([0-9]{1,2}).*/g, '$1/$2' // To handle 113 > 11/3
  );
  return correctExpiry
}

/**
 * Formats currency values.
 * 
 * @param amount - Amount string.
 * @param doNotShowSymbol - Hide currency symbol (€, $...).
 * @param putEurInFront - Removes currency symbol after the value (which is the default formatting) and puts it in front.
 * @param numberOfDecimals - Number of decimal values.
 * @returns Formatted currency string.
 */
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

