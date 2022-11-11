import { WalletMetadata } from "./wallet-metadata";


export interface ConnectionInfo {
  topic: string | undefined;
  secret: string | undefined;
  pairedWallet: WalletMetadata | undefined;
}
