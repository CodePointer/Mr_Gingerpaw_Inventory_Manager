import React, { createContext, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Dialog, Portal, Text } from 'react-native-paper';


interface AlertModalContextProps {
  showModal: (message: string, hasOnlyConfirm?: boolean) => Promise<boolean>;
}


export const AlertModalContext = createContext<AlertModalContextProps | undefined>(undefined);

export const AlertModalProvider = ({ children }: { children: React.ReactNode }) => {
  const { t } = useTranslation(['common']);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [onlyConfirm, setOnlyConfirm] = useState(true);
  const resolverRef = useRef<((value: boolean) => void) | null>(null);

  const showModal = (message: string, hasOnlyConfirm: boolean = true): Promise<boolean> => {
    setModalMessage(message);
    setOnlyConfirm(hasOnlyConfirm);
    setModalVisible(true);
    return new Promise((resolve) => {
      resolverRef.current = resolve;
    });
  };

  const handleClose = (result: boolean) => {
    const resolve = resolverRef.current;
    resolverRef.current = null;
    setModalVisible(false);
    setModalMessage('');
    resolve?.(result);
  };

  return (
    <AlertModalContext.Provider value={{ showModal }}>
      {children}

      <Portal>
        <Dialog
          visible={modalVisible}
          onDismiss={() => handleClose(false)}
          dismissable={!onlyConfirm}
        >
          <Dialog.Content>
            <Text variant="bodyLarge">{modalMessage}</Text>
          </Dialog.Content>
          <Dialog.Actions>
            {!onlyConfirm ? (
              <Button onPress={() => handleClose(false)}>
                {t('common:button.cancel', { defaultValue: 'Cancel' })}
              </Button>
            ) : null}
            <Button onPress={() => handleClose(true)}>
              {t('common:button.confirm', { defaultValue: 'Confirm' })}
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </AlertModalContext.Provider>
  );

};