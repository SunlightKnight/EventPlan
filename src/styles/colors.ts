import { Appearance } from "react-native"

const colors = () => {
  const colorScheme = Appearance.getColorScheme()

  if (colorScheme == 'light') {
    return {
      black: "#000000",
      blackOpacity25: '#00000040',
      blackOpacity40: '#00000066',
      white: "#FFFFFF",
      paleGrey: "#F7F7F7",

      lightGrey: "#f0EDED",
      disabledGrey: "#B5B5B5",
      deepRed: "#BD0000",
      red: "#C41F1F",
      deepGreen: "#0DA818",
      lightGreen: "#3FBA48",
      gold: "#FFBF00",
      deepGreenOpacity25: "#0DA81840",

      background: "#F7F4F3",
      primary: "#B9272C",
      primaryDark: "#6f171a",
      secondary: "#B6CEF6",
      secondaryDark: "#8aa5d4",
      mainText: "#4b4e58",
      highlightText: "#4B75A8",
      paymentGreen: "#97ca96",
      creditCard: "#215077"
    }
  } else {
    return {
      background: "#171820",
      primary: "#9D061A",
      primaryDark: "#620410",
      secondary: "#568BC8",
      secondaryDark: "#284F7B",
      mainText: "#DAD2D8",
      highlightText: "#1E3B5C",
      paymentGreen: "#0A7147",
      creditCard: "#19486d"

    }
  }
}

export default colors()