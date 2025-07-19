import { useState } from 'react';
import {
  View, 
  Alert
} from 'react-native';
import { useMembership } from '@/hooks';
import { useTranslation } from 'react-i18next';
import Button from '@/components/common/Button';
import { Layout, ViewComponents, TextComponents } from '@/styles';
import { TextWithView } from '@/components/common/TextWithView';
import { InputField } from '@/components/common/InputField';


export const FamilyInvitation = () => {
  const { t } = useTranslation(['me']);
  const { createInviteToken, joinFamilyWithToken } = useMembership();
  const [generatedToken, setGeneratedToken] = useState<string>('');

  const handleInvite = async () => {
    const token = await createInviteToken('adult');
    if (token) {
      setGeneratedToken(token);
    } else {
      Alert.alert(t('me:family.alert.inviteFailed'));
    }
  };

  const handleJoin = async () => {
    const result = await joinFamilyWithToken(generatedToken);
    if (!result) {
      Alert.alert(t('me:family.alert.joinFailed'));
    }
  }

  return (
    <View style={[Layout.column]}>
      <TextWithView 
        textStyle={TextComponents.subtitleText}
        viewStyle={{...Layout.contentColumn, ...Layout.center}}
      >
        {t('me:family.invitationTitle')}
      </TextWithView>

      <View style={[Layout.buttonRow, Layout.contentColumn]}>
        <Button style={ViewComponents.buttonInRow} onPress={handleInvite}>
          {t('me:family.button.generateToken')}
        </Button>
        <Button style={ViewComponents.buttonInRow} onPress={handleJoin}>
          {t('me:family.button.joinWithToken')}
        </Button>
      </View>

      <InputField
        label=""
        value={generatedToken}
        style={Layout.contentColumn}
        onChangeText={setGeneratedToken}
        multiline={false}
        placeholder={t('me:family.placeholder.invitationToken')}
      />
    </View>
  )
}