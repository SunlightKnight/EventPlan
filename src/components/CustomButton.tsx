import React from 'react';
import {StyleSheet, TouchableOpacity, Text, ViewStyle, TextStyle, TextProps, ViewProps} from 'react-native';

import colors from '../styles/colors';
import Label from './Label';

type CustomButtonProps = ViewProps & TextProps & {
  text: string
  type?: "primary" | "transparent" | "secondary"
  onPress: (event: any) => void
}

export default function CustomButton(props: CustomButtonProps) {
  const { text, type, onPress } = props;

  const getButtonColor = () => {
    switch (type) {
      case "primary":
        return colors.primary
      case "secondary":
        return colors.secondary
      case "transparent":
        return "transparent"
      default:
        return colors.primary 
    }
  }

  const getTextColor = () => {
    switch (type) {
      case "primary":
      case "secondary":
        return colors.white
      case "transparent":
        return colors.black
      default:
        return colors.white
    }
  }
    
  return (
    <TouchableOpacity 
      {...props}
      activeOpacity={0.8}
      onPress={onPress} 
      style={[styles.button, 
        {
          backgroundColor: getButtonColor(),
          height: 50,
          borderWidth: type == "transparent" ? 1 : undefined,
          shadowColor: "transparent"
        },
        props.style]}>
          <Label color={getTextColor()} style={props.style}>
            {text}
          </Label>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    marginVertical: 10,
    marginHorizontal: 20,  
    borderRadius: 5, 
    justifyContent: "center",
    alignItems: "center",
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 8
  },
  buttonText: {
    color: colors.white
  }
});