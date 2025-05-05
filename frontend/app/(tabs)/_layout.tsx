import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/styles/colors';

export default function TabLayout() {
  return (
    <Tabs
      initialRouteName="items"
      screenOptions={{
        tabBarStyle: {
          backgroundColor: Colors.backgroundLight,
          borderTopColor: Colors.borderSoft,
        },
        tabBarActiveTintColor: Colors.primaryDeep,
        tabBarInactiveTintColor: Colors.textMuted,
        // headerShown: false,
      }}
    >
      <Tabs.Screen
        name="items"
        options={{
          title: '物品',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="cube-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="entry"
        options={{
          title: '录入',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="add-circle-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="reminders"
        options={{
          title: '提醒',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="alarm-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="me"
        options={{
          title: '我的',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
