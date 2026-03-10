import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TextInput } from 'react-native-paper';
import { CustomModal } from '@/components/common/CustomModal';
import { ViewComponents } from '@/styles';


export interface ChangeSecurityModalProps {
  visible: boolean;
  onDismiss: () => void;
  changeType: 'password' | 'securityQuestion';
  onChangePassword: (oldPassword: string, newPassword: string, confirmPassword: string) => Promise<void> | void;
  onChangeSecurityQuestion: (password: string, question: string, answer: string) => Promise<void> | void;
}


export function ChangeSecurityModal({
  visible,
  onDismiss,
  changeType,
  onChangePassword,
  onChangeSecurityQuestion,
}: ChangeSecurityModalProps) {
  const { t } = useTranslation('me');
  const [oldPassword, setOldPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [securityQuestion, setSecurityQuestion] = useState<string>('');
  const [securityAnswer, setSecurityAnswer] = useState<string>('');

  useEffect(() => {
    if (visible) return;
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setSecurityQuestion('');
    setSecurityAnswer('');
  }, [visible]);

  const getModalTitle = () => {
    if (changeType === 'password') return t('me:account.prompt.changePassword');
    return t('me:account.prompt.changeSecQuestion');
  };

  const handleConfirm = async () => {
    if (changeType === 'password') {
      await Promise.resolve(onChangePassword(oldPassword, newPassword, confirmPassword));
    } else {
      await Promise.resolve(onChangeSecurityQuestion(oldPassword, securityQuestion, securityAnswer));
    }
    onDismiss();
  };

  return (
    <CustomModal
      visible={visible}
      onDismiss={onDismiss}
      title={getModalTitle()}
      handleConfirm={handleConfirm}
      handleCancel={onDismiss}
      containerStyle={ViewComponents.modalContainer}
    >
      <TextInput
        label={t('me:account.label.oldPassword')}
        value={oldPassword}
        onChangeText={setOldPassword}
        secureTextEntry
        mode="outlined"
        right={<TextInput.Icon icon="close" onPress={() => setOldPassword('')} />}
      />

      {changeType === 'password' ? (
        <>
          <TextInput
            label={t('me:account.label.newPassword')}
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
            mode="outlined"
            right={<TextInput.Icon icon="close" onPress={() => setNewPassword('')} />}
          />
          <TextInput
            label={t('me:account.label.confirmPassword')}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            mode="outlined"
            right={<TextInput.Icon icon="close" onPress={() => setConfirmPassword('')} />}
          />
        </>
      ) : (
        <>
          <TextInput
            label={t('me:account.label.securityQuestion')}
            value={securityQuestion}
            onChangeText={setSecurityQuestion}
            mode="outlined"
            right={<TextInput.Icon icon="close" onPress={() => setSecurityQuestion('')} />}
          />
          <TextInput
            label={t('me:account.label.securityAnswer')}
            value={securityAnswer}
            onChangeText={setSecurityAnswer}
            mode="outlined"
            right={<TextInput.Icon icon="close" onPress={() => setSecurityAnswer('')} />}
          />
        </>
      )}
    </CustomModal>
  );
}
