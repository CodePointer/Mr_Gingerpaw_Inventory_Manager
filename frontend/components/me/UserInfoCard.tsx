// components/me/UserInfoCard.tsx
import { View } from 'react-native';
import { Text, IconButton } from 'react-native-paper';
import { useUser } from '@/hooks';
import { useTranslation } from 'react-i18next';
import { Spacing, Layout } from '@/styles';
import { SectionInfoCard } from './SectionInfoCard';
import { useModal } from '@/hooks/modal/useModal';


export function UserInfoCard() {
  const { t } = useTranslation(['me', 'common']);
  const { user, updateUserInfo } = useUser();
  const { open } = useModal();

  const openUserInfoModal = () => {
    open('UserInfo', {
      user,
      onSave: ({ username, email }) => updateUserInfo({ username, email }),
    });
  };

  return (
    <SectionInfoCard title={t('me:userInfo.title')}>
      <View style={[Layout.row, { gap: Spacing.small }]}>
        <IconButton icon="file-edit" size={24} onPress={openUserInfoModal} />
        <View style={[Layout.column, { flex: 1 }]}>
          <View>
            <Text variant="titleMedium">{user?.username || t('me:userInfo.alert.emptyInfo')}</Text>
          </View>
          <View>
            <Text variant="bodyMedium">{user?.email || t('me:userInfo.alert.emptyInfo')}</Text>
          </View>
        </View>
      </View>
    </SectionInfoCard>
  );
}
