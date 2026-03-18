// app/(tabs)/draft.tsx
import { View } from 'react-native';
import { DraftScreen } from "@/components/draft";
import { ViewComponents } from "@/styles";


export default function DraftTab() {
  return (
    <View style={[ViewComponents.background]}>
      <DraftScreen />
    </View>
  );
}

