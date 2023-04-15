import { EntityIdKeyString, TimestampKeyString } from '@bugbytes/hapi-util';
import type { components } from './openapi';

export type MirrorKey = components["schemas"]["Key"];
export type NodeInfo = components["schemas"]["NetworkNode"];
export type NodeInfoIterator = AsyncGenerator<NodeInfo, void, unknown>;
export type ContractInfo = components["schemas"]["Contract"];
export type AccountInfo = components["schemas"]["AccountInfo"];
export type TokenInfo = components["schemas"]["TokenInfo"];
export type ContractResult = components["schemas"]["ContractResult"];
export type MessageInfo = components["schemas"]["TopicMessage"];
export type TransactionInfo = components["schemas"]["Transaction"];
export type TransactionDetail = components["schemas"]["TransactionDetail"];
export type TransactionInfoIterator = AsyncGenerator<TransactionInfo, void, unknown>;
export type TokenBalanceInfo = { timestamp: TimestampKeyString, account: EntityIdKeyString, token: EntityIdKeyString, balance: number };
export type TokenRelationship = components["schemas"]["TokenRelationship"]
export type TokenRelationshipIterator = AsyncGenerator<TokenRelationship, void, unknown>;
export type Nft = components["schemas"]["Nft"]
export type NftIterator = AsyncGenerator<Nft, void, unknown>;
