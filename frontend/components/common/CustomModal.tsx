// components/common/BasicSectionCard.tsx
import { View } from 'react-native';
import { Modal, Portal, Text } from 'react-native-paper';
import { Layout, ViewComponents, Spacing } from '@/styles';
import { ButtonGroup } from '@/components/common/ButtonGroup';
import { useTranslation } from 'react-i18next';
import { use } from 'react';


interface CustomModalProps {
  visible: boolean;
  onDismiss: () => void;
  style?: object;
  containerStyle?: object;
  children: React.ReactNode;

  title: string;
  handleConfirm: () => void;
  handleCancel: () => void;
}


export function CustomModal({
  visible,
  onDismiss,
  style,
  containerStyle,
  children,
  title,
  handleConfirm,
  handleCancel
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
            { label: t('common:confirm'), mode: 'contained', onPress: handleConfirm },
            { label: t('common:cancel'), mode: 'outlined', onPress: handleCancel }
          ]}
          style={[ViewComponents.rowButtons]}
        />
      </Modal>
    </Portal>
  )
};