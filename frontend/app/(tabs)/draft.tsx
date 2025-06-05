import { View } from 'react-native';
import { DraftScreen } from "@/components/draft";
import { Layout, ViewComponents } from "@/styles";


export default function DraftTab() {
  return (
    <View style={[Layout.screen, ViewComponents.screen]}>
      <DraftScreen />
    </View>
  );
}

