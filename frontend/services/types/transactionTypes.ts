// 交易创建请求
export interface TransactionCreate {
  itemId: string;
  userId: number;
  changeType: "ADD" | "REMOVE";
  quantity: number;
  notes?: string;
  rawInput?: string;
}

// 交易信息
export interface TransactionOut {
  id: number;
  itemId: string;
  userId: number;
  changeType: "ADD" | "REMOVE";
  quantity: number;
  notes?: string;
  rawInput?: string;
  timestamp: string;
}

