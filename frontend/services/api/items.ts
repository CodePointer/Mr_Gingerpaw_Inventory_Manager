import api from '@/services/utils/axiosInstance';
import {
  ItemOut,
  ItemUpdate,
  ItemResponseStatus,
  BulkResponseOut,
  ItemDelete
} from '@/services/types';
import { AIDraftGenerateRequest, AIDraftGenerateResponse } from '../types/aidraftTypes';


export const getItems = async (familyId: number, tagIds?: number[], location?: string): Promise<ItemOut[]> => {
  const params = new URLSearchParams();
  if (tagIds && tagIds.length > 0) params.append('tags', tagIds.map(id => id.toString()).join(','));
  if (location) params.append('location', location);
  const response = await api.get<ItemOut[]>(`/families/${familyId}/items?${params.toString()}`);
  const res: ItemOut[] = response.data.map(raw => ({
    ...raw,
    id: raw.id.toString(),
    tagIds: Array.from(raw.tags?.map(tag => tag.id.toString()) || []),
    rawInput: undefined // Discard rawInput for frontend use
  }))
  // console.log('getItems response:', res);
  return res;
};


export const createItems = async (familyId: number, items: ItemOut[]): Promise<BulkResponseOut<ItemResponseStatus>> => {
  const response = await api.post<BulkResponseOut<ItemResponseStatus>>(`/families/${familyId}/items/bulk-create`, items);
  return response.data;
  // const fakeResponse: BulkResponseOut<ItemResponseStatus> = {
  //   success: items.map(item => ({
  //     itemId: item.id,
  //     status: 'success',
  //     code: 200
  //   } as ItemResponseStatus)),
  //   failed: []
  // };
  // return fakeResponse;
};

export const createItem = async (familyId: number, data: ItemOut): Promise<ItemOut> => {
  const response = await api.post<ItemOut>(`/families/${familyId}/items/`, data);
  return response.data;
};

export const updateItems = async (familyId: number, items: ItemUpdate[]): Promise<BulkResponseOut<ItemResponseStatus>> => {
  // const fakeResponse: BulkResponseOut<ItemResponseStatus> = {
  //   success: items.map(item => ({
  //     itemId: item.id,
  //     status: 'success',
  //     code: 200
  //   } as ItemResponseStatus)),
  //   failed: []
  // };
  const response = await api.put<BulkResponseOut<ItemResponseStatus>>(`/families/${familyId}/items/bulk-update`, items);
  return response.data;
};

export const updateItem = async (familyId: number, itemId: number, data: ItemUpdate): Promise<ItemOut> => {
  const response = await api.put<ItemOut>(`/families/${familyId}/items/${itemId}`, data);
  return response.data;
};


export const deleteItems = async (familyId: number, items: ItemDelete[]): Promise<BulkResponseOut<ItemResponseStatus>> => {
  // const fakeResponse: BulkResponseOut<ItemResponseStatus> = {
  //   success: itemIds.map(id => ({
  //     itemId: id,
  //     status: 'success',
  //     code: 200
  //   } as ItemResponseStatus)),
  //   failed: []
  // };
  console.log('deleteItems', items);
  const response = await api.post<BulkResponseOut<ItemResponseStatus>>(`/families/${familyId}/items/bulk-delete`, items);
  return response.data;
  // return fakeResponse; // For now, return the fake response
};

export const deleteItem = async (familyId: number, itemId: string): Promise<{ message: string }> => {
  const response = await api.delete(`/families/${familyId}/items/${itemId}`);
  return response.data;
};


// export const bulkDeleteItems = async (familyId: number, itemIds: string[]): Promise<BulkResponseOut<ItemOut>> => {
//   const response = await api.post<BulkResponseOut<ItemOut>>(`/families/${familyId}/items/bulk-delete`, { itemIds });
//   return response.data;
// };


export const addTagsToItems = async (familyId: number, itemIds: string[], tagIds: string[]): Promise<BulkResponseOut<ItemOut>> => {
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


export const aiDraftGenerateItems = async (
  familyId: number, 
  request: AIDraftGenerateRequest
): Promise<AIDraftGenerateResponse> => {
  const response = await api.post<AIDraftGenerateResponse>(`/families/${familyId}/items/ai-input`, request);
  const res = response.data;
  res.itemCreate.forEach(item => {
    item.id = item.id.toString();
    item.tagIds = Array.from(item.tags?.map(tag => tag.id.toString()) || []);
  });
  return res;
}