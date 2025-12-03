import { BottomNavigation, Icon, useTheme } from 'react-native-paper';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useTranslation } from 'react-i18next';
import { TabKey, TAB_ICONS } from './Config';


// type TabKey = 'home' | 'items' | 'draft' | 'me';
// const TAB_ICONS: Record<TabKey, string> = {
//   home: 'home',
//   items: 'package-variant',
//   draft: 'content-save',
//   me: 'account',
// };


export function PaperTabBar(props: BottomTabBarProps) {
  const { state, navigation } = props;
  const theme = useTheme();
  const { t } = useTranslation(['common']);

  // const routes = state.routes;

  return (
    <BottomNavigation.Bar

      navigationState={{ 
        index: state.index, 
        routes: state.routes
      }}

      onTabPress={({ route, preventDefault }) => {
        const routeIndex = state.routes.findIndex(r => r.key === route.key);
        const isFocused = state.index === routeIndex;

        const event = navigation.emit({
          type: 'tabPress',
          target: route.key,
          canPreventDefault: true,
        });
        if (isFocused || event.defaultPrevented) {
          preventDefault();
          return;
        }
        navigation.navigate(route.name as TabKey);
      }}

      renderIcon={({ route, color }) => {
        const iconName = TAB_ICONS[route.name as TabKey];
        // console.log('Rendering icon for route:', route.name, 'with icon:', iconName);
        if (!iconName) return null;
        return <Icon source={iconName} size={24} color={color} />;
        // return <Feather name={iconName as any} size={24} color={color} />;
      }}

      getLabelText={({ route }) => {
        return t(`common:tabs.${route.name}`);
      }}

      style={{ backgroundColor: theme.colors.background }}
    />
  );
}