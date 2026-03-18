// services/api/user.ts
import api from '@/services/utils/axiosInstance';
import {
  UserOut,
  FamilyOut,
  MembershipOut,
  UserUpdateInfoRequest,
  UserUpdatePasswordRequest,
  UserUpdateResetQuestionRequest
} from '@/services/types';


export const getUserInfo = async (): Promise<UserOut> => {
  const response = await api.get('/users/me');
  return response.data;
};


export const getUserFamilies = async (): Promise<FamilyOut[]> => {
  const response = await api.get('/users/me/families');
  return response.data;
};


export const getUserMemberships = async (): Promise<MembershipOut[]> => {
  const response = await api.get('/users/me/memberships');
  return response.data;
};


export const updateUserInfo = async (
  data: UserUpdateInfoRequest
): Promise<UserOut> => {
  const response = await api.put('/users/me/update', data);
  return response.data;
};


export const updateUserPassword = async (
  data: UserUpdatePasswordRequest
): Promise<UserOut> => {
  const response = await api.patch('/users/me/password', data);
  return response.data;
};


export const updateSecurityQuestion = async (
  data: UserUpdateResetQuestionRequest
): Promise<UserOut> => {
  const response = await api.put('/users/me/reset-question', data);
  return response.data;
};


export const deactivateAccount = async (): Promise<UserOut> => {
  const response = await api.post('/users/me/deactivate');
  return response.data;
};
