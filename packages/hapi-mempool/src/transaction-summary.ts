import { ResponseCodeEnum } from "@bugbytes/hapi-proto";
import type {
  EntityIdKeyString,
  TransactionIdKeyString,
} from "@bugbytes/hapi-util";
import { MempoolTransactionStatus } from "./mempool-transaction-status";

export interface TransactionSummary {
  transaction_id: TransactionIdKeyString;
  node: EntityIdKeyString;
  duration: number;
  type: string;
  status: MempoolTransactionStatus;
  precheck_code: ResponseCodeEnum | -1 | -2;
}
