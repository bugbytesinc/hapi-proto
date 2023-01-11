import { ResponseCodeEnum } from "@bugbytes/hapi-proto";
import type {
  EntityIdKeyString,
  TimestampKeyString,
  TransactionIdKeyString,
} from "@bugbytes/hapi-util";
import { MempoolTransactionStatus } from "./mempool-transaction-status";

export interface TransactionInfo {
  transaction_id: TransactionIdKeyString;
  node: EntityIdKeyString;
  duration: number;
  type: string;
  status: MempoolTransactionStatus;
  precheck_code: ResponseCodeEnum | -1 | -2;
  signed_by: string[];
  history: [
    {
      timestamp: TimestampKeyString;
      description: string;
    }
  ];
}
