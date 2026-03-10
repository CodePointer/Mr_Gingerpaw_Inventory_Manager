import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TextInput } from 'react-native-paper';
import * as Clipboard from 'expo-clipboard';
import { ButtonGroup } from '@/components/common/ButtonGroup';
import { CustomModal } from '@/components/common/CustomModal';
import { Spacing, ViewComponents } from '@/styles';


export interface FamilyInvitationModalProps {
  visible: boolean;
  onDismiss: () => void;
  defaultToken?: string;
  onGenerateNew: () => Promise<string | undefined> | string | undefined;
  onJoinFamily: (token: string) => Promise<void> | void;
}


export function FamilyInvitationModal({
  visible,
  onDismiss,
  defaultToken = '',
  onGenerateNew,
  onJoinFamily,
}: FamilyInvitationModalProps) {
  const { t } = useTranslation(['me', 'common']);
  const [joinToken, setJoinToken] = useState(defaultToken);

  useEffect(() => {
    setJoinToken(defaultToken);
  }, [defaultToken, visible]);

  const handleGenerateToken = async () => {
    const token = await Promise.resolve(onGenerateNew());
    if (token) {
      setJoinToken(token);
    }
  };

  const handleJoinFamily = async () => {
    await Promise.resolve(onJoinFamily(joinToken));
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
          <TextInput.Icon
            icon="content-copy"
            onPress={() => {
              Clipboard.setStringAsync(joinToken);
            }}
          />
        }
        right={
          <TextInput.Icon
            icon="content-paste"
            onPress={() => {
              Clipboard.getStringAsync().then((text) => {
                setJoinToken(text);
              });
            }}
          />
        }
      />
      <ButtonGroup
        buttons={[
          {
            label: t('me:family.button.generateToken'),
            mode: 'outlined',
            onPress: handleGenerateToken,
          },
          {
            label: t('me:family.button.joinWithToken'),
            mode: 'outlined',
            onPress: handleJoinFamily,
          },
        ]}
        style={{ gap: Spacing.small }}
      />
    </CustomModal>
  );
}
