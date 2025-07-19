import { ItemOut, ItemUpdate } from "./itemTypes";
import { LocationOut } from "./membershipTypes";
import { TransactionCreate } from "./transactionTypes";

// 交易更新请求
export interface DraftUpdate {
  title?: string;
  rawInput?: string;
  status?: "pending" | "processing" | "reviewing";
}


export interface DraftOut {
  id: number;  // Timestamp
  title: string;
  type: "manual" | "ai";
  rawInput: string | null;
  createdAt: Date;
  updatedAt: Date;

  items: Record<string, ItemOut>;  // id: name + unit + location
  itemUpdates: Record<number, ItemUpdate>;        // id: itemId
  transactions: Record<number, TransactionCreate>;  // id: itemId
  // locations: EntityMapWithKey<LocationOut>;

  status: "pending" | "processing" | "reviewing";
}

export interface DraftCreate {
  title: string;
  type: "manual" | "ai";
  rawInput: string | null;
}