import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './useAuth';
import api from '@/utils/api';

type Family = {
  id: number;
  name: string;
};

type FamilyContextType = {
  families: Family[];
  currentFamilyId: number | null;
  setCurrentFamilyId: (id: number) => void;
  loading: boolean;
  error: string | null;
};

const FamilyContext = createContext<FamilyContextType | undefined>(undefined);

export const FamilyProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [families, setFamilies] = useState<Family[]>([]);
  const [currentFamilyId, setCurrentFamilyId] = useState<number | null>(null);
  const [hasSelectedFamily, setHasSelectedFamily] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const selectFamily = (id: number) => {
    // console.log('👆 用户切换家庭为：', id);
    setCurrentFamilyId(id);
    setHasSelectedFamily(true);
  }

  useEffect(() => {
    const fetchFamilies = async () => {
      try {
        const response = await api.get('/users/me/families', {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        });
        setFamilies(response.data);

        if (!hasSelectedFamily && response.data.length > 0) {
          // console.log('🔁 设置默认家庭为：', response.data[0].id);
          selectFamily(response.data[0].id);
        }
      } catch (err) {
        console.error('获取家庭列表失败', err);
        setError('无法加载家庭列表');
      } finally {
        setLoading(false);
      }
    };

    if (user?.token) {
      fetchFamilies();
    }
  }, [user?.token]);

  return (
    <FamilyContext.Provider
      value={{
        families,
        currentFamilyId,
        setCurrentFamilyId: selectFamily,
        loading,
        error,
      }}
    >
      {children}
    </FamilyContext.Provider>
  );
};

export const useFamily = () => {
  const context = useContext(FamilyContext);
  if (!context) {
    throw new Error('useFamily must be used within FamilyProvider');
  }
  return context;
};
