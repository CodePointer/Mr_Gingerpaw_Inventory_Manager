// app/(tabs)/me.tsx
import { View } from "react-native";
import MeScreen from "@/components/me/MeScreen";
import { Layout, ViewComponents } from "@/styles";

export default function MeTab() {
  return (
    <View style={[Layout.screen, ViewComponents.screen]}>
      <MeScreen />
    </View>
  );
}
