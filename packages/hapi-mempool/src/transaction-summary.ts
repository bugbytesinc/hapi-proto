import type {
  EntityIdKeyString,
  TransactionIdKeyString,
} from "@bugbytes/hapi-util";

export interface TransactionSummary {
  transaction_id: TransactionIdKeyString;
  node: EntityIdKeyString;
  duration: number;
  type: string;
  status: string;
  precheck_code: string | null;
}
