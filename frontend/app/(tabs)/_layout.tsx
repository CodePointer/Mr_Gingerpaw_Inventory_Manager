import { Tabs, Slot } from "expo-router";
import { Feather, Ionicons, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { Colors, Typography } from "@/styles";

export default function TabsLayout() {
  const { t } = useTranslation(['common']);

  return (
    <Tabs
      initialRouteName="home"
      screenOptions={{
        headerShown: true,
        headerTitleAlign: 'center',
        headerTitleStyle: {
          ...Typography.title,
        },
        headerStyle: {
          backgroundColor: Colors.backgroundLight,
        },
        tabBarActiveTintColor: Colors.primaryDeep,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarStyle: {
          backgroundColor: Colors.backgroundLight,
          borderTopWidth: 0,
          height: 60,
        }
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: t('common:tabs.home'),
          tabBarIcon: ({ color, size }) => (
            <Feather name="home" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="items"
        options={{
          title: t('common:tabs.items'),
          tabBarIcon: ({ color, size }) => (
            <Feather name="package" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="draft"
        options={{
          title: t('common:tabs.draft'),
          tabBarIcon: ({ color, size }) => (
            <Feather name="save" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="me"
        options={{
          title: t('common:tabs.me'),
          tabBarIcon: ({ color, size }) => (
            <Feather name="user" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
