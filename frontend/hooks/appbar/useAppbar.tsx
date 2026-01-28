import { useContext } from 'react';
import { AppbarContext } from './AppbarContext';

export const useAppbar = () => {
  const context = useContext(AppbarContext);
  if (!context) {
    throw new Error('useAppbar must be used within an AppbarProvider');
  }
  return context;
};
