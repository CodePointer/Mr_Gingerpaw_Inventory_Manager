// app/(tabs)/me.tsx
import { View } from "react-native";
import MeScreen from "@/components/me/MeScreen";
import { ViewComponents } from "@/styles";

export default function MeTab() {
  return (
    <View style={[ViewComponents.background]}>
      <MeScreen />
    </View>
  );
}
