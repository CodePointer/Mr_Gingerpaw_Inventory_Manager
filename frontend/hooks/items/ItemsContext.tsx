import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import {
  getItems,
  createItem,
  updateItem,
  deleteItem,
  bulkDeleteItems,
  addTagsToItems,
  getItemsNeedingCheck,
  updateLastCheck,
  bulkCheckItems,
} from "@/services/api/items";
import { ItemOut, ItemCreate, ItemUpdate, TagOut } from "@/services/types";
import { useFamily } from "@/hooks/family/useFamily";
import { useTranslation } from "react-i18next";
import { useToast } from "@/services/utils/useToast";
import axios from "axios";

interface ItemsContextType {
  items: ItemOut[];
  fetchItems: (tagIds?: number[], location?: string) => Promise<boolean>;
  createItem: (data: ItemCreate) => Promise<boolean>;
  updateItem: (itemId: number, data: ItemUpdate) => Promise<boolean>;
  deleteItem: (itemId: number) => Promise<boolean>;
  // bulkDeleteItems: (itemIds: number[]) => Promise<void>;
  // addTagsToItems: (itemIds: number[], tagIds: number[]) => Promise<void>;
  fetchItemsNeedingCheck: () => Promise<boolean>;
  updateLastCheck: (itemId: number) => Promise<boolean>;
  // bulkCheckItems: (itemIds: number[]) => Promise<void>;
  resetItems: () => void;
}


export const ItemsContext = createContext<ItemsContextType | undefined>(undefined);

export const ItemsProvider = ({ children }: { children: ReactNode }) => {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const { currentFamily } = useFamily();
  const [items, setItems] = useState<ItemOut[]>([]);

  useEffect(() => {
    if (currentFamily) {
      resetItems();
      fetchItems();
    }
  }, [currentFamily]);

  const fetchItems = async (tagIds?: number[], location?: string) => {
    if (!currentFamily) return true;
    try {
      const itemsData = await getItems(currentFamily.id, tagIds, location);
      setItems(itemsData);
      // console.log("✅ 物品加载成功:", itemsData);
      return true;
    } catch (error) {
      console.error("❌ 物品加载失败:", error);
      return false;
    }
  };

  const createItemHandler = async (data: ItemCreate) => {
    if (!currentFamily) return false;
    try {
      const newItem = await createItem(currentFamily.id, data);
      setItems((prev) => [newItem, ...prev]);
      return true;
      // console.log("✅ 物品创建成功:", newItem);
    } catch (error) {
      console.error("❌ 物品创建失败:", error);
      return false;
    }
  };

  const updateItemHandler = async (itemId: number, data: ItemUpdate) => {
    if (!currentFamily) return false;
    try {
      const updatedItem = await updateItem(currentFamily.id, itemId, data);
      setItems((prev) =>
        prev.map((item) => (item.id === itemId ? updatedItem : item))
      );
      // console.log("✅ 物品更新成功:", updatedItem);
      return true;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        showToast(t('alert.updateItemFailText'));
      } else {
        console.error("❌ 物品更新失败:", error);
      }
      return false;
    }
  };

  const deleteItemHandler = async (itemId: number) => {
    if (!currentFamily) return false;
    try {
      await deleteItem(currentFamily.id, itemId);
      setItems((prev) => prev.filter((item) => item.id !== itemId));
      // console.log("✅ 物品删除成功:", itemId);
      return true;
    } catch (error) {
      console.error("❌ 物品删除失败:", error);
      return false;
    }
  };

  const bulkDeleteItemsHandler = async (itemIds: number[]) => {
    if (!currentFamily) return;
    // try {
    //   const { successful } = await bulkDeleteItems(currentFamily.id, itemIds);
    //   setItems((prev) =>
    //     prev.filter((item) => !successful.some((deleted) => deleted.id === item.id))
    //   );
    //   console.log("✅ 物品批量删除成功:", itemIds);
    // } catch (error) {
    //   console.error("❌ 物品批量删除失败:", error);
    // }
  };

  const addTagsToItemsHandler = async (itemIds: number[], tagIds: number[]) => {
    if (!currentFamily) return;
    // try {
    //   const { successful } = await addTagsToItems(currentFamily.id, itemIds, tagIds);
    //   setItems((prev) =>
    //     prev.map((item) =>
    //       successful.some((updated) => updated.id === item.id) ? { ...item, tags: tagIds } : item
    //     )
    //   );
    //   console.log("✅ 标签批量添加成功:", itemIds, tagIds);
    // } catch (error) {
    //   console.error("❌ 标签批量添加失败:", error);
    // }
  };

  const fetchItemsNeedingCheckHandler = async () => {
    if (!currentFamily) return false;
    try {
      const itemsData = await getItemsNeedingCheck(currentFamily.id);
      setItems(itemsData);
      // console.log("✅ 需要检查的物品加载成功:", itemsData);
      return true;
    } catch (error) {
      console.error("❌ 需要检查的物品加载失败:", error);
      return false;
    }
  };

  const updateLastCheckHandler = async (itemId: number) => {
    if (!currentFamily) return false;

    try {
      const updatedItem = await updateLastCheck(currentFamily.id, itemId);
      setItems((prev) =>
        prev.map((item) => (item.id === itemId ? updatedItem : item))
      );
      // console.log("✅ 物品检查时间更新成功:", updatedItem);
      return true;
    } catch (error) {
      console.error("❌ 物品检查时间更新失败:", error);
      return false;
    }
  };

  // const bulkCheckItemsHandler = async (itemIds: number[]) => {
  //   if (!currentFamily) return;

  //   try {
  //     const { successful } = await bulkCheckItems(currentFamily.id, itemIds);
  //     setItems((prev) =>
  //       prev.map((item) =>
  //         successful.some((updated) => updated.id === item.id) ? { ...item, lastChecked: Date.now() } : item
  //       )
  //     );
  //     console.log("✅ 物品批量检查时间更新成功:", itemIds);
  //   } catch (error) {
  //     console.error("❌ 物品批量检查时间更新失败:", error);
  //   }
  // };

  const resetItems = () => {
    setItems([]);
    // console.log("🔄 物品状态已重置");
  };

  return (
    <ItemsContext.Provider
      value={{
        items,
        fetchItems,
        createItem: createItemHandler,
        updateItem: updateItemHandler,
        deleteItem: deleteItemHandler,
        // bulkDeleteItems: bulkDeleteItemsHandler,
        // addTagsToItems: addTagsToItemsHandler,
        fetchItemsNeedingCheck: fetchItemsNeedingCheckHandler,
        updateLastCheck: updateLastCheckHandler,
        // bulkCheckItems: bulkCheckItemsHandler,
        resetItems,
      }}
    >
      {children}
    </ItemsContext.Provider>
  );
};
