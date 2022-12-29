import * as ed from '@noble/ed25519';

export function createRandomId() {
    return ed.utils.bytesToHex(ed.utils.randomBytes(20));
}