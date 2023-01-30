import {
  as_transaction_id_keystring,
  type TransactionIdKeyString,
} from "@bugbytes/hapi-util";
import { SignedTransaction, TransactionReceipt, type TransactionID } from "@bugbytes/hapi-proto";
import type { TransactionInfo } from "./transaction-info";
import { HashpoolError } from "./hashpool-error";
import type { HashpoolInfo } from "./hashpool-info";
import { TransactionSummary } from "./transaction-summary";

export class HashpoolRestClient {
  private readonly hashpoolHostname: string;

  constructor(hashpoolHostname: string) {
    if (!hashpoolHostname) {
      throw new Error("Hashpool Node URL is required.");
    }
    if (
      !hashpoolHostname.startsWith("https://") &&
      !hashpoolHostname.startsWith("http://")
    ) {
      throw new Error(
        "Invalid Memepool Node URL, must start with https:// or http://"
      );
    }
    this.hashpoolHostname = hashpoolHostname.endsWith("/")
      ? hashpoolHostname.substring(0, hashpoolHostname.length - 1)
      : hashpoolHostname;
  }
  async getInfo(): Promise<HashpoolInfo> {
    const response = await fetch(`${this.hashpoolHostname}/Info`);
    if (!response.ok) {
      throw await HashpoolError.create(response);
    }
    return (await response.json()) as HashpoolInfo;
  }
  async getTransactions(): Promise<TransactionSummary[]> {
    const response = await fetch(`${this.hashpoolHostname}/Transactions`);
    if (!response.ok) {
      throw await HashpoolError.create(response);
    }
    return (await response.json()) as TransactionSummary[];
  }
  async getSignedTransaction(
    transactionId: TransactionID | TransactionIdKeyString
  ): Promise<SignedTransaction> {
    const response = await fetch(
      `${this.hashpoolHostname}/Transactions/${as_transaction_id_keystring(
        transactionId
      )}/protobuf`
    );
    if (!response.ok) {
      throw await HashpoolError.create(response);
    }
    const data = await response.arrayBuffer();
    return SignedTransaction.decode(new Uint8Array(data));
  }
  async getTransactionStatus(
    transactionId: TransactionID | TransactionIdKeyString
  ): Promise<TransactionInfo> {
    const response = await fetch(
      `${this.hashpoolHostname}/Transactions/${as_transaction_id_keystring(
        transactionId
      )}`
    );
    if (!response.ok) {
      throw await HashpoolError.create(response);
    }
    return (await response.json()) as TransactionInfo;
  }
  async getTransactionReceipt(
    transactionId: TransactionID | TransactionIdKeyString
  ): Promise<TransactionReceipt> {
    const response = await fetch(
      `${this.hashpoolHostname}/Transactions/${as_transaction_id_keystring(
        transactionId
      )}/receipt`
    );
    if (!response.ok) {
      throw await HashpoolError.create(response);
    }
    const data = await response.arrayBuffer();
    return TransactionReceipt.decode(new Uint8Array(data));
  }
  async submitTransaction(
    signedTransactionBytes: Uint8Array
  ): Promise<SignedTransaction> {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/octet-stream",
        Accept: "application/octet-stream",
      },
      body: signedTransactionBytes,
    };
    const response = await fetch(
      `${this.hashpoolHostname}/Transactions`,
      options
    );
    if (!response.ok) {
      throw await HashpoolError.create(response);
    }
    const data = await response.arrayBuffer();
    return SignedTransaction.decode(new Uint8Array(data));
  }
  async addSignatures(
    transactionId: TransactionID | TransactionIdKeyString,
    signatureMapBytes: Uint8Array
  ): Promise<SignedTransaction> {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/octet-stream",
        Accept: "application/octet-stream",
      },
      body: signatureMapBytes,
    };
    const response = await fetch(
      `${this.hashpoolHostname}/Transactions/${as_transaction_id_keystring(
        transactionId
      )}/signatures`,
      options
    );
    if (!response.ok) {
      throw await HashpoolError.create(response);
    }
    const data = await response.arrayBuffer();
    return SignedTransaction.decode(new Uint8Array(data));
  }
}
