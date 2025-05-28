// app/(tabs)/me.tsx
import { View } from "react-native";
import MeScreen from "@/components/me/MeScreen";
import { Layout } from "@/styles";

export default function MeTab() {
  return (
    <View style={Layout.container}>
      <MeScreen />
    </View>
  );
}
