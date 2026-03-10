// AIDraftFormModal.tsx
import { useState } from 'react';
import { TextInput } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { CustomModal } from '@/components/common/CustomModal';
import { AIDraftFormModalValues } from '@/services/types/aidraftTypes';
import { TextComponents, ViewComponents } from '@/styles';


interface AIDraftFormModalProps {
  visible: boolean;
  queryType: string;
  queryId: string;
  label?: string;
  onClose: () => void;
  onSubmit: (values: AIDraftFormModalValues) => void;
}


export function AIDraftFormModal({
  visible,
  queryType,
  queryId,
  label,
  onClose,
  onSubmit,
}: AIDraftFormModalProps) {
  const { t } = useTranslation(['home', 'common']);
  const [queriesRawData, setQueriesRawData] = useState<string>('');

  const handleSubmit = () => {
    onSubmit({ 
      queryType: queryType,
      queryId: queryId,
      queries: queriesRawData.split('\n').filter(q => q.trim() !== '')
    });
    setQueriesRawData('');
    onClose();
  };

  const handleCancel = () => {
    setQueriesRawData('');
    onClose();
  };

  return (
    <CustomModal
      visible={visible}
      onDismiss={onClose}
      title={t('home:aidraftgen.title')}
      handleConfirm={handleSubmit}
      handleCancel={handleCancel}
      confirmLabel={t('common:submit')}
      cancelLabel={t('common:cancel')}
      containerStyle={ViewComponents.modalContainer}
    >
      <TextInput
        style={[{ minHeight: 120 }]}
        mode="outlined"
        label={label}
        contentStyle={{ textAlignVertical: 'top' }}
        placeholder={t('home:aidraftgen.namePlaceholder')}
        value={queriesRawData}
        onChangeText={setQueriesRawData}
        multiline={true}
        numberOfLines={6}
        scrollEnabled={true}
      />
    </CustomModal>
  );
}