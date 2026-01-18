// components/me/UserInfoCard.tsx
import { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, TextInput } from 'react-native-paper';
import { useUser } from '@/hooks';
import { useTranslation } from 'react-i18next';
import { ViewComponents, Spacing, Layout } from '@/styles';
import { Feather } from '@expo/vector-icons';
import Button from '@/components/common/Button';
import { InputField } from '@/components/common/InputField';
import { IconButton } from 'react-native-paper';
import { SectionInfoCard } from './SectionInfoCard';
import { CustomModal } from '@/components/common/CustomModal';


export function UserInfoCard() {
  const { t } = useTranslation(['me', 'common']);
  const { user } = useUser();
  const [editing, setEditing] = useState(false);

  return (
    <>
      <SectionInfoCard title={t('me:userInfo.title')}>
        <View style={[Layout.row, { gap: Spacing.small }]}>
          <IconButton icon="file-edit" size={24} onPress={() => setEditing(true)} />
          <View style={[Layout.column, { flex: 1 }]}>
            <View>
              <Text variant="titleMedium">
                {user?.username || t('me:userInfo.alert.emptyInfo')}
              </Text>
            </View>
            <View>
              <Text variant="bodyMedium">
                {user?.email || t('me:userInfo.alert.emptyInfo')}
              </Text>
            </View>
          </View>
        </View>
      </SectionInfoCard>

      <UserInfoEditModal
        visible={editing}
        onDismiss={() => setEditing(false)}
      />
    </>
  );
}


interface UserInfoEditModalProps {
  visible: boolean;
  onDismiss: () => void;
}


function UserInfoEditModal({ visible, onDismiss }: UserInfoEditModalProps) {
  const { t } = useTranslation(['me', 'common']);
  const { user, updateUserInfo } = useUser();
  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');

  useEffect(() => {
    if (user) {
      // console.log('Update username & email:', user);
      setUsername(user.username);
      setEmail(user.email);
    }
  }, [user]);

  const handleSave = async () => {
    const ok = await updateUserInfo({ username, email });
    if (ok) {
      onDismiss();
    }
  };

  return (
    <CustomModal
      visible={visible}
      onDismiss={onDismiss}
      title={t('me:userInfo.editTitle')}
      handleConfirm={handleSave}
      handleCancel={onDismiss}
      containerStyle={ViewComponents.modalContainer}
    >
      <TextInput
        label={t('me:userInfo.label.userName')}
        value={username}
        onChangeText={setUsername}
        right={
          <TextInput.Icon icon="close" onPress={() => setUsername('')} />
        }
      />
      <TextInput
        label={t('me:userInfo.label.email')}
        value={email}
        onChangeText={setEmail}
        right={
          <TextInput.Icon icon="close" onPress={() => setEmail('')} />
        }
      />
    </CustomModal>
  )
}
