import { TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons, FontAwesome, MaterialIcons } from "@expo/vector-icons"
import { Colors } from "@/styles/colors"
import React from "react";


interface IconSymbolProps {
    iconName: "edit" | "delete" | "add" | "check"
    onPress: () => void;
    size?: number;
    color?: string;
    style?: object;
}


const ICON_MAP = {
    edit: <MaterialIcons name="edit" size={24} color={Colors.textDark} />,
    delete: <FontAwesome name="trash" size={24} color={Colors.primaryDeep} />,
    add: <Ionicons name="add-circle" size={24} color={Colors.primary} />,
    check: <Ionicons name="checkmark-circle" size={24} color={Colors.primary} />,
};


export default function IconSymbol({
    iconName,
    onPress,
    size = 24,
    color = Colors.textDark,
    style = {},
}: IconSymbolProps) {
    return (
        <TouchableOpacity onPress={onPress} style={[styles.iconContainer, style]}>
            {React.cloneElement(ICON_MAP[iconName], { size, color })}
        </TouchableOpacity>
    );
}


const styles = StyleSheet.create({
    iconContainer: {
        padding: 8,
        borderRadius: 8,
        backgroundColor: Colors.backgroundCard,
        margin: 2,
    },
});