// AIDraftFormModal.tsx
import { View, Text, TextInput, Modal } from 'react-native';
import { useTranslation } from 'react-i18next';
import Button from '@/components/common/Button';
import { Layout, Colors, TextComponents, ViewComponents } from '@/styles';
import { AIDraftFormModalValues } from '@/services/types/aidraftTypes';
import { useState } from 'react';
import { TextWithView } from '../common/TextWithView';


interface AIDraftFormModalProps {
  visible: boolean;
  queryType: string;
  queryId: string;
  onClose: () => void;
  onSubmit: (values: AIDraftFormModalValues) => void;
}


export function AIDraftFormModal({
  visible,
  queryType,
  queryId,
  onClose,
  onSubmit,
}: AIDraftFormModalProps) {
  const { t } = useTranslation(['home', 'common']);
  
  // const [queryType, setQueryType] = useState<string>('new');
  // const [queryId, setQueryId] = useState<string>('');
  const [queriesRawData, setQueriesRawData] = useState<string>('');

  const handleSubmit = () => {
    onSubmit({ 
      queryType: queryType,
      queryId: queryId,
      queries: queriesRawData.split('\n').filter(q => q.trim() !== '')
    });
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={[Layout.center, ViewComponents.modalOverlay, { flex: 1 }]}>
        <View style={ViewComponents.modalContainer}>
          <View style={[Layout.modal, { display: visible ? 'flex' : 'none' }]}>
            <TextWithView textStyle={TextComponents.titleText} viewStyle={[Layout.center, Layout.modalPadding]}>
              {t('home:aidraftgen.title')}
            </TextWithView>

            <View style={[Layout.modalPadding]}>
              <TextInput
                style={[TextComponents.inputBox, { flex: 1 }]}
                placeholder={t('home:aidraftgen.namePlaceholder')}
                value={queriesRawData}
                onChangeText={setQueriesRawData}
                multiline={true}
                numberOfLines={10}
                scrollEnabled={true}
              />
            </View>

            <View style={[Layout.buttonRow, Layout.modalPadding]}>
              <Button onPress={handleSubmit} style={ViewComponents.buttonInRow}>
                {t('common:submit')}
              </Button>
              <Button onPress={onClose} style={ViewComponents.buttonInRow}>
                {t('common:cancel')}
              </Button>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}