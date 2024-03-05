import { useState } from "react"
import CurrencyInput from "react-native-currency-input";
import colors from "../styles/colors";
import padding from "../styles/padding";
import { TextStyle, View } from "react-native";
import Label from "./Label";
import { getFontSize } from "../styles/fontSize";

type CurrencyTextFieldProps = {
  value: number | null
  onChangeValue: (value: number | null) => void
  label?: string
  labelStyle?: TextStyle
}

function CurrencyTextField(props: CurrencyTextFieldProps) {
  const [isSelected, setIsSelected] = useState(false)

  return (
    <View style={{marginHorizontal: padding.full}}>
      {props.label ? (
        <Label
          color={isSelected ? colors.primary : colors.black}
          dimension='small'
          style={[{marginTop: padding.half, marginBottom: padding.quarter}, props.labelStyle]}>
          {props.label}
        </Label>
      ) : null}
      <View style={{
        height: 55, 
        justifyContent: "center", 
        backgroundColor: colors.lightGrey, 
        borderRadius: padding.onehalf, 
        paddingHorizontal: padding.full,
        borderWidth: isSelected ? 1 : 0,
        borderColor: isSelected ? colors.primary : "transparent"
        }}>
        <CurrencyInput
          value={props.value}
          onChangeValue={props.onChangeValue}
          prefix="€ "
          delimiter="."
          separator=","
          precision={2}
          minValue={0}
          onChangeText={(formattedValue) => { 
            console.log(formattedValue); // € 2.310,46
          }}
          onBlur={() => { setIsSelected(false) }}
          onFocus={() => { setIsSelected(true) }}
          style={{
            backgroundColor: colors.lightGrey, 
            height: 35, 
            fontSize: getFontSize("normal")}}
        />
      </View>
    </View>
  );
}

export default CurrencyTextField