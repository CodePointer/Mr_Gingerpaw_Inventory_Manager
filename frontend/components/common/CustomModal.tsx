// components/common/BasicSectionCard.tsx
import { View } from 'react-native';
import { Modal, Portal, Text } from 'react-native-paper';
import { Layout, ViewComponents, Spacing } from '@/styles';
import { ButtonGroup } from '@/components/common/ButtonGroup';
import { useTranslation } from 'react-i18next';


interface CustomModalProps {
  visible: boolean;
  onDismiss: () => void;
  style?: object;
  containerStyle?: object;
  children: React.ReactNode;

  title: string;
  handleConfirm: () => void;
  handleCancel: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
}


export function CustomModal({
  visible,
  onDismiss,
  style,
  containerStyle,
  children,
  title,
  handleConfirm,
  handleCancel,
  confirmLabel,
  cancelLabel
}: CustomModalProps) {

  const { t } = useTranslation(['common']);

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={containerStyle}
        style={style}
      >
        <View style={[Layout.center]}>
          <Text variant="headlineLarge">{title}</Text>
        </View>
        <View style={[Layout.column, { flex: 1, gap: Spacing.small }]}>
          {children}
        </View>
        <ButtonGroup 
          buttons={[
            {
              label: confirmLabel ?? t('common:button.confirm', { defaultValue: 'Confirm' }),
              mode: 'contained',
              onPress: handleConfirm
            },
            {
              label: cancelLabel ?? t('common:button.cancel', { defaultValue: 'Cancel' }),
              mode: 'outlined',
              onPress: handleCancel
            }
          ]}
          style={[ViewComponents.rowButtons]}
        />
      </Modal>
    </Portal>
  )
};