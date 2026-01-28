import { Appbar, useTheme } from 'react-native-paper';
import type { BottomTabHeaderProps } from '@react-navigation/bottom-tabs';
import { TAB_ICONS } from './Config';
import { useAppbar } from '@/hooks';


export interface PaperHeaderProps extends BottomTabHeaderProps {}


export function PaperHeader(props: PaperHeaderProps) {
  const { options, navigation, route } = props;
  const theme = useTheme();
  const { getPageActions } = useAppbar();

  const title =
    options.headerTitle?.toString() ??
    (typeof options.title === 'string' ? options.title : route.name);
  
  const canGoBack = navigation.canGoBack();
  const isRootTab = TAB_ICONS.hasOwnProperty(route.name);
  const showGoBack = canGoBack && !isRootTab;

  // 根据当前页面获取 actions
  const actions = getPageActions(route.name);

  return (
    <Appbar.Header
      elevated
      mode="center-aligned"
      style={{ backgroundColor: theme.colors.background }}
    >
      {showGoBack && <Appbar.BackAction onPress={navigation.goBack} />}

      <Appbar.Content title={title} />

      {actions.map((action, index) => (
        <Appbar.Action
          key={index}
          icon={action.icon}
          onPress={action.onPress}
        />
      ))}

    </Appbar.Header>
  );
}