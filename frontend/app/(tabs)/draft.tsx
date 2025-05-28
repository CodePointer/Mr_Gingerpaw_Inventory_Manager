import { View } from 'react-native';
import { ItemsProvider, DraftProvider } from '@/hooks';
import { DraftScreen } from "@/components/draft";
import { Layout, Colors } from "@/styles";


export default function DraftTab() {
  return (
    <View style={[Layout.container, {backgroundColor: Colors.backgroundLight}]}>
      <DraftScreen />
    </View>
  );
}

