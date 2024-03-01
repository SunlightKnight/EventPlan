import React from 'react';
import { 
  StyleSheet, 
  View, 
  Image, 
  TouchableOpacity, 
  ViewStyle, 
  StyleProp, 
  TextStyle, 
  ImageStyle, 
  Platform
} from 'react-native';
import DatePicker from 'react-native-date-picker';
import { icon_event, icon_cancel } from '../assets/images';

import colors from '../styles/colors';
import padding from '../styles/padding';
import Label from './Label';
import fontSize from '../styles/fontSize';
import { formatDate } from '../utils/Helper';
import { useTranslation } from 'react-i18next';
import { displayDate, displayDateTime, fullDate } from '../utils/Constants';

type DatePickerFieldProps = {
  outerViewStyle?: ViewStyle
  fieldTitle?: string
  fieldTitleStyle?: StyleProp<TextStyle>
  labelText?: string
  labelStyle?: ViewStyle
  open: boolean
  mode?: "time" | "date" | "datetime"
  selectedDate?: Date
  minDate?: Date
  maxDate?: Date
  viewStyle?: ViewStyle
  iconsStyle?: StyleProp<ImageStyle>
  onConfirm: (event: any) => void
  onCancel: () => void
  onDeletePress: (event: any) => void
  onDatePickerPress: (event: any) => void
}

export default function DateTextField(props: DatePickerFieldProps) {
  const { t } = useTranslation()
  const { 
    outerViewStyle,
    fieldTitle, 
    fieldTitleStyle,
    labelText, 
    labelStyle, 
    open, 
    mode,
    selectedDate, 
    minDate, 
    maxDate, 
    viewStyle, 
    iconsStyle,
    onConfirm, 
    onCancel, 
    onDeletePress,
    onDatePickerPress 
  } = props;

  const formatCurrentDate = (date: Date): string => {
    switch (mode) {
      case "date":
        return formatDate(date.toLocaleDateString(), fullDate, displayDate)
      case "datetime":
        return formatDate(date.toISOString(), fullDate, displayDateTime)
      case "time":
        return "Not implemented yet"
      default:
        return formatDate(date.toLocaleDateString(), fullDate, displayDate)
    }
  }

  return (
    <View style={[{marginHorizontal: padding.full, marginVertical: padding.half}, outerViewStyle]}>
      {fieldTitle ? (
        <Label
          dimension='small'
          style={[{marginLeft: padding.full, marginTop: padding.half}, fieldTitleStyle]}>
          {fieldTitle}
        </Label>
      ) : null}
      <View style={[{
        backgroundColor: colors.lightGrey,
        borderRadius: padding.onehalf, 
        marginTop: padding.quarter,
      }, viewStyle]}>
        <TouchableOpacity activeOpacity={1} onPress={onDatePickerPress} style={styles.containerStyle}>
          <DatePicker
            title={t("create.select_date")}
            confirmText={t("general.confirm")}
            cancelText={t("general.cancel")}
            modal
            mode={mode}
            textColor={Platform.OS === "ios" ? colors.black : undefined}
            open={open}
            date={selectedDate || new Date()}
            onConfirm={onConfirm}
            onCancel={onCancel}
            minimumDate={minDate}
            maximumDate={maxDate}
            timeZoneOffsetInMinutes={60}
            locale={"it-it"}
          />
          <Label dimension='normal' style={{marginLeft: padding.half}}>
            {!selectedDate ? "" : formatCurrentDate(selectedDate)}
          </Label>
          {selectedDate ? (
            <TouchableOpacity activeOpacity={1} onPress={onDeletePress}>
              <Image source={icon_cancel} resizeMode="contain" style={[iconsStyle, {tintColor: selectedDate ? colors.deepRed : undefined}]} />
            </TouchableOpacity>
          ) : (
            <Image source={icon_event} resizeMode="contain" style={[{marginRight: padding.half}, iconsStyle]}/>
          )}
        </TouchableOpacity>
      </View>
      {labelText ? (
        <Label dimension='small' color={colors.primary} style={[styles.labelStyle, labelStyle]}>
          {labelText}
        </Label>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  containerStyle: {
    height: 55, 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center", 
    marginHorizontal: padding.half
  },
  labelStyle: {
    paddingHorizontal: padding.quarter, 
    backgroundColor: colors.white, 
    position: "absolute",
    top: -8,
    left: 10,
    alignSelf: "center"
  }
})