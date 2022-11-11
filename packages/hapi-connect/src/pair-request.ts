import { WalletMetadata } from "./wallet-metadata";


export interface PairRequest {
  pairingString: string;
  pairCompleted: Promise<WalletMetadata>;
}
