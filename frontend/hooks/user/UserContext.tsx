import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  getUserInfo, 
  getUserFamilies, 
  getUserMemberships, 
  updateUserInfo, 
  updateUserPassword, 
  updateSecurityQuestion, 
  deactivateAccount 
} from '@/services/api/user';
import { 
  UserOut, 
  FamilyOut, 
  MembershipOut, 
  UserUpdateInfoRequest, 
  UserUpdatePasswordRequest, 
  UserUpdateResetQuestionRequest 
} from '@/services/types';
import { useAuth } from '@/hooks/auth/useAuth';


interface UserContextType {
  user: UserOut | null;
  families: FamilyOut[];
  memberships: MembershipOut[];
  fetchUserInfo: () => Promise<void>;
  fetchFamilies: () => Promise<void>;
  fetchMemberships: () => Promise<void>;
  updateUserInfo: (data: UserUpdateInfoRequest) => Promise<boolean>;
  updatePassword: (data: UserUpdatePasswordRequest) => Promise<boolean>;
  updateSecurityQuestion: (data: UserUpdateResetQuestionRequest) => Promise<boolean>;
  deactivateAccount: () => Promise<boolean>;
}


export const UserContext = createContext<UserContextType | undefined>(undefined);


export const UserProvider = ({ children }: { children: ReactNode }) => {
  const { token } = useAuth();
  const [user, setUser] = useState<UserOut | null>(null);
  const [families, setFamilies] = useState<FamilyOut[]>([]);
  const [memberships, setMemberships] = useState<MembershipOut[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        setUser(null);
        setFamilies([]);
        setMemberships([]);
      } else {
        await Promise.all([
          fetchUserInfo(), 
          fetchFamilies(), 
          fetchMemberships()
        ]);
      }
    };
    fetchData();
  }, [token]);

  const fetchUserInfo = async () => {
    try {
      const userInfo = await getUserInfo();
      setUser(userInfo);
    } catch (error) {
      console.error('❌ 获取用户信息失败:', error);
    }
  };

  const fetchFamilies = async () => {
    try {
      const familyList = await getUserFamilies();
      setFamilies(familyList);
    } catch (error) {
      console.error('❌ 获取家庭列表失败:', error);
    }
  };

  const fetchMemberships = async () => {
    try {
      const membershipList = await getUserMemberships();
      setMemberships(membershipList);
    } catch (error) {
      console.error('❌ 获取 Membership 失败:', error);
    }
  };

  const updateUserInfoHandler = async (data: UserUpdateInfoRequest) => {
    try {
      const updatedUser = await updateUserInfo(data);
      setUser(updatedUser);
      return true;
    } catch (error) {
      console.error('❌ 更新用户信息失败:', error);
      return false;
    }
  };

  const updatePasswordHandler = async (data: UserUpdatePasswordRequest) => {
    try {
      await updateUserPassword(data);
      return true;
    } catch (error) {
      console.error('❌ 更新密码失败:', error);
      return false;
    }
  };

  const updateSecurityQuestionHandler = async (data: UserUpdateResetQuestionRequest) => {
    try {
      await updateSecurityQuestion(data);
      return true;
    } catch (error) {
      console.error('❌ 更新密保问题失败:', error);
      return false;
    }
  };

  const deactivateAccountHandler = async () => {
    try {
      await deactivateAccount();
      setUser(null);
      return true;
    } catch (error) {
      console.error('❌ 注销账号失败:', error);
      return false;
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        families,
        memberships,
        fetchUserInfo,
        fetchFamilies,
        fetchMemberships,
        updateUserInfo: updateUserInfoHandler,
        updatePassword: updatePasswordHandler,
        updateSecurityQuestion: updateSecurityQuestionHandler,
        deactivateAccount: deactivateAccountHandler,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
