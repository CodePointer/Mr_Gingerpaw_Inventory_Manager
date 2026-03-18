import React, { createContext, useState, ReactNode, useEffect } from 'react';
import { getItems } from '@/services/api/items';
import { ItemFormModalValues, ItemOut } from '@/services/types';
import { useFamily } from '@/hooks/family/useFamily';
import { useTranslation } from 'react-i18next';
import { useTags } from '../tags/useTags';

interface ItemsContextType {
  items: ItemOut[];
  fetchItems: (tagIds?: number[], location?: string) => Promise<boolean>;
  findItemByInfo: (itemInfo: ItemOut | ItemFormModalValues) => string | null;
  resetItems: () => void;
}


export const ItemsContext = createContext<ItemsContextType | undefined>(undefined);

export const ItemsProvider = ({ children }: { children: ReactNode }) => {
  const { currentFamily } = useFamily();
  const { getTagsByIds } = useTags();
  const [items, setItems] = useState<ItemOut[]>([]);

  useEffect(() => {
    if (currentFamily) {
      resetItems();
      fetchItems();
    } else {
      resetItems();
    }
  }, [currentFamily]);

  const fetchItems = async (tagIds?: number[], location?: string) => {
    if (!currentFamily) return true;
    try {
      const itemsData = await getItems(currentFamily.id, tagIds, location);
      const itemWithTags = itemsData.map(item => {
        item.tags = item.tagIds ? getTagsByIds(item.tagIds) : [];
        return item;
      });
      setItems(itemWithTags);
      // console.log('✅ Items loaded successfully:', itemWithTags);
      return true;
    } catch (error) {
      // console.error('❌ 物品加载失败:', error);
      return false;
    }
  };

  const findItemByInfo = (itemInfo: ItemOut | ItemFormModalValues): string | null => {
    if (!currentFamily) return null;
    const foundItem = items.find(
      (item) =>
        item.name === itemInfo.name &&
        item.location === itemInfo.location &&
        item.unit === itemInfo.unit &&
        item.familyId === currentFamily.id
    );
    return foundItem?.id ?? null;
  };

  const resetItems = () => {
    setItems([]);
    // console.log('🔄 物品状态已重置');
  };

  return (
    <ItemsContext.Provider
      value={{
        items,
        fetchItems,
        findItemByInfo,
        resetItems,
      }}
    >
      {children}
    </ItemsContext.Provider>
  );
};
