import * as ed from '@noble/ed25519';
import type { AccountID, ContractID, FileID, ScheduleID, TokenID, TopicID } from "@bugbytes/hapi-proto";

export type EntityIdKeyString = `${number}.${number}.${number}` | `${number}.${number}.${string}`;
export const EmptyEntityId: EntityIdKeyString = "0.0.0";

export function accountID_to_keyString(account: AccountID): EntityIdKeyString {
    switch (account.account?.$case) {
        case 'accountNum':
            return `${account.shardNum}.${account.realmNum}.${account.account.accountNum}`;
        case 'alias':
            return `${account.shardNum}.${account.realmNum}.${ed.utils.bytesToHex(account.account.alias)}`;
        default:
            throw Error(`Entity type not supported yet.`);
    }
}

export function tokenID_to_keyString(token: TokenID): EntityIdKeyString {
    return `${token.shardNum}.${token.realmNum}.${token.tokenNum}`;
}

export function scheduleID_to_keyString(schedule: ScheduleID): EntityIdKeyString {
    return `${schedule.shardNum}.${schedule.realmNum}.${schedule.scheduleNum}`;
}

export function topicID_to_keyString(token: TopicID): EntityIdKeyString {
    return `${token.shardNum}.${token.realmNum}.${token.topicNum}`;
}

export function contractID_to_keyString(contract: ContractID): EntityIdKeyString {
    switch (contract.contract?.$case) {
        case 'contractNum':
            return `${contract.shardNum}.${contract.realmNum}.${contract.contract.contractNum}`;
        case 'evmAddress':
            return `${contract.shardNum}.${contract.realmNum}.${ed.utils.bytesToHex(contract.contract.evmAddress)}`;
        default:
            throw Error(`Entity type not supported yet.`);
    }
}

export function keyString_to_accountID(address: EntityIdKeyString): AccountID {
    const [shard, realm, num] = address.split('.');
    const shardNum = parseInt(shard, 10);
    const realmNum = parseInt(realm, 10);
    const accountNum = parseInt(num, 10);
    return { shardNum, realmNum, account: { $case: 'accountNum', accountNum } };
}

export function keyString_to_tokenID(address: EntityIdKeyString): TokenID {
    const [shard, realm, num] = address.split('.');
    const shardNum = parseInt(shard, 10);
    const realmNum = parseInt(realm, 10);
    const tokenNum = parseInt(num, 10);
    return { shardNum, realmNum, tokenNum };
}

export function keyString_to_contractID(address: EntityIdKeyString): ContractID {
    const [shard, realm, num] = address.split('.');
    const shardNum = parseInt(shard, 10);
    const realmNum = parseInt(realm, 10);
    const contractNum = parseInt(num, 10);
    return {
        shardNum, realmNum, contract: { $case: 'contractNum', contractNum }
    }
}

export function keyString_to_fileID(address: EntityIdKeyString): FileID {
    const [shard, realm, num] = address.split('.');
    const shardNum = parseInt(shard, 10);
    const realmNum = parseInt(realm, 10);
    const fileNum = parseInt(num, 10);
    return { shardNum, realmNum, fileNum }
}

export function keyString_to_topicID(address: EntityIdKeyString): TopicID {
    const [shard, realm, num] = address.split('.');
    const shardNum = parseInt(shard, 10);
    const realmNum = parseInt(realm, 10);
    const topicNum = parseInt(num, 10);
    return { shardNum, realmNum, topicNum }
}

export function is_entity_id(value: string): value is EntityIdKeyString {
    if (/^\d+\.\d+\.\d+$/.test(value)) {
        return true;
    } else if (/^\d+\.\d+\.[0-9a-fA-F]+$/.test(value)) {
        return true;
    }
    return false;
}