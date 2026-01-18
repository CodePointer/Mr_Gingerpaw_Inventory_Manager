// app/(tabs)/items.tsx
import { View } from "react-native";
import { ItemsScreen } from "@/components/items";
import { ViewComponents } from "@/styles";


export default function ItemsTab() {
  return (
    <View style={[ViewComponents.background]}>
      <ItemsScreen />
    </View>
  );
}
