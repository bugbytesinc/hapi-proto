import { EntityIdKeyString } from "@bugbytes/hapi-util";

export type KnownNetwork = "testnet" | "mainnet" | "previewnet";

export interface WalletMetadata {
  accountIds: EntityIdKeyString[];
  id: string;
  metadata: {
    description: string;
    icon: string;
    name: string;
    publicKey: string;
    url: string;
  };
  network: KnownNetwork
  secret: string;
  topic: string;
}
