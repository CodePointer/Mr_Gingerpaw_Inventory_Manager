import { View } from "react-native";
import { HomeScreen } from "@/components/home";
import { Layout, Colors } from "@/styles";

export default function HomeTab() {
  return (
    <View style={Layout.screen}>
      <HomeScreen />
    </View>
  );
}