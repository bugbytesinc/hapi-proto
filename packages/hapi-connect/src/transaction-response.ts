
export interface TransactionResponse {
  topic: string;
  id: string;
  success: boolean;
  receipt: string;
  signedTransaction: Uint8Array | undefined;
  error: any | string | undefined;
}
