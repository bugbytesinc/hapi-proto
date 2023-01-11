import {
  as_transaction_id_keystring,
  type TransactionIdKeyString,
} from "@bugbytes/hapi-util";
import { SignedTransaction, TransactionReceipt, type TransactionID } from "@bugbytes/hapi-proto";
import type { TransactionInfo } from "./transaction-info";
import { MempoolError } from "./mempool-error";
import type { MempoolInfo } from "./mempool-info";
import { TransactionSummary } from "./transaction-summary";

export class MempoolRestClient {
  private readonly mempoolHostname: string;

  constructor(mempoolHostname: string) {
    if (!mempoolHostname) {
      throw new Error("Mempool Node URL is required.");
    }
    if (
      !mempoolHostname.startsWith("https://") &&
      !mempoolHostname.startsWith("http://")
    ) {
      throw new Error(
        "Invalid Memepool Node URL, must start with https:// or http://"
      );
    }
    this.mempoolHostname = mempoolHostname.endsWith("/")
      ? mempoolHostname.substring(0, mempoolHostname.length - 1)
      : mempoolHostname;
  }
  async getInfo(): Promise<MempoolInfo> {
    const response = await fetch(`${this.mempoolHostname}/Info`);
    if (!response.ok) {
      throw await MempoolError.create(response);
    }
    return (await response.json()) as MempoolInfo;
  }
  async getTransactions(): Promise<TransactionSummary[]> {
    const response = await fetch(`${this.mempoolHostname}/Transactions`);
    if (!response.ok) {
      throw await MempoolError.create(response);
    }
    return (await response.json()) as TransactionSummary[];
  }
  async getSignedTransaction(
    transactionId: TransactionID | TransactionIdKeyString
  ): Promise<SignedTransaction> {
    const response = await fetch(
      `${this.mempoolHostname}/Transactions/${as_transaction_id_keystring(
        transactionId
      )}/protobuf`
    );
    if (!response.ok) {
      throw await MempoolError.create(response);
    }
    const data = await response.arrayBuffer();
    return SignedTransaction.decode(new Uint8Array(data));
  }
  async getTransactionStatus(
    transactionId: TransactionID | TransactionIdKeyString
  ): Promise<TransactionInfo> {
    const response = await fetch(
      `${this.mempoolHostname}/Transactions/${as_transaction_id_keystring(
        transactionId
      )}`
    );
    if (!response.ok) {
      throw await MempoolError.create(response);
    }
    return (await response.json()) as TransactionInfo;
  }
  async getTransactionReceipt(
    transactionId: TransactionID | TransactionIdKeyString
  ): Promise<TransactionReceipt> {
    const response = await fetch(
      `${this.mempoolHostname}/Transactions/${as_transaction_id_keystring(
        transactionId
      )}/receipt`
    );
    if (!response.ok) {
      throw await MempoolError.create(response);
    }
    const data = await response.arrayBuffer();
    return TransactionReceipt.decode(new Uint8Array(data));
  }
  async submitTransaction(
    signedTransactionBytes: Uint8Array
  ): Promise<Uint8Array> {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/octet-stream",
        Accept: "application/octet-stream",
      },
      body: signedTransactionBytes,
    };
    const response = await fetch(
      `${this.mempoolHostname}/Transactions`,
      options
    );
    if (!response.ok) {
      throw await MempoolError.create(response);
    }
    const data = await response.arrayBuffer();
    return new Uint8Array(data);
  }
}
