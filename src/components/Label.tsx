import React from 'react';
import {Text, TextProps, TextStyle} from 'react-native';

import colors from '../styles/colors';
import fontSize, {getFontSize} from "../styles/fontSize"

type CustomLabelProps = TextProps & TextStyle & {
  children: any
  dimension?: "verySmall" | "small" | "normal" | "big" | "veryBig"
  weight?: "normal" | "semibold" | "bold"
  color?: string
}

export default function Label(props: CustomLabelProps) {
  const { children, dimension, weight, color } = props;

  const getWeight = (weight?: string) => {
    switch (weight) {
      case "normal":
        return weight
      case "semibold":
        return "600"
      case "bold":
        return weight
      default:
        return "normal"
    }
  }

  return (
    <Text 
      {...props}
      style={[{
        fontSize: getFontSize(dimension),
        color: color ?? colors.black,
        fontWeight: getWeight(weight)
        }, props.style]}>
      {children}
    </Text>
  )
}