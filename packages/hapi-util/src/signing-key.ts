import type { Key, SignaturePair } from '@bugbytes/hapi-proto';
import * as ed from '@noble/ed25519';
import * as secp from "@noble/secp256k1";
import { keccak_256 } from '@noble/hashes/sha3';
import { bytesToHex, concatBytes, hexToBytes } from '@noble/hashes/utils';
import { sequence_starts_with } from './compare';

const derEd25519PrivateKeyPrefix = Uint8Array.from([0x30, 0x2e, 0x02, 0x01, 0x00, 0x30, 0x05, 0x06, 0x03, 0x2b, 0x65, 0x70, 0x04, 0x22, 0x04, 0x20]);
const derEcdsaPrivateKeyPrefix = Uint8Array.from([0x30, 0x30, 0x02, 0x01, 0x00, 0x30, 0x07, 0x06, 0x05, 0x2b, 0x81, 0x04, 0x00, 0x0a, 0x04, 0x22, 0x04, 0x20]);

export type SigningKeyType = 'ed25519' | 'ECDSASecp256k1';

export type SigningKey = {
    keyType: "ed25519";
    ed25519: Uint8Array
} | {
    keyType: "ECDSASecp256k1";
    ECDSASecp256k1: Uint8Array;
}

export interface SigningKeyDisplay {
    keyType: string,
    firstWord: string;
    lastWord: string;
    publicKey: string;
}

export function signingKey_to_publicKey(privateKey: SigningKey): Key {
    switch (privateKey.keyType) {
        case "ed25519":
            return {
                key: {
                    $case: 'ed25519',
                    ed25519: ed.getPublicKey(privateKey.ed25519)
                }
            }
        case "ECDSASecp256k1":
            return {
                key: {
                    $case: 'ECDSASecp256k1',
                    ECDSASecp256k1: secp.getPublicKey(privateKey.ECDSASecp256k1)
                }
            }
    }
}

export function signingKey_to_keyString(privateKey: SigningKey): string {
    switch (privateKey.keyType) {
        case "ed25519":
            return bytesToHex(concatBytes(derEd25519PrivateKeyPrefix, privateKey.ed25519));
        case "ECDSASecp256k1":
            return bytesToHex(concatBytes(derEcdsaPrivateKeyPrefix, privateKey.ECDSASecp256k1));
    }
}

export function signingKey_to_displayable(privateKey: SigningKey): SigningKeyDisplay {
    switch (privateKey.keyType) {
        case "ed25519":
            return {
                keyType: "ed25519",
                firstWord: bytesToHex(privateKey.ed25519.slice(0, 2)),
                lastWord: bytesToHex(privateKey.ed25519.slice(-2)),
                publicKey: bytesToHex(ed.getPublicKey(privateKey.ed25519))
            };
        case "ECDSASecp256k1":
            return {
                keyType: 'Secp256k1',
                firstWord: bytesToHex(privateKey.ECDSASecp256k1.slice(0, 2)),
                lastWord: bytesToHex(privateKey.ECDSASecp256k1.slice(-2)),
                publicKey: bytesToHex(secp.getPublicKey(privateKey.ECDSASecp256k1, true))
            };
    }
}

export function keyString_to_signingKey(value: string): SigningKey {
    try {
        const bytes = hexToBytes(value);
        if (bytes.length === 48 && sequence_starts_with(bytes, derEd25519PrivateKeyPrefix)) {
            return {
                keyType: 'ed25519',
                ed25519: bytes.subarray(16)
            }
        }
        if (bytes.length === 50 && sequence_starts_with(bytes, derEcdsaPrivateKeyPrefix)) {
            return {
                keyType: 'ECDSASecp256k1',
                ECDSASecp256k1: bytes.subarray(18)
            }
        }
        if (bytes.length === 32 || bytes.length === 64) {
            return {
                keyType: 'ed25519',
                ed25519: bytes
            }
        }
    } catch {
        // fall thru
    }
    throw new Error('The signing does not appear to be a valid Ed25519 or ECDSASecp256K1 private key.');
}

export function sign(data: Uint8Array, signingKey: SigningKey): SignaturePair {
    switch (signingKey.keyType) {
        case 'ed25519': return signAsEd25519(data, signingKey.ed25519);
        case 'ECDSASecp256k1': return signAsECDSASecp256k1(data, signingKey.ECDSASecp256k1);
    }
}

export function verify(signature: SignaturePair, data: Uint8Array, publicKey: Key): boolean {
    switch (publicKey.key?.$case) {
        case 'ed25519': return verifyWithEd25519(signature, data, publicKey.key.ed25519);
        case 'ECDSASecp256k1': return verifyWithECDSASecp256k1(signature, data, publicKey.key.ECDSASecp256k1);
    }
    return false;
}

function signAsEd25519(data: Uint8Array, privateKey: Uint8Array): SignaturePair {
    const publicKey = ed.getPublicKey(privateKey);
    const signature = ed.sign(data, privateKey);
    return {
        pubKeyPrefix: publicKey,
        signature: {
            $case: 'ed25519',
            ed25519: signature
        }
    };
}

function signAsECDSASecp256k1(data: Uint8Array, privateKey: Uint8Array): SignaturePair {
    const publicKey = secp.getPublicKey(privateKey, true);
    const messageHash = keccak_256(data);
    const signature = secp.sign(messageHash, privateKey);
    return {
        pubKeyPrefix: publicKey,
        signature: {
            $case: 'ECDSASecp256k1',
            ECDSASecp256k1: signature.toCompactRawBytes()
        }
    }
}

function verifyWithEd25519(signature: SignaturePair, data: Uint8Array, publicKey: Uint8Array): boolean {
    if (signature.signature?.$case === 'ed25519') {
        return ed.verify(signature.signature.ed25519, data, publicKey);
    }
    return false;
}

function verifyWithECDSASecp256k1(signature: SignaturePair, data: Uint8Array, publicKey: Uint8Array): boolean {
    if (signature.signature?.$case === 'ECDSASecp256k1') {
        return secp.verify(signature.signature.ECDSASecp256k1, data, publicKey);
    }
    return false;
}