// components/me/LogoutButton.tsx
import { View, StyleSheet } from "react-native";
import Button from "@/components/common/Button";
import { useAuth } from "@/hooks/auth/useAuth";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { Colors } from "@/styles";

export function LogoutButton() {
  const { t } = useTranslation();
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      // console.log("Logged out successfully");
      router.replace("/(auth)/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Button onPress={handleLogout} style={styles.button}>
        {t('me.logout.button')}
      </Button>
    </View >
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    alignItems: "center",
  },
  button: {
    backgroundColor: Colors.primaryDeep,
  },
});
