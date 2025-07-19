import React, { createContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Layout, TextComponents, ViewComponents } from '@/styles';
import { Modal, ScrollView, View } from 'react-native';
import { TextWithView } from '@/components/common/TextWithView';
import Button from '@/components/common/Button';


interface AlertModalContextProps {
  showModal: (message: string, hasOnlyConfirm?: boolean) => Promise<boolean>;
}


export const AlertModalContext = createContext<AlertModalContextProps | undefined>(undefined);

export const AlertModalProvider = ({ children }: { children: React.ReactNode }) => {
  const { t } = useTranslation(['common']);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [modalMessage, setModalMessage] = useState<string>('');
  const [onlyConfirm, setOnlyConfirm] = useState<boolean>(true);
  const [resolver, setResolver] = useState<((value: boolean) => void) | null>(null);

  const showModal = (message: string, hasOnlyConfirm: boolean = true): Promise<boolean> => {
    setModalMessage(message);
    setOnlyConfirm(hasOnlyConfirm);
    setModalVisible(true);
    return new Promise((resolve) => {
      setResolver(resolve);
    });
  };

  const handleClose = (result: boolean) => {
    setModalVisible(false);
    setModalMessage('');
    resolver?.(result);
  };

  return (
    <AlertModalContext.Provider value={{ 
      showModal
    }}>
      {children}

      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={[Layout.center, ViewComponents.modalOverlay, { flex: 1 }]}>
          <View style={ViewComponents.modalContainer}>
            <ScrollView style={{ maxHeight: '100%'}}>
              <TextWithView 
                textStyle={TextComponents.subtitleText}
                viewStyle={{...Layout.center, ...Layout.contentColumn}}
              >
                {modalMessage}
              </TextWithView>

              <View style={[Layout.buttonRow, Layout.contentColumn]}>
                <Button style={ViewComponents.buttonInRow} onPress={() => handleClose(true)}>
                  {t('common:button.confirm')}
                </Button>
                {!onlyConfirm && <Button style={ViewComponents.buttonInRow} onPress={() => handleClose(false)}>
                  {t('common:button.cancel')}
                </Button>}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </AlertModalContext.Provider>
  );

}