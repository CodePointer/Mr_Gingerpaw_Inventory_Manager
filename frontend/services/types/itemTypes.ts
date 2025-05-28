import { TagOut } from "./tagTypes";


// 物品创建请求
export interface ItemCreate {
  name: string;
  unit: string;
  quantity: number;
  location: string;
  familyId: number;
  ownerId: number;
  notes?: string;
  rawInput?: string;
  checkIntervalDays?: number;
  restockThreshold?: number;
  tags?: number[];
}

// 物品信息
export interface ItemOut {
  id: number;
  name: string;
  unit: string;
  quantity: number;
  location: string;
  familyId: number;
  ownerId: number;
  tags?: TagOut[];
  notes?: string;
  rawInput?: string;
  checkIntervalDays?: number;
  lastCheckedDate?: string;
  restockThreshold?: number;
}

// 物品更新请求
export interface ItemUpdate {
  name?: string;
  unit?: string;
  location?: string;
  familyId: number;
  ownerId: number;
  notes?: string;
  checkIntervalDays?: number;
  restockThreshold?: number;
  tags?: number[];
}
