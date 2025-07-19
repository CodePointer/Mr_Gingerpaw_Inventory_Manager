import { View, Text, ActivityIndicator } from "react-native";
import { useTranslation } from "react-i18next";
import { Layout, ViewComponents, TextComponents, Colors } from "@/styles";


export function NoFamilyScreen() {
  const { t } = useTranslation(['common']);

  return (
    <View style={[Layout.center, ViewComponents.screen]}>
      <Text style={TextComponents.titleText}>
        {t('common:defaultText.noFamilyText')}
      </Text>
    </View>
  )
}


export function LoadingScreen() {
  return (
    <View style={[Layout.center, ViewComponents.screen]}>
      <ActivityIndicator size="large" color={Colors.primary} />
    </View>
  );
}


export function EmptyScreen() {
  const { t } = useTranslation(['common']);

  return (
    <View style={[Layout.center, ViewComponents.screen]}>
      <Text style={TextComponents.titleText}>
        {t('common:defaultText.emptyDataText')}
      </Text>
    </View>
  );
}