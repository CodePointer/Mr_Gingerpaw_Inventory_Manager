import { View } from 'react-native';
import { Text, ActivityIndicator } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { Layout, ViewComponents, selectedTheme } from '@/styles';


export function NoFamilyScreen() {
  const { t } = useTranslation(['common']);

  return (
    <View style={[ViewComponents.screen]}>
      <View style={[Layout.center]}>
        <Text variant="headlineLarge">
          {t('common:defaultText.noFamilyText')}
        </Text>
      </View>
    </View>
  )
}


export function LoadingScreen() {
  return (
    <View style={[Layout.center, ViewComponents.screen]}>
      <View style={[Layout.center]}>
        <ActivityIndicator 
          animating={true} 
          color={selectedTheme.colors.primary}
          size="large"
        />
      </View>
    </View>
  );
}


export function EmptyScreen() {
  const { t } = useTranslation(['common']);

  return (
    <View style={[ViewComponents.screen]}>
      <View style={[Layout.center]}>
        <Text variant="headlineLarge">
          {t('common:defaultText.emptyDataText')}
        </Text>
      </View>
    </View>
  );
}