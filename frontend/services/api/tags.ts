import api from "@/services/utils/axiosInstance";
import { TagCreate, TagOut, TagStatus, BulkResponseOut } from "../types";


// 获取所有标签
export const getTags = async (familyId: number): Promise<TagOut[]> => {
  const response = await api.get<TagOut[]>(`/families/${familyId}/tags/`);
  const res: TagOut[] = response.data.map(raw => ({
    ...raw,
    id: raw.id.toString() // 确保 ID 是字符串类型
  }));
  return res;
};

export const createTags = async (
  familyId: number, tags: TagOut[]
): Promise<BulkResponseOut<TagStatus>> => {
  const response = await api.post<BulkResponseOut<TagStatus>>(`/families/${familyId}/tags/bulk-create`, tags);
  return response.data;
};

export const updateTags = async (
  familyId: number, tags: TagOut[]
): Promise<BulkResponseOut<TagStatus>> => {
  const response = await api.put<BulkResponseOut<TagStatus>>(`/families/${familyId}/tags/bulk-update`, tags);
  return response.data;
};

export const deleteTags = async (
  familyId: number, tagIds: string[]
): Promise<BulkResponseOut<TagStatus>> => {
  const response = await api.post<BulkResponseOut<TagStatus>>(`/families/${familyId}/tags/bulk-delete`, tagIds);
  return response.data;
};

// // 创建标签
// export const createTag = async (familyId: number, data: TagCreate): Promise<TagOut> => {
//     const response = await api.post<TagOut>(`/families/${familyId}/tags/`, data);
//     return response.data;
// };

// // 更新标签
// export const updateTag = async (familyId: number, tagId: string, data: TagUpdate): Promise<TagOut> => {
//     const response = await api.put<TagOut>(`/families/${familyId}/tags/${tagId}`, data);
//     return response.data;
// };

// // 删除标签
// export const deleteTag = async (familyId: number, tagId: string): Promise<{ message: string }> => {
//     const response = await api.delete(`/families/${familyId}/tags/${tagId}`);
//     return response.data;
// };
