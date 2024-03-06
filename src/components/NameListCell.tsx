import { TouchableOpacity } from "react-native";
import Label from "./Label";
import colors from "../styles/colors";
import padding from "../styles/padding";
import { View } from "react-native";
import { useState } from "react";

type NameListCellProps = {
  name: string;
  surname: string;

  onCellPress: () => void
};

function NameListCell(props: NameListCellProps) {
    const [isChecked, setIsChecked] = useState(false)
    return (
        <TouchableOpacity
            onPress={() => {
                props.onCellPress()
                setIsChecked(!isChecked)
            }}
            style={{
                backgroundColor: isChecked ? colors.deepGreenOpacity25 : colors.white,
                borderWidth: 1,
                borderColor: isChecked ? colors.deepGreen : colors.black,
                marginVertical: 10,
            }}
            >
            <View
                style={{
                    flexDirection: "row",
                    padding: 10,
                }}
            >
                <Label
                    style={{
                        paddingRight: 5,
                    }}
                    >{props.name}</Label>
                <Label>{props.surname}</Label>
            </View>
        </TouchableOpacity>
    )
}

export default NameListCell