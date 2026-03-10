// components/me/SettingManager.tsx

import { useRouter } from 'expo-router';
import { useAuth, useMembership, useUser } from '@/hooks';
import { useModal } from '@/hooks/modal/useModal';
import { SectionInfoCard } from './SectionInfoCard';
import { useTranslation } from 'react-i18next';
import { ButtonGroup } from '../common/ButtonGroup';
import { Layout, Spacing } from '@/styles';


export function SettingManager() {
  const { logout } = useAuth();
  const router = useRouter();
  const { t } = useTranslation();
  const { open } = useModal();
  const { updatePassword, updateSecurityQuestion } = useUser();

  const { createInviteToken, joinFamilyWithToken } = useMembership();

  const handleLanguageSettingPress = () => {
    open('LanguageSwitch', {});
  };

  const handleFamilyInvitationPress = () => {
    open('FamilyInvitation', {
      onGenerateNew: handleInvite,
      onJoinFamily: handleJoin,
    });
  };

  const handleChangePassword = () => {
    open('ChangeSecurity', {
      changeType: 'password',
      onChangePassword: handleUpdatePassword,
      onChangeSecurityQuestion: handleUpdateSecurityQuestion,
    });
  };

  const handleChangeSecurityQuestion = () => {
    open('ChangeSecurity', {
      changeType: 'securityQuestion',
      onChangePassword: handleUpdatePassword,
      onChangeSecurityQuestion: handleUpdateSecurityQuestion,
    });
  };

  const handleInvite = async (): Promise<string | undefined> => {
    const token = await createInviteToken('adult');
    return token ?? undefined;
  };

  const handleJoin = async (token: string) => {
    await joinFamilyWithToken(token);
  };

  const handleUpdatePassword = async (oldPassword: string, newPassword: string, confirmPassword: string) => {
    if (newPassword !== confirmPassword) {
      console.log('New password and confirm password do not match.');
      return;
    }
    await updatePassword({ oldPassword, newPassword });
  };

  const handleUpdateSecurityQuestion = async (password: string, question: string, answer: string) => {
    await updateSecurityQuestion({
      password,
      securityQuestion: question,
      securityAnswer: answer,
    });
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.replace("/(auth)/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  }

  return (
    <SectionInfoCard title={t('settings.title')}>
      <ButtonGroup
        buttons={[
          { label: t('settings.language'), mode: 'outlined', onPress: handleLanguageSettingPress },
          { label: t('settings.familyInvitation'), mode: 'outlined', onPress: handleFamilyInvitationPress },
          { label: t('me:account.prompt.changePassword'), mode: 'outlined', onPress: handleChangePassword },
          { label: t('me:account.prompt.changeSecQuestion'), mode: 'outlined', onPress: handleChangeSecurityQuestion },
          { label: t('me:account.button.logout'), mode: 'outlined', onPress: handleLogout },
        ]}
        style={[Layout.column, { gap: Spacing.small }]}
      />
    </SectionInfoCard>
  );
}