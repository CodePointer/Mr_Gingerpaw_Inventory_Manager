// app/(tabs)/items.tsx
import { View } from "react-native";
import { ItemsScreen } from "@/components/items";
import { Layout, ViewComponents } from "@/styles";


export default function ItemsTab() {
  return (
    <View style={[Layout.screen, ViewComponents.screen]}>
      <ItemsScreen />
    </View>
  );
}
