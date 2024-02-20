import { useState } from "react";
import { Image, ImageStyle, StyleProp, TextInput, TextStyle, View } from "react-native"
import { ImageSourcePropType, TextInputProps, TextProps, ViewProps } from "react-native";
import padding from "../styles/padding";
import Label from "./Label";
import colors from "../styles/colors";
import styles from "../styles/styles";

type TextFieldProps = TextInputProps & {
  label?: string
  labelStyle?: StyleProp<TextStyle>
  icon?: ImageSourcePropType
  iconStyle?: ImageStyle
  textStyle?: TextStyle
}

function TextField(props: TextFieldProps) {
  const [isSelected, setIsSelected] = useState(false)
  
  return (
    <View style={[{marginHorizontal: padding.full}, props.style]}>
      {props.label ? (
        <Label
          color={isSelected ? colors.primary : colors.black}
          dimension='small'
          style={[{marginTop: padding.half, marginBottom: padding.quarter}, props.labelStyle]}>
          {props.label}
        </Label>
      ) : null}
      <View 
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: (props.editable !== undefined && props.editable == false) ? colors.disabledGrey : colors.lightGrey,
          borderRadius: padding.onehalf,
          borderWidth: isSelected ? 1.2 : 0,
          borderColor: isSelected ? colors.primary : "transparent",
          height: 55
        }}>
        <TextInput
          {...props}
          style={[
            styles.textInputText,
            {
              color: (props.editable !== undefined && props.editable == false) ? colors.lightGrey : colors.black,
            },
            props.textStyle,
          ]}
          onFocus={() => setIsSelected(true)}
          onBlur={() => setIsSelected(false)}>
            {props.children}
        </TextInput>
        {props.icon ? (
          <Image 
            source={props.icon} 
            resizeMode="contain" 
            style={[{width: 30, height: 30, marginRight: padding.half, opacity: isSelected ? 0.8 : 0.3, tintColor: isSelected ? colors.primary : undefined}, props.iconStyle]} />
        ) : null}
      </View>
    </View>
  )
}

export default TextField