import { View } from "react-native";
import { HomeScreen } from "@/components/home";
import { ViewComponents } from "@/styles";

export default function HomeTab() {
  return (
    <View style={ViewComponents.background}>
      <HomeScreen />
    </View>
  );
}