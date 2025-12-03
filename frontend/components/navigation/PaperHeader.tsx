import { Appbar, useTheme } from 'react-native-paper';
import type { BottomTabHeaderProps } from '@react-navigation/bottom-tabs';
import { TAB_ICONS } from './Config';


export function PaperHeader(props: BottomTabHeaderProps) {
  const { options, navigation, route } = props;
  const theme = useTheme();

  const title =
    options.headerTitle?.toString() ??
    (typeof options.title === 'string' ? options.title : route.name);
  
  const canGoBack = navigation.canGoBack();
  const isRootTab = TAB_ICONS.hasOwnProperty(route.name);
  const showGoBack = canGoBack && !isRootTab;

  return (
    <Appbar.Header
      elevated
      mode="center-aligned"
      style={{ backgroundColor: theme.colors.background }}
    >
      {showGoBack && <Appbar.BackAction onPress={navigation.goBack} />}

      <Appbar.Content title={title} />

      {/* TODO */}

    </Appbar.Header>
  );
}