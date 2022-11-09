import type { AccountID, ContractID, Timestamp, TokenID, TopicID, TransactionID } from '@bugbytes/hapi-proto';
import { accountID_to_keyString, contractID_to_keyString, tokenID_to_keyString, keyString_to_transactionID, type EntityIdKeyString, type TransactionIdKeyString, transactionID_to_mirrorKeyString, topicID_to_keyString, TimestampKeyString, timestamp_to_keyString } from '@bugbytes/hapi-util';
import { MirrorError } from './mirror-error';
import type { components } from './openapi';

export type NodeInfo = components["schemas"]["NetworkNode"];
export type NodeInfoIterator = AsyncGenerator<NodeInfo, void, unknown>;
export type ContractInfo = components["schemas"]["Contract"];
export type AccountInfo = components["schemas"]["AccountInfo"];
export type TokenInfo = components["schemas"]["TokenInfo"];
export type ContractResult = components["schemas"]["ContractResult"];
export type MessageInfo = components["schemas"]["TopicMessage"];
export type TransactionInfo = components["schemas"]["Transaction"];
export type TokenBalanceInfo = { timestamp: TimestampKeyString, account: EntityIdKeyString, token: EntityIdKeyString, balance: number };

type NodeInfoListResponse = components["schemas"]["NetworkNodesResponse"];
type MessageInfoListResponse = components["schemas"]["TopicMessagesResponse"];
type TokenBalanceListResponse = components["schemas"]["TokenBalancesResponse"];
type TransactionsListResponse = components["schemas"]["TransactionsResponse"];

export class MirrorRestClient {
	private readonly mirrorHostname: string;

	constructor(mirrorHostname: string) {
		if (!mirrorHostname) {
			throw new Error('Mirror Node Hostname is required.');
		}
		this.mirrorHostname = (mirrorHostname.endsWith('/') ? mirrorHostname.substring(0, mirrorHostname.length - 1) : mirrorHostname);
	}

	async * getNodes(): NodeInfoIterator {
		let path = '/api/v1/network/nodes';
		while (path) {
			const response = await fetch(this.mirrorHostname + path);
			if (!response.ok) {
				throw new MirrorError(response.statusText, response.status);
			}
			const payload = await response.json() as NodeInfoListResponse;
			for (const item of payload.nodes) {
				yield item;
			}
			path = payload.links.next || '';
		}
	}

	async getLatestTransaction(): Promise<TransactionInfo> {
		const path = '/api/v1/transactions?limit=1&order=desc';
		const response = await fetch(this.mirrorHostname + path);
		if (!response.ok) {
			throw new MirrorError(response.statusText, response.status);
		}
		const payload = await response.json() as TransactionsListResponse;
		if (payload.transactions && payload.transactions.length > 0) {
			return payload.transactions[0];
		}
		throw new MirrorError('No Transactions found.', 400);
	}


	async getAccountInfo(accountId: EntityIdKeyString | AccountID): Promise<AccountInfo> {
		const accountKey = (typeof accountId === 'string') ? accountId : accountID_to_keyString(accountId);
		const path = `/api/v1/accounts/${accountKey}`;
		const response = await fetch(this.mirrorHostname + path);
		if (!response.ok) {
			throw new MirrorError(response.statusText, response.status);
		}
		return await response.json() as AccountInfo;
	}

	async getContractInfo(contractId: EntityIdKeyString | ContractID): Promise<ContractInfo> {
		const contractKey = (typeof contractId === 'string') ? contractId : contractID_to_keyString(contractId);
		const path = `/api/v1/contracts/${contractKey}`;
		const response = await fetch(this.mirrorHostname + path);
		if (!response.ok) {
			throw new MirrorError(response.statusText, response.status);
		}
		return await response.json() as ContractInfo;
	}

	async getTokenInfo(tokenId: EntityIdKeyString | TokenID): Promise<TokenInfo> {
		const tokenKey = (typeof tokenId === 'string') ? tokenId : tokenID_to_keyString(tokenId);
		const path = `/api/v1/tokens/${tokenKey}`;
		const response = await fetch(this.mirrorHostname + path);
		if (!response.ok) {
			throw new MirrorError(response.statusText, response.status);
		}
		return await response.json() as TokenInfo;
	}

	async getTokenBalance(accountId: EntityIdKeyString | AccountID, tokenId: EntityIdKeyString | TokenID, timestamp: TimestampKeyString | Timestamp | undefined): Promise<TokenBalanceInfo> {
		const accountKey = (typeof accountId === 'string') ? accountId : accountID_to_keyString(accountId);
		const tokenKey = (typeof tokenId === 'string') ? tokenId : tokenID_to_keyString(tokenId);
		const timestampKey = timestamp ? ((typeof timestamp === 'string') ? timestamp : timestamp_to_keyString(timestamp)) : undefined;
		const path = timestampKey ?
			`/api/v1/tokens/${tokenKey}/balances?account.id=${accountKey}&timestamp=lte:${timestamp}` :
			`/api/v1/tokens/${tokenKey}/balances?account.id=${accountKey}`;
		const response = await fetch(this.mirrorHostname + path);
		if (!response.ok) {
			throw new MirrorError(response.statusText, response.status);
		}
		const payload = await response.json() as TokenBalanceListResponse;
		const record = payload.balances?.find(b => (b.account as unknown as EntityIdKeyString) === accountKey);
		if (record) {
			return {
				timestamp: payload.timestamp as unknown as TimestampKeyString,
				account: accountKey,
				token: tokenKey,
				balance: record.balance
			}
		}
		throw new MirrorError('No Associated Token Balance.', 404);
	}

	async getContractResult(transactionId: TransactionIdKeyString | TransactionID): Promise<ContractResult> {
		const tx = (typeof transactionId === 'string') ? keyString_to_transactionID(transactionId) : transactionId;
		const path = `/api/v1/contracts/results/${transactionID_to_mirrorKeyString(tx)}`;
		const response = await fetch(this.mirrorHostname + path);
		if (!response.ok) {
			throw new MirrorError(response.statusText, response.status);
		}
		return await response.json() as ContractResult;
	}

	async getMessage(topicId: EntityIdKeyString | TopicID, sequenceNumber: number): Promise<MessageInfo> {
		const topicKey = (typeof topicId === 'string') ? topicId : topicID_to_keyString(topicId);
		const path = `/api/v1/topics/${topicKey}/messages/${sequenceNumber}`;
		const response = await fetch(this.mirrorHostname + path);
		if (!response.ok) {
			throw new MirrorError(response.statusText, response.status);
		}
		return await response.json() as MessageInfo;
	}

	async getLatestMessage(topicId: EntityIdKeyString | TopicID): Promise<MessageInfo> {
		const topicKey = (typeof topicId === 'string') ? topicId : topicID_to_keyString(topicId);
		const path = `/api/v1/topics/${topicKey}/messages?limit=1&order=desc`;
		const response = await fetch(this.mirrorHostname + path);
		if (!response.ok) {
			throw new MirrorError(response.statusText, response.status);
		}
		const payload = await response.json() as MessageInfoListResponse;
		if (payload.messages && payload.messages.length > 0) {
			return payload.messages[0];
		}
		throw new MirrorError('No Messages Found.', 404);
	}

}