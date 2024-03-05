import { TouchableOpacity } from "react-native";
import Label from "./Label";
import colors from "../styles/colors";
import padding from "../styles/padding";
import { View } from "react-native";

type NameListCellProps = {
  name: string;
  surname: string;

  onCellPress: () => void
};

function NameListCell(props: NameListCellProps) {
    return (
        <TouchableOpacity
            onPress={props.onCellPress}
            style={{
                backgroundColor: colors.white,
                borderWidth: 1,
                borderColor: colors.black,
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