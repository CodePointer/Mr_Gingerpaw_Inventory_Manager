// app/(tabs)/items.tsx
import { View } from "react-native";
import { ItemsScreen } from "@/components/items";
import { Layout, Colors } from "@/styles";


export default function ItemsTab() {
  return (
    <View style={[Layout.container, {backgroundColor: Colors.backgroundLight}]}>
      <ItemsScreen />
    </View>
  );
}
