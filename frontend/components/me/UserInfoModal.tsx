import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TextInput } from 'react-native-paper';
import { CustomModal } from '@/components/common/CustomModal';
import { UserOut, UserUpdateInfoRequest } from '@/services/types';
import { ViewComponents } from '@/styles';


export interface UserInfoModalProps {
  visible: boolean;
  onDismiss: () => void;
  user: UserOut | null;
  onSave: (payload: UserUpdateInfoRequest) => Promise<boolean | void> | boolean | void;
}


export function UserInfoModal({ visible, onDismiss, user, onSave }: UserInfoModalProps) {
  const { t } = useTranslation(['me', 'common']);
  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');

  useEffect(() => {
    setUsername(user?.username ?? '');
    setEmail(user?.email ?? '');
  }, [user, visible]);

  const handleSave = async () => {
    const ok = await Promise.resolve(onSave({ username, email }));
    if (ok !== false) {
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
        right={<TextInput.Icon icon="close" onPress={() => setUsername('')} />}
      />
      <TextInput
        label={t('me:userInfo.label.email')}
        value={email}
        onChangeText={setEmail}
        right={<TextInput.Icon icon="close" onPress={() => setEmail('')} />}
      />
    </CustomModal>
  );
}
