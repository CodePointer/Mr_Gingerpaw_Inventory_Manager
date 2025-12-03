import React, { createContext, useState, ReactNode, useEffect } from "react";
import { getTags, createTags, updateTags, deleteTags } from "@/services/api/tags";
import { BulkResponseOut, TagOut, TagStatus } from "@/services/types";
import { useFamily } from "@/hooks/family/useFamily";


interface TagsContextType {
  tags: TagOut[];
  fetchTags: () => Promise<void>;
  getTagsByIds: (ids: string[]) => TagOut[];
  isSubmittingTags: boolean;
  submitNewTags: (tags: TagOut[]) => Promise<BulkResponseOut<TagStatus>>;
  submitUpdatedTags: (tags: TagOut[]) => Promise<BulkResponseOut<TagStatus>>;
  submitDeletedTags: (tagIds: string[]) => Promise<BulkResponseOut<TagStatus>>;
  resetTags: () => void;
}


export const TagsContext = createContext<TagsContextType | undefined>(undefined);


export const TagsProvider = ({ children }: { children: ReactNode }) => {
  const { currentFamily } = useFamily();
  const [tags, setTags] = useState<TagOut[]>([]);
  const [isSubmittingTags, setIsSubmittingTags] = useState(false);

  useEffect(() => {
    if (currentFamily) {
      fetchTags();
    } else {
      resetTags();
    }
  }, [currentFamily]);

  const fetchTags = async () => {
    if (!currentFamily) {
      // console.error("❌ 尚未选择家庭，无法加载标签");
      return;
    }
    setIsSubmittingTags(true);
    try {
      const tagsData = await getTags(currentFamily.id);
      setTags(tagsData);
      // console.log("✅ 标签加载成功:", tagsData);
    } catch (error) {
      // console.error("❌ 标签加载失败:", error);
    }
    setIsSubmittingTags(false);
  };

  const getTagsByIds = (ids: string[]) => {
    return tags.filter(tag => ids.includes(tag.id));
  };

  const submitThings = async (
    dataArray: any[],
    uploadFunc: (familyId: number, data: any[]) => Promise<BulkResponseOut<TagStatus>>
  ) => {
    if (isSubmittingTags) {
      return { success: [], failed: [] } as BulkResponseOut<TagStatus>;
    }
    setIsSubmittingTags(true);
    if (dataArray.length === 0) {
      setIsSubmittingTags(false);
      return { success: [], failed: [] } as BulkResponseOut<TagStatus>;
    }
    const response = await uploadFunc(currentFamily?.id ?? -1, dataArray);
    setIsSubmittingTags(false);
    return response;
  }

  const submitNewTags = async (newTags: TagOut[]) => {
    return submitThings(newTags, createTags);
  };

  const submitUpdatedTags = async (updatedTags: TagOut[]) => {
    return submitThings(updatedTags, updateTags);
  };

  const submitDeletedTags = async (deletedTagIds: string[]) => {
    return submitThings(deletedTagIds, deleteTags);
  };

  const resetTags = () => {
    setTags([]);
    // console.log("🔄 标签重置成功");
  };

  return (
    <TagsContext.Provider
      value={{
        tags,
        fetchTags,
        getTagsByIds,
        isSubmittingTags,
        submitNewTags,
        submitUpdatedTags,
        submitDeletedTags,
        resetTags,
      }}
    >
      {children}
    </TagsContext.Provider>
  );
};


