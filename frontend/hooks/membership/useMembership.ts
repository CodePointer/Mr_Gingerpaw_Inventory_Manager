import { useContext } from 'react';
import { MembershipContext } from './MembershipContext';


export const useMembership = () => {
  const context = useContext(MembershipContext);
  if (!context) {
    throw new Error('useMembership must be used within a MembershipProvider');
  }
  return context;
};