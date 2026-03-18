// components/me/MeScreen.tsx
import { ScrollView, View } from 'react-native';
import { UserInfoCard, SettingManager } from './index';
import { FamilyManager } from './family/FamilyManager';
import { ViewComponents } from '@/styles';


export default function MeScreen() {
  return (
    <View style={ViewComponents.screen}>
      <ScrollView>
        <UserInfoCard />
        <FamilyManager />
        <SettingManager />
      </ScrollView>
    </View>
  );
}

