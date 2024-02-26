import React from 'react';
import { ImageSourcePropType, TouchableOpacity, Image } from 'react-native';
import colors from '../styles/colors';

type FloatingButtonProps = {
  buttonIcon: ImageSourcePropType
  buttonIconColor?: string
  buttonColor?: string
  width?: number,
  height?: number,
  radius?: number,
  topMargin?: number
  rightMargin?: number
  bottomMargin?: number
  leftMargin?: number
  onPress?: (event: any) => void
}

export default function FloatingButton(props: FloatingButtonProps) {
  const { 
    buttonIcon, 
    buttonIconColor,
    buttonColor, 
    width, 
    height, 
    radius, 
    topMargin, 
    rightMargin, 
    bottomMargin, 
    leftMargin, 
    onPress 
  } = props;

  return (
    <TouchableOpacity 
      onPress={onPress} 
      style={{
        position: "absolute",
        backgroundColor: buttonColor ?? colors.secondary, 
        borderRadius: radius ?? 0, 
        width: width ?? 30,
        height: height ?? 30,
        top: topMargin ?? undefined,
        right: rightMargin ?? undefined,
        bottom: bottomMargin ?? undefined,
        left: leftMargin ?? undefined,
        justifyContent: "center",
        alignItems: "center"
      }}>
      <Image source={buttonIcon} resizeMode="contain" style={{width: 30, height: 30, tintColor: buttonIconColor}} />
    </TouchableOpacity>
  )
}