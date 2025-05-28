import api from "@/services/utils/axiosInstance";
import { 
  ItemCreate, 
  ItemOut, 
  ItemUpdate, 
  BulkResponseOut 
} from "@/services/types";


export const getItems = async (familyId: number, tagIds?: number[], location?: string): Promise<ItemOut[]> => {
    const params = new URLSearchParams();
    if (tagIds && tagIds.length > 0) params.append("tags", tagIds.map(id => id.toString()).join(","));
    if (location) params.append("location", location);
    const response = await api.get<ItemOut[]>(`/families/${familyId}/items?${params.toString()}`);
    return response.data;
};


export const createItem = async (familyId: number, data: ItemCreate): Promise<ItemOut> => {
    const response = await api.post<ItemOut>(`/families/${familyId}/items/`, data);
    return response.data;
};


export const updateItem = async (familyId: number, itemId: number, data: ItemUpdate): Promise<ItemOut> => {
    const response = await api.put<ItemOut>(`/families/${familyId}/items/${itemId}`, data);
    return response.data;
};


export const deleteItem = async (familyId: number, itemId: number): Promise<{ message: string }> => {
    const response = await api.delete(`/families/${familyId}/items/${itemId}`);
    return response.data;
};


export const bulkDeleteItems = async (familyId: number, itemIds: number[]): Promise<BulkResponseOut<ItemOut>> => {
    const response = await api.post<BulkResponseOut<ItemOut>>(`/families/${familyId}/items/bulk-delete`, { itemIds });
    return response.data;
};


export const addTagsToItems = async (familyId: number, itemIds: number[], tagIds: number[]): Promise<BulkResponseOut<ItemOut>> => {
    const response = await api.patch<BulkResponseOut<ItemOut>>(`/families/${familyId}/items/bulk-add-tags`, {
        item_ids: itemIds,
        tag_ids: tagIds,
    });
    return response.data;
};


export const getItemsNeedingCheck = async (familyId: number): Promise<ItemOut[]> => {
    const response = await api.get<ItemOut[]>(`/families/${familyId}/items/check-needed`);
    return response.data;
};


export const updateLastCheck = async (familyId: number, itemId: number): Promise<ItemOut> => {
    const response = await api.patch<ItemOut>(`/families/${familyId}/items/${itemId}/check`);
    return response.data;
};


export const bulkCheckItems = async (familyId: number, itemIds: number[]): Promise<BulkResponseOut<ItemOut>> => {
    const response = await api.patch<BulkResponseOut<ItemOut>>(`/families/${familyId}/items/bulk-check`, { item_ids: itemIds });
    return response.data;
};
