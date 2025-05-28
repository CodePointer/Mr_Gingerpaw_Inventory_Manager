import { View, StyleSheet } from "react-native";
import { Colors } from "@/styles";

export default function TabBarBackground() {
    return <View style={styles.background} />;
}

const styles = StyleSheet.create({
    background: {
        backgroundColor: Colors.backgroundLight,
        borderTopColor: Colors.borderSoft,
        borderTopWidth: 1,
        height: 60,
        width: "100%",
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: -1,
    },
});
