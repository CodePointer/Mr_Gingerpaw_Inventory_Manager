// 交易创建请求
export interface TransactionCreate {
  itemId: number;
  userId: number;
  changeType: "ADD" | "REMOVE";
  quantity: number;
  notes?: string;
  rawInput?: string;
}

// 交易信息
export interface TransactionOut {
  id: number;
  itemId: number;
  userId: number;
  changeType: "ADD" | "REMOVE";
  quantity: number;
  notes?: string;
  rawInput?: string;
  timestamp: string;
}

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
  createdAt: Date;
  updatedAt: Date;
  rawInput: string | null;
  transactions: TransactionCreate[];
  status: "pending" | "processing" | "reviewing";
}

export interface DraftCreate {
  title: string;
  type: "manual" | "ai";
  rawInput: string | null;
}