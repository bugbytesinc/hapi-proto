import * as ed from '@noble/ed25519';
import { Key } from "@bugbytes/hapi-proto";
import { sequences_are_equal, sequence_starts_with } from './compare';

const derEd25519PublicKeyPrefix = Uint8Array.from([0x30, 0x2a, 0x30, 0x05, 0x06, 0x03, 0x2b, 0x65, 0x70, 0x03, 0x21, 0x00]);
const derSecp256k1PublicKeyPrefix = Uint8Array.from([0x30, 0x2d, 0x30, 0x07, 0x06, 0x05, 0x2b, 0x81, 0x04, 0x00, 0x0a, 0x03, 0x22, 0x00]);

export interface PublicKeyDisplay {
    keyType: string,
    keyInHex: string;
    prefixInHex: string;
}

export function publicKey_to_keyString(publicKey: Key): string {
    switch (publicKey.key?.$case) {
        case "ed25519":
            return ed.utils.bytesToHex(ed.utils.concatBytes(derEd25519PublicKeyPrefix, publicKey.key.ed25519));
        case "ECDSASecp256k1":
            return ed.utils.bytesToHex(ed.utils.concatBytes(derSecp256k1PublicKeyPrefix, publicKey.key.ECDSASecp256k1));
        default:
            return ed.utils.bytesToHex(Key.encode(publicKey).finish());
    }
}

export function publicKey_to_displayable(publicKey: Key): PublicKeyDisplay {
    switch (publicKey.key?.$case) {
        case "ed25519":
            return {
                keyType: 'ed25519',
                keyInHex: ed.utils.bytesToHex(publicKey.key.ed25519),
                prefixInHex: ed.utils.bytesToHex(derEd25519PublicKeyPrefix)
            }
        case "ECDSASecp256k1":
            return {
                keyType: 'Secp256k1',
                keyInHex: ed.utils.bytesToHex(publicKey.key.ECDSASecp256k1),
                prefixInHex: ed.utils.bytesToHex(derSecp256k1PublicKeyPrefix)
            }
        default:
            return {
                keyType: 'Protobuf',
                keyInHex: publicKey_to_keyString(publicKey),
                prefixInHex: ''
            }
    }
}

export function keyString_to_publicKey(value: string): Key {
    try {
        const bytes = ed.utils.hexToBytes(value);
        if (bytes.length === 44 && sequence_starts_with(bytes, derEd25519PublicKeyPrefix)) {
            return {
                key: {
                    $case: 'ed25519',
                    ed25519: bytes.subarray(12)
                }
            }
        } else if (bytes.length === 49 && sequence_starts_with(bytes, derSecp256k1PublicKeyPrefix)) {
            return {
                key: {
                    $case: 'ECDSASecp256k1',
                    ECDSASecp256k1: bytes.subarray(12)
                }
            }
        } else {
            return Key.decode(bytes);
        }
    } catch {
        // fall thru.
    }
    throw new Error(`Invalid public key keystring.`);
}

export function publicKeys_are_same(publicKey1: Key, publicKey2: Key): boolean {
    if (publicKey1.key?.$case !== publicKey2.key?.$case) {
        return false;
    }
    switch (publicKey1.key?.$case) {
        case "ed25519":
            /* @ts-ignore */
            return sequences_are_equal(publicKey1.key.ed25519, publicKey2.key.ed25519);
        case "ECDSASecp256k1":
            /* @ts-ignore */
            return sequences_are_equal(publicKey1.key.ECDSASecp256k1, publicKey2.key.ECDSASecp256k1);
        default:
            // can optimize later.
            const proto1 = Key.encode(publicKey1).finish();
            const proto2 = Key.encode(publicKey2).finish();
            return sequences_are_equal(proto1, proto2);
    }
}
