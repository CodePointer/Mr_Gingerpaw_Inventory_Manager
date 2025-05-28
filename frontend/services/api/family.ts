import api from "../utils/axiosInstance";
import {
  FamilyCreate,
  FamilyOut,
  FamilyUpdate,
  UserOut,
  LocationOut
} from "../types";


export const getFamilies = async (): Promise<FamilyOut[]> => {
  const response = await api.get("/families/");
  return response.data;
};


export const getFamilyDetails = async (familyId: number): Promise<FamilyOut> => {
  const response = await api.get<FamilyOut>(`/families/${familyId}`);
  return response.data;
};


export const createFamily = async (data: FamilyCreate): Promise<FamilyOut> => {
  const response = await api.post("/families/", data);
  return response.data;
};


export const updateFamily = async (familyId: number, data: FamilyUpdate): Promise<FamilyOut> => {
  const response = await api.put(`/families/${familyId}`, data);
  return response.data;
};


export const deleteFamily = async (familyId: number): Promise<FamilyOut> => {
  const response = await api.delete(`/families/${familyId}`);
  return response.data;
};


export const getFamilyMembers = async (familyId: number): Promise<UserOut[]> => {
  const response = await api.get(`/families/${familyId}/members`);
  return response.data;
};


export const getFamilyLocations = async (familyId: number): Promise<LocationOut[]> => {
  const response = await api.get(`/families/${familyId}/locations`);
  return response.data;
};
