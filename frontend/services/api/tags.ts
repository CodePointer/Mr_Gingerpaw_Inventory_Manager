import api from "@/services/utils/axiosInstance";
import { TagCreate, TagOut, TagUpdate } from "../types";

// 创建标签
export const createTag = async (familyId: number, data: TagCreate): Promise<TagOut> => {
    const response = await api.post<TagOut>(`/families/${familyId}/tags/`, data);
    return response.data;
};

// 获取所有标签
export const getTags = async (familyId: number): Promise<TagOut[]> => {
    const response = await api.get<TagOut[]>(`/families/${familyId}/tags/`);
    return response.data;
};

// 更新标签
export const updateTag = async (familyId: number, tagId: number, data: TagUpdate): Promise<TagOut> => {
    const response = await api.put<TagOut>(`/families/${familyId}/tags/${tagId}`, data);
    return response.data;
};

// 删除标签
export const deleteTag = async (familyId: number, tagId: number): Promise<{ message: string }> => {
    const response = await api.delete(`/families/${familyId}/tags/${tagId}`);
    return response.data;
};
