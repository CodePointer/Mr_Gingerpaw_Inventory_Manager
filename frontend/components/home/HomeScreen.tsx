// components/home/HomeScreen.tsx
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useDrafts, useFamily } from '@/hooks';
import { LoadingScreen, NoFamilyScreen, EmptyScreen } from '@/components/common/DefaultScreen';
import { ViewComponents, Layout } from '@/styles';
import Button from '@/components/common/Button';
import { useAIDraftEditor } from '@/hooks/modals/useAIDraftEditor';
import { useAppbar } from '@/hooks';
import { AIDraftFormModalValues, AIDraftGenerateRequest } from '@/services/types/aidraftTypes';
import { AIDraftFormModal } from '@/components/home/AIDraftFormModal';
import { useEffect } from 'react';


export function HomeScreen() {

  const { currentFamily } = useFamily();
  const { isGenerating, generateAiDraft } = useDrafts();
  const { t } = useTranslation(['home']);
  const { registerPageActions, unregisterPageActions } = useAppbar();

  // return (<EmptyScreen />);

  const aiDraftEditor = useAIDraftEditor({
    onProcess: (draft) => {
      generateAiDraft({
        queryId: draft.queryId,
        queryType: draft.queryType,
        queries: draft.queries,
        familyId: currentFamily?.id ?? -1
      }).catch((error) => {
        console.error('Error generating AI draft:', error);
      });
    }
  });

  // Register appbar actions once on mount
  useEffect(() => {
    registerPageActions('home', [
      aiDraftEditor.openEditor
    ]);
    return () => {
      unregisterPageActions('home');
    };
  }, [registerPageActions, unregisterPageActions]);

  if (!currentFamily) return (<NoFamilyScreen/>);

  if (isGenerating) return (<LoadingScreen />);

  return (
    <View style={[Layout.column, ViewComponents.screen]}>

      <AIDraftFormModal
        visible={aiDraftEditor.modalVisible}
        queryType={aiDraftEditor.queryType}
        queryId={aiDraftEditor.queryId}
        onClose={aiDraftEditor.closeEditor}
        onSubmit={aiDraftEditor.handleSubmit}
      />

      <Button onPress={aiDraftEditor.openEditor}>
        {t('home:aidraftgen')}
      </Button>
    </View>
  );
}
