import React, { createContext, useState, useCallback } from 'react';

export interface AppbarAction {
  icon: string;
  onPress: () => void;
}

// 预定义每个页面的 icons 配置
const PAGE_ACTIONS_CONFIG: Record<string, string[]> = {
  home: [], // ['robot'],
  items: ['plus'],
  draft: [], // ['dots-vertical'],
  me: [], // ['cog']
};

interface AppbarContextProps {
  getPageActions: (pageName: string) => AppbarAction[];
  registerPageActions: (pageName: string, handlers: (() => void)[]) => void;
  unregisterPageActions: (pageName: string) => void;
}

export const AppbarContext = createContext<AppbarContextProps | undefined>(undefined);

export const AppbarProvider = ({ children }: { children: React.ReactNode }) => {
  // 存储每个页面的 action handlers
  const [pageHandlers, setPageHandlers] = useState<Record<string, (() => void)[]>>({});

  const registerPageActions = useCallback((pageName: string, handlers: (() => void)[]) => {
    setPageHandlers(prev => ({
      ...prev,
      [pageName]: handlers
    }));
  }, []);

  const unregisterPageActions = useCallback((pageName: string) => {
    setPageHandlers(prev => {
      const newHandlers = { ...prev };
      delete newHandlers[pageName];
      return newHandlers;
    });
  }, []);

  const getPageActions = useCallback((pageName: string): AppbarAction[] => {
    const icons = PAGE_ACTIONS_CONFIG[pageName] || [];
    const handlers = pageHandlers[pageName] || [];
    
    // 组合 icons 和 handlers
    return icons.map((icon, index) => ({
      icon,
      onPress: handlers[index] || (() => {})
    }));
  }, [pageHandlers]);

  return (
    <AppbarContext.Provider value={{ 
      getPageActions,
      registerPageActions,
      unregisterPageActions
    }}>
      {children}
    </AppbarContext.Provider>
  );
};
