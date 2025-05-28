import api from "@/services/utils/axiosInstance";
import { TransactionCreate, TransactionOut } from "@/services/types";


export const submitTransactions = async (
  familyId: number, 
  drafts: TransactionCreate[]
): Promise<TransactionOut[]> => {
  const response = await api.post(`/families/${familyId}/transactions/batch`, drafts);
  return response.data;
};


// // 创建单条交易
// export const createTransaction = async (familyId: number, data: TransactionCreate): Promise<TransactionOut> => {
//     const response = await axios.post<TransactionOut>(`/families/${familyId}/transactions/`, data);
//     return response.data;
// };

// // 批量创建交易
// export const createBulkTransactions = async (familyId: number, data: TransactionCreate[]): Promise<BulkResponseOut<TransactionOut>> => {
//     const response = await axios.post<BulkResponseOut<TransactionOut>>(`/families/${familyId}/transactions/batch`, data);
//     return response.data;
// };

// // 获取单条交易详情
// export const getTransaction = async (familyId: number, transactionId: number): Promise<TransactionOut> => {
//     const response = await axios.get<TransactionOut>(`/families/${familyId}/transactions/${transactionId}`);
//     return response.data;
// };

// // 更新交易信息
// export const updateTransaction = async (familyId: number, transactionId: number, data: TransactionUpdate): Promise<TransactionOut> => {
//     const response = await axios.put<TransactionOut>(`/families/${familyId}/transactions/${transactionId}`, data);
//     return response.data;
// };

// // 删除交易
// export const deleteTransaction = async (familyId: number, transactionId: number): Promise<{ message: string }> => {
//     const response = await axios.delete(`/families/${familyId}/transactions/${transactionId}`);
//     return response.data;
// };
