// components/me/MeScreen.tsx
import { ScrollView } from "react-native";
import { useRouter } from "expo-router";
import {
  UserInfoCard, FamilyManager,
  AccountSettings
} from "./index";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useAuth } from "@/hooks";
import { ViewComponents, Layout } from "@/styles";


export default function MeScreen() {

  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.replace("/(auth)/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  }

  return (
    <ScrollView style={ViewComponents.screen} contentContainerStyle={Layout.column}>
      
      <UserInfoCard />
      
      <FamilyManager />

      <LanguageSwitcher />
      
      <AccountSettings
        onLogout={handleLogout}
      />
    
    </ScrollView>
  );
}

