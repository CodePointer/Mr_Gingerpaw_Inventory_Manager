import { Tabs } from 'expo-router';
import { PaperHeader, PaperTabBar } from '@/components/navigation';


export default function TabsLayout() {
  return (
    <Tabs
      initialRouteName="home"
      tabBar={(props) => <PaperTabBar {...props} />}
      screenOptions={{
        header: (props) => <PaperHeader {...props} />
      }}
    >
      <Tabs.Screen name="home" />
      <Tabs.Screen name="items" />
      <Tabs.Screen name="draft" />
      <Tabs.Screen name="me" />
    </Tabs>
  );
}
