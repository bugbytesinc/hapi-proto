import { bytesToHex, randomBytes } from '@noble/hashes/utils';

export function createRandomId() {
    return bytesToHex(randomBytes(20));
}