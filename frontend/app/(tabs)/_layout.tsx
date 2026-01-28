import { Tabs } from "expo-router";
import { PaperHeader, PaperTabBar } from "@/components/navigation";


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

// export default function TabsLayout() {
//   const { t } = useTranslation(['common']);

//   return (
//     <Tabs
//       initialRouteName="home"
//       screenOptions={{
//         header: (props) => <PaperHeader {...props} />,
//         tabBar: (props) => <PaperTabBar {...props} />,
//       }}
//     >
//       <Tabs.Screen
//         name="home"
//         options={{
//           title: t('common:tabs.home'),
//           tabBarIcon: ({ color, size }) => (
//             <Feather name="home" color={color} size={size} />
//           ),
//         }}
//       />
//       <Tabs.Screen
//         name="items"
//         options={{
//           title: t('common:tabs.items'),
//           tabBarIcon: ({ color, size }) => (
//             <Feather name="package" color={color} size={size} />
//           ),
//         }}
//       />
//       <Tabs.Screen
//         name="draft"
//         options={{
//           title: t('common:tabs.draft'),
//           tabBarIcon: ({ color, size }) => (
//             <Feather name="save" color={color} size={size} />
//           ),
//         }}
//       />
//       <Tabs.Screen
//         name="me"
//         options={{
//           title: t('common:tabs.me'),
//           tabBarIcon: ({ color, size }) => (
//             <Feather name="user" color={color} size={size} />
//           ),
//         }}
//       />
//     </Tabs>
//   );
// }
