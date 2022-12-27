import type {
  EntityIdKeyString,
  TimestampKeyString,
  TransactionIdKeyString,
} from "@bugbytes/hapi-util";

export interface TransactionInfo {
  transaction_id: TransactionIdKeyString;
  node: EntityIdKeyString;
  duration: number;
  type: string;
  status: string;
  precheck_code: number | null;
  signed_by: string[];
  history: [
    {
      timestamp: TimestampKeyString;
      description: string;
    }
  ];
}
