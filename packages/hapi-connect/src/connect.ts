import type { EntityIdKeyString } from "@bugbytes/hapi-util";
import { createParingString, HashConnectClient } from "./client";
import { type TransactionResponse } from "./transaction-response";
import { ConnectionInfo } from "./connection-info";
import { PairRequest } from "./pair-request";
import type { KnownNetwork, WalletMetadata } from "./wallet-metadata";
declare global {
  interface Crypto {
    randomUUID: () => string;
  }
}

const HASHCONNECT_KEY = "hashconnect.data";

let client: HashConnectClient | null = null;
let connection: ConnectionInfo = {
  topic: undefined,
  secret: undefined,
  pairedWallet: undefined
};

export function initializeHashconnect(): WalletMetadata | undefined {
  const value = localStorage?.getItem(HASHCONNECT_KEY);
  if (value) {
    connection = JSON.parse(value) as ConnectionInfo;
  }
  if (!connection.topic || !connection.secret || !connection.pairedWallet) {
    connection.topic = crypto.randomUUID();
    connection.secret = crypto.randomUUID();
    connection.pairedWallet = undefined;
    localStorage?.setItem(HASHCONNECT_KEY, JSON.stringify(connection));
  }
  client = new HashConnectClient();
  client.connect(connection.topic, connection.secret);
  return connection.pairedWallet;
}

export function openPairRequest(name: string, description: string, network: KnownNetwork): PairRequest {
  closeWallet();
  const cachedRequestTopic = connection.topic!;
  const pairingString = createParingString(connection.topic!, connection.secret!, name, description, network);
  const pairCompleted = client!.waitForPairing(cachedRequestTopic).then((metadata) => {
    // Check that we have a response for the latest paring request.
    if (cachedRequestTopic === connection.topic) {
      connection.pairedWallet = metadata;
      localStorage?.setItem(HASHCONNECT_KEY, JSON.stringify(connection));
    }
    return metadata;
  });
  return { pairingString, pairCompleted };
}

export function closeWallet(): void {
  if (!client) {
    throw new Error("Hash Connect has not been initialized.");
  }
  if (connection.pairedWallet) {
    connection.topic = crypto.randomUUID();
    connection.secret = crypto.randomUUID();
    connection.pairedWallet = undefined;
    localStorage?.setItem(HASHCONNECT_KEY, JSON.stringify(connection));
    client = new HashConnectClient();
    client.connect(connection.topic, connection.secret);
  }
}

export function getConnectedAccount(): EntityIdKeyString {
  if (!client) {
    throw new Error("Hash Connect has not been initialized.");
  }
  return connection.pairedWallet!.accountIds[0] as EntityIdKeyString
}

export function sendTransaction(transaction: Uint8Array, returnTransaction = false): Promise<TransactionResponse> {
  if (!client) {
    throw new Error("Hash Connect has not been initialized.");
  }
  return client.sendTransaction(connection.topic!, transaction, connection.pairedWallet!.accountIds[0], returnTransaction);
}

