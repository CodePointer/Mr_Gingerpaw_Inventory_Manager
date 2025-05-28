import { Tabs, Slot } from "expo-router";
import { Feather, Ionicons, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { Colors, Typography } from "@/styles";

export default function TabsLayout() {
  const { t } = useTranslation();

  return (
    <Tabs
      initialRouteName="home"
      screenOptions={{
        headerShown: true,
        headerTitleAlign: 'center',
        headerTitleStyle: {
          ...Typography.title
        },
        tabBarActiveTintColor: Colors.primaryDeep,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarStyle: {
          backgroundColor: 'transparent',
          borderTopWidth: 0,
          height: 60,
        }
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: t('tabs.home'),
          tabBarIcon: ({ color, size }) => (
            <Feather name="home" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="items"
        options={{
          title: t('tabs.items'),
          tabBarIcon: ({ color, size }) => (
            <Feather name="package" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="draft"
        options={{
          title: t('tabs.draft'),
          tabBarIcon: ({ color, size }) => (
            <Feather name="save" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="me"
        options={{
          title: t('tabs.me'),
          tabBarIcon: ({ color, size }) => (
            <Feather name="user" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
