import { useContext } from 'react';
import { AlertModalContext } from './AlertModalContext';

export const useAlertModal = () => {
  const context = useContext(AlertModalContext);
  if (!context) {
    throw new Error('useAlertModal must be used within an AlertModalProvider');
  }
  return context;
}
