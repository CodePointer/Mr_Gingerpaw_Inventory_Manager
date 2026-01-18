// components/me/MeScreen.tsx
import { ScrollView, View } from "react-native";
import { useRouter } from "expo-router";
import {
  UserInfoCard, FamilyManager,
  AccountSettings,
  SettingManager
} from "./index";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useAuth } from "@/hooks";
import { ViewComponents, Layout } from "@/styles";
import { SectionInfoCard } from "@/components/me/SectionInfoCard";
import { FamilyCardList } from "./family/FamilyCardList";


export default function MeScreen() {

  const { logout } = useAuth();
  const router = useRouter();

  const handleUserInfoPress = () => {
    console.log("User Info Pressed");
  }

  const handleLogout = async () => {
    try {
      await logout();
      router.replace("/(auth)/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  }

  return (
    <View style={ViewComponents.screen}>
      <ScrollView>
          <UserInfoCard />
        
          <FamilyManager />

          <SettingManager />

          {/* <SectionInfoCard title="Settings">
            <LanguageSwitcher />
            <AccountSettings
              onLogout={handleLogout}
            />
          </SectionInfoCard> */}
      </ScrollView>
    </View>
  );
}

