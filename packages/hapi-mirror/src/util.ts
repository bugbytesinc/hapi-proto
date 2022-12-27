import { Key } from '@bugbytes/hapi-proto';
import * as ed from '@noble/ed25519';
import { MirrorKey } from "./types";

export function mirrorString_to_publicKey(key: MirrorKey | null): Key {
    if (key && key.key) {
        const bytes = ed.utils.hexToBytes(key.key);
        switch (key?._type) {
            case "ED25519":
                return { key: { $case: "ed25519", ed25519: bytes } };
            case "ECDSA_SECP256K1":
                return { key: { $case: "ECDSASecp256k1", ECDSASecp256k1: bytes } };
            case "ProtobufEncoded":
                return Key.decode(bytes);
        }
    }
    return { key: { $case: "keyList", keyList: { keys: [] } } };
}