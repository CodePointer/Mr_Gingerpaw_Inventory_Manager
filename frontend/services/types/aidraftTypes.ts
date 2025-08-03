// aiDraftTypes.ts

import { ItemOut } from "./itemTypes";
import { TransactionCreate } from "./transactionTypes";

export interface AIDraftFormModalValues {
  queryId: string;
  queryType: string;
  queries: string[];
}


export interface AIDraftGenerateRequest {
  queryId: string;
  queryType: string;
  queries: string[];
  familyId: number;
}


export interface AIDraftGenerateResponse {
  queryId: string;
  itemCreate: ItemOut[];
  itemTransaction: TransactionCreate[];
}
