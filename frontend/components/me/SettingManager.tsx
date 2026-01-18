// components/me/SettingManager.tsx

import { useRouter } from 'expo-router';
import { useAuth, useMembership, useUser } from '@/hooks';
import { SectionInfoCard } from './SectionInfoCard';
import { useTranslation } from 'react-i18next';
import { ButtonGroup } from '../common/ButtonGroup';
import { Layout, Spacing, ViewComponents } from '@/styles';
import { LanguageSwitchModal } from '../common/LanguageSwitchModal';
import { useEffect, useState } from 'react';
import { TextInput, Button } from 'react-native-paper';
import { CustomModal } from '../common/CustomModal';
import * as Clipboard from 'expo-clipboard';


export function SettingManager() {
  const { logout } = useAuth();
  const router = useRouter();
  const { t } = useTranslation();
 const { updatePassword, updateSecurityQuestion } = useUser();

  const [languageModalVisible, setLanguageModalVisible] = useState(false);

  const { createInviteToken, joinFamilyWithToken } = useMembership();
  const [invitationModalVisible, setInvitationModalVisible] = useState(false);
  const [tokenRole, setTokenRole] = useState<'adult' | 'child'>('adult');
  const [generatedToken, setGeneratedToken] = useState<string>('');

  const [changeSecModalVisible, setChangeSecModalVisible] = useState<boolean>(false);
  const [changeType, setChangeType] = useState<'password' | 'securityQuestion'>('password');

  const handleLanguageSettingPress = () => {
    setLanguageModalVisible(true);
  };
  const handleFamilyInvitationPress = () => {
    setInvitationModalVisible(true);
  };
  const handleFamilyInvitationClose = () => {
    setInvitationModalVisible(false);
    setGeneratedToken('');
  };
  const handleChangePassword = () => {
    setChangeType('password');
    setChangeSecModalVisible(true);
  };
  const handleChangeSecurityQuestion = () => {
    setChangeType('securityQuestion');
    setChangeSecModalVisible(true);
  };
  const handleChangeSecurityClose = () => {
    setChangeSecModalVisible(false);
  };

  const handleInvite = async () => {
    const token = await createInviteToken(tokenRole);
    if (token) {
      setGeneratedToken(token);
      // Alert.alert('邀请码', token);
    } else {
      // Alert.alert('生成失败');
      return;
    }
  };

  const handleJoin = async () => {
    const ok = await joinFamilyWithToken(generatedToken);
    // Alert.alert(ok ? '加入成功' : '加入失败');
    setGeneratedToken('');
  };

  const handleUpdatePassword = async (oldPassword: string, newPassword: string, confirmPassword: string) => {
    setChangeSecModalVisible(false);
    if (newPassword !== confirmPassword) {
      console.log('New password and confirm password do not match.');
      return;
    }
    const ok = await updatePassword({ oldPassword, newPassword });
  };
  const handleUpdateSecurityQuestion = async (password: string, question: string, answer: string) => {
    setChangeSecModalVisible(false);
    const ok = await updateSecurityQuestion({
      password,
      securityQuestion: question,
      securityAnswer: answer,
    });
  }

  const handleLogout = async () => {
    try {
      await logout();
      router.replace("/(auth)/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  }

  return (
    <>
      <SectionInfoCard title={t('settings.title')}>
        <ButtonGroup
          buttons={[
            { label: t('settings.language'), mode: 'outlined', onPress: handleLanguageSettingPress },
            { label: t('settings.familyInvitation'), mode: 'outlined', onPress: handleFamilyInvitationPress },
            { label: t('me:account.prompt.changePassword'), mode: 'outlined', onPress: handleChangePassword },
            { label: t('me:account.prompt.changeSecQuestion'), mode: 'outlined', onPress: handleChangeSecurityQuestion },
            { label: t('me:account.button.logout'), mode: 'outlined', onPress: handleLogout }
          ]}
          style={[Layout.column, { gap: Spacing.small }]}
        />
      </SectionInfoCard>

      <LanguageSwitchModal
        visible={languageModalVisible}
        onDismiss={() => setLanguageModalVisible(false)}
      />

      <FamilyInvitationModal
        visible={invitationModalVisible}
        onDismiss={handleFamilyInvitationClose}
        defaultToken={generatedToken}
        onGenerateNew={handleInvite}
        onJoinFamily={handleJoin}
      />

      <ChangeSecurityModal
        visible={changeSecModalVisible}
        onDismiss={handleChangeSecurityClose}
        changeType={changeType}
        onChangePassword={handleChangePassword}
        onChangeSecurityQuestion={handleUpdateSecurityQuestion}
      />
    </>
  )
}


interface FamilyInvitationModalProps {
  visible: boolean;
  onDismiss: () => void;
  defaultToken?: string;
  onGenerateNew: () => void;
  onJoinFamily: (token: string) => void;
}

function FamilyInvitationModal({
  visible,
  onDismiss,
  defaultToken = '',
  onGenerateNew,
  onJoinFamily
}: FamilyInvitationModalProps) {
  const { t } = useTranslation(['me', 'common']);
  const [joinToken, setJoinToken] = useState(defaultToken);
  useEffect(() => {
    setJoinToken(defaultToken);
  }, [defaultToken]);

  const handleGenerateToken = () => {
    onGenerateNew();
  };
  const handleJoinFamily = (token: string) => {
    onJoinFamily(token);
  };

  return (
    <CustomModal
      visible={visible}
      onDismiss={onDismiss}
      title={t('me:family.invitationTitle')}
      handleConfirm={onDismiss}
      handleCancel={onDismiss}
      containerStyle={ViewComponents.modalContainer}
    >
      <TextInput
        label={t('me:family.label.inviteToken')}
        value={joinToken}
        onChangeText={setJoinToken}
        mode="outlined"
        left={
          <TextInput.Icon icon="content-copy" onPress={() => {
            Clipboard.setStringAsync(joinToken).then(() => {
              setJoinToken(joinToken);
            });
          }} />
        }
        right={
          <TextInput.Icon icon="content-paste" onPress={() => {
            Clipboard.getStringAsync().then((text) => {
              setJoinToken(text);
            })
          }} />
        }
      />
      <ButtonGroup
        buttons={[
          { label: t('me:family.button.generateToken'), mode: 'outlined', onPress: handleGenerateToken },
          { label: t('me:family.button.joinWithToken'), mode: 'outlined', onPress: () => handleJoinFamily(joinToken) }
        ]}
        style={{ gap: Spacing.small }}
      />
    </CustomModal>
  )
}


interface ChangeSecurityModalProps {
  visible: boolean;
  onDismiss: () => void;
  changeType: 'password' | 'securityQuestion';
  onChangePassword: (oldPassword: string, newPassword: string, confirmPassword: string) => void;
  onChangeSecurityQuestion: (password: string, question: string, answer: string) => void;
}

function ChangeSecurityModal({
  visible,
  onDismiss,
  changeType,
  onChangePassword,
  onChangeSecurityQuestion
}: ChangeSecurityModalProps) {
  const { t } = useTranslation('me');
  const [oldPassword, setOldPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [securityQuestion, setSecurityQuestion] = useState<string>('');
  const [securityAnswer, setSecurityAnswer] = useState<string>('');

  const getModalTitle = () => {
    if (changeType === 'password') {
      return t('me:account.prompt.changePassword');
    } else {
      return t('me:account.prompt.changeSecQuestion');
    }
  };

  const handleConfirm = () => {
    if (changeType === 'password') {
      onChangePassword(oldPassword, newPassword, confirmPassword);
    } else {
      onChangeSecurityQuestion(oldPassword, securityQuestion, securityAnswer);
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
        right={
          <TextInput.Icon icon="close" onPress={() => setConfirmPassword('')} />
        }
      />

      {changeType === 'password' && (
        <>
          <TextInput
            label={t('me:account.label.newPassword')}
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
            mode="outlined"
            right={
              <TextInput.Icon icon="close" onPress={() => setNewPassword('')} />
            }
          />
          <TextInput
            label={t('me:account.label.confirmPassword')}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            mode="outlined"
            right={
              <TextInput.Icon icon="close" onPress={() => setConfirmPassword('')} />
            }
          />
        </>
      )}

      {changeType === 'securityQuestion' && (
        <>
          <TextInput
            label={t('me:account.label.securityQuestion')}
            value={securityQuestion}
            onChangeText={setSecurityQuestion}
            mode="outlined"
            right={
              <TextInput.Icon icon="close" onPress={() => setSecurityQuestion('')} />
            }
          />
          <TextInput
            label={t('me:account.label.securityAnswer')}
            value={securityAnswer}
            onChangeText={setSecurityAnswer}
            mode="outlined"
            right={
              <TextInput.Icon icon="close" onPress={() => setSecurityAnswer('')} />
            }
          />
        </>
      )}
    </CustomModal>
  )
}