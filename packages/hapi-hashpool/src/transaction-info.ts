import { ResponseCodeEnum } from "@bugbytes/hapi-proto";
import type {
  EntityIdKeyString,
  TimestampKeyString,
  TransactionIdKeyString,
} from "@bugbytes/hapi-util";
import { HashpoolTransactionStatus } from "./hashpool-transaction-status";

export interface TransactionInfo {
  transaction_id: TransactionIdKeyString;
  node: EntityIdKeyString;
  duration: number;
  type: string;
  status: HashpoolTransactionStatus;
  precheck_code: ResponseCodeEnum | -1 | -2;
  signed_by: string[];
  history: [
    {
      timestamp: TimestampKeyString;
      description: string;
    }
  ];
}
