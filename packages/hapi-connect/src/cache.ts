import { createParingString, HashConnectClient } from "./client";
import { type TransactionResponse } from "./transaction-response";
import { ConnectionInfo } from "./connection-info";
import { PairRequest } from "./pair-request";
import type { KnownNetwork } from "./wallet-metadata";
import { createRandomId } from "./util";

export const DEFAULT_CACHE_KEY = "hashconnect.data";

export class HashConnectCachedClient {

  private readonly _cacheKey;
  private _client: HashConnectClient;
  private readonly _connection: ConnectionInfo;

  constructor(cacheKey = DEFAULT_CACHE_KEY) {
    const value = localStorage.getItem(cacheKey);
    const connection = !!value ? JSON.parse(value) as ConnectionInfo : {} as ConnectionInfo;
    if (!connection.topic || !connection.secret || !connection.pairedWallet) {
      connection.topic = createRandomId();
      connection.secret = createRandomId();
      connection.pairedWallet = undefined;
      localStorage.setItem(cacheKey, JSON.stringify(connection));
    }
    const client = new HashConnectClient();
    client.connect(connection.topic, connection.secret);
    this._cacheKey = cacheKey;
    this._connection = connection;
    this._client = client;
  }

  get cacheKey() {
    return this._cacheKey;
  }

  get pairedWallet() {
    return this._connection.pairedWallet;
  }

  openPairRequest(name: string, description: string, network: KnownNetwork): PairRequest {
    this.closeWallet();
    const cachedRequestTopic = this._connection.topic!;
    const pairingString = createParingString(this._connection.topic!, this._connection.secret!, name, description, network);
    const pairCompleted = this._client!.waitForPairing(cachedRequestTopic).then((metadata) => {
      // Check that we have a response for the latest paring request.
      if (cachedRequestTopic === this._connection.topic) {
        this._connection.pairedWallet = metadata;
        localStorage?.setItem(this._cacheKey, JSON.stringify(this._connection));
      }
      return metadata;
    });
    return { pairingString, pairCompleted };
  }

  closeWallet(): void {
    if (this._connection.pairedWallet) {
      this._connection.topic = createRandomId();
      this._connection.secret = createRandomId();
      this._connection.pairedWallet = undefined;
      localStorage?.setItem(this._cacheKey, JSON.stringify(this._connection));
      this._client = new HashConnectClient();
      this._client.connect(this._connection.topic, this._connection.secret);
    }
  }

  sendTransaction(transaction: Uint8Array, returnTransaction = false): Promise<TransactionResponse> {
    return this._client.sendTransaction(this._connection.topic!, transaction, this._connection.pairedWallet!.accountIds[0], returnTransaction);
  }
}
