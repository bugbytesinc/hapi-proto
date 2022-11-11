import type { AccountID, Timestamp, TransactionID } from "@bugbytes/hapi-proto";
import { accountID_to_keyString, keyString_to_accountID, is_entity_id } from "./entity";
import { is_timestamp, keyString_to_timestamp, timestamp_to_keyString } from "./timestamp";

export type TransactionIdKeyString = `${number}.${number}.${number}@${number}.${number}` |
    `${number}.${number}.${number}@${number}.${number}:${number}` |
    `${number}.${number}.${number}@${number}.${number}+scheduled` |
    `${number}.${number}.${number}@${number}.${number}:${number}+scheduled`;

export const EmptyTransactionIdKeyString: TransactionIdKeyString = '0.0.0@0.0';
export const EmptyTransactionIdMirrorKeyString: string = '0.0.0-0-0';

export function transactionID_to_keyString(transactionID: TransactionID | undefined): TransactionIdKeyString {
    if (transactionID && transactionID.accountID) {
        let value = `${accountID_to_keyString(transactionID.accountID)}@${timestamp_to_keyString(transactionID.transactionValidStart)}`;
        if (transactionID.nonce) {
            value = value + `:${transactionID.nonce}`;
        }
        if (transactionID.scheduled) {
            value = value + "+scheduled";
        }
        /* @ts-ignore */
        return value;
    }
    return EmptyTransactionIdKeyString;
}

export function keyString_to_transactionID(txId: TransactionIdKeyString): TransactionID {
    if (is_transaction_id(txId)) {
        const { scheduled, remainder: value1 } = parseOutScheduled(txId);
        const { nonce, remainder: value2 } = parseOutNonce(value1);
        const { accountID, transactionValidStart } = parseOutAccountAndTimestamp(value2);
        return { transactionValidStart, accountID, scheduled, nonce }
    }
    throw new Error("Unable to parse transaction key string.");
}

export function is_transaction_id(value: string): value is TransactionIdKeyString {
    if (/^\d+\.\d+\.\d+@\d+\.\d+(:\d+)?(\+scheduled)?$/.test(value)) {
        return true;
    }
    return false;
}

export function as_transaction_id_keystring(value: TransactionID | TransactionIdKeyString | string): TransactionIdKeyString {
    if (value) {
        if (typeof value === 'string') {
            if (is_transaction_id(value)) {
                return value;
            }
        } else {
            return transactionID_to_keyString(value);
        }
    }
    return EmptyTransactionIdKeyString;
}

export function transactionID_to_mirrorKeyString(transactionID: TransactionID | undefined): string {
    if (transactionID && transactionID.accountID && transactionID.transactionValidStart) {
        return `${accountID_to_keyString(transactionID.accountID)}-${transactionID.transactionValidStart.seconds.toFixed(0)}-${transactionID.transactionValidStart.nanos.toFixed(0).padStart(9, '0')}`;
    }
    return EmptyTransactionIdMirrorKeyString;
}


function parseOutScheduled(value: string): { scheduled: boolean, remainder: string } {
    if (value.endsWith('+scheduled')) {
        return { scheduled: true, remainder: value.substring(0, value.length - 10) };
    }
    return { scheduled: false, remainder: value };
}

function parseOutNonce(value: string): { nonce: number, remainder: string } {
    var parts = value.split(':');
    if (parts.length == 1) {
        return { nonce: 0, remainder: value };
    }
    if (parts.length === 2) {
        const nonce = parseInt(parts[1]);
        if (!isNaN(nonce) && nonce >= 0) {
            return { nonce, remainder: parts[0] };
        }
    }
    throw new Error("Unable to parse nonce from transaction key string.");
}

function parseOutAccountAndTimestamp(value: string): { accountID: AccountID, transactionValidStart: Timestamp } {
    var parts = value.split('@');
    if (parts.length == 2 && is_entity_id(parts[0]) && is_timestamp(parts[1])) {
        const accountID = keyString_to_accountID(parts[0]);
        const transactionValidStart = keyString_to_timestamp(parts[1]);
        return { accountID, transactionValidStart };
    }
    throw new Error("Unable to parse key string into a transaction id.");
}

