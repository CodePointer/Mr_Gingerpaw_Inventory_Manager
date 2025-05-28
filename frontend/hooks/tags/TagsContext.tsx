import React, { createContext, useState, ReactNode, useEffect } from "react";
import { getTags, createTag, updateTag, deleteTag } from "@/services/api/tags";
import { TagOut, TagUpdate } from "@/services/types";
import { useFamily } from "@/hooks/family/useFamily";


interface TagsContextType {
  tags: TagOut[];
  fetchTags: () => Promise<void>;
  createTag: (tagName: string) => Promise<void>;
  updateTag: (tagId: number, data: TagUpdate) => Promise<void>;
  deleteTag: (tagId: number) => Promise<void>;
  resetTags: () => void;
}


export const TagsContext = createContext<TagsContextType | undefined>(undefined);


export const TagsProvider = ({ children }: { children: ReactNode }) => {
  const { currentFamily } = useFamily();
  const [tags, setTags] = useState<TagOut[]>([]);

  useEffect(() => {
    if (currentFamily) {
      fetchTags();
    }
  }, [currentFamily]);

  const fetchTags = async () => {
    if (!currentFamily) {
      console.error("❌ 尚未选择家庭，无法加载标签");
      return;
    }

    try {
      const tagsData = await getTags(currentFamily.id);
      setTags(tagsData);
      // console.log("✅ 标签加载成功:", tagsData);
    } catch (error) {
      console.error("❌ 标签加载失败:", error);
    }
  };

  const createTagHandler = async (tagName: string) => {
    if (!currentFamily) {
      console.error("❌ 尚未选择家庭，无法创建标签");
      return;
    }

    try {
      const newTag = await createTag(currentFamily.id, {
        name: tagName,
        familyId: currentFamily.id
      });
      setTags((prev) => [...prev, newTag]);
      console.log("✅ 标签创建成功:", newTag);
    } catch (error) {
      console.error("❌ 标签创建失败:", error);
    }
  };

  const updateTagHandler = async (tagId: number, data: TagUpdate) => {
    if (!currentFamily) {
      console.error("❌ 尚未选择家庭，无法更新标签");
      return;
    }

    try {
      const updatedTag = await updateTag(currentFamily.id, tagId, data);
      setTags((prev) =>
        prev.map((tag) => (tag.id === tagId ? updatedTag : tag))
      );
      console.log("✅ 标签更新成功:", updatedTag);
    } catch (error) {
      console.error("❌ 标签更新失败:", error);
    }
  };

  const deleteTagHandler = async (tagId: number) => {
    if (!currentFamily) {
      console.error("❌ 尚未选择家庭，无法删除标签");
      return;
    }

    try {
      await deleteTag(currentFamily.id, tagId);
      setTags((prev) => prev.filter((tag) => tag.id !== tagId));
      console.log("✅ 标签删除成功:", tagId);
    } catch (error) {
      console.error("❌ 标签删除失败:", error);
    }
  };

  const resetTags = () => {
    setTags([]);
    console.log("🔄 标签重置成功");
  };

  return (
    <TagsContext.Provider
      value={{
        tags,
        fetchTags,
        createTag: createTagHandler,
        updateTag: updateTagHandler,
        deleteTag: deleteTagHandler,
        resetTags,
      }}
    >
      {children}
    </TagsContext.Provider>
  );
};


