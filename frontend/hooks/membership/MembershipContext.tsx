import React, { createContext, ReactNode } from 'react';
import { createInviteToken, joinWithToken, deleteMembership, updateMembership } from '@/services/api/membership';
import { useFamily } from '@/hooks/family/useFamily';

interface MembershipContextType {
  createInviteToken: (role: string) => Promise<string | null>;
  joinFamilyWithToken: (token: string) => Promise<boolean>;
  deleteMember: (userId: number, role: string) => Promise<boolean>;
  updateMemberRole: (userId: number, role: string) => Promise<boolean>;
}


export const MembershipContext = createContext<MembershipContextType | undefined>(undefined);


export const MembershipProvider = ({ children }: { children: ReactNode }) => {

  const { currentFamily } = useFamily();

  const createInviteTokenHandler = async (role: string) => {
    if (!currentFamily) return null;

    try {
      const { token } = await createInviteToken({
        familyId: currentFamily.id,
        tokenRole: role
      });
      return token;
    } catch (error) {
      console.error('❌ 邀请码生成失败:', error);
      return null;
    }
  };

  const joinFamilyWithTokenHandler = async (token: string) => {
    try {
      const membership = await joinWithToken({ token: token });
      return true;
    } catch (error) {
      console.error('❌ 加入家庭失败:', error);
      return false;
    }
  };

  const deleteMemberHandler = async (userId: number, role: string) => {
    if (!currentFamily) return false;

    try {
      const membership = await deleteMembership({
        familyId: currentFamily.id,
        userId: userId,
        role: role
      });
      return true;
    } catch (error) {
      console.error('❌ 成员删除失败:', error);
      return false;
    }
  };

  const updateMemberRoleHandler = async (userId: number, role: string) => {
    if (!currentFamily) return false;

    try {
      const updatedMembership = await updateMembership({
        familyId: currentFamily.id,
        userId: userId,
        role: role
      });
      return true;
    } catch (error) {
      console.error('❌ 成员角色更新失败:', error);
      return false;
    }
  };

  return (
    <MembershipContext.Provider
      value={{
        createInviteToken: createInviteTokenHandler,
        joinFamilyWithToken: joinFamilyWithTokenHandler,
        deleteMember: deleteMemberHandler,
        updateMemberRole: updateMemberRoleHandler,
      }}
    >
      {children}
    </MembershipContext.Provider>
  );
};
