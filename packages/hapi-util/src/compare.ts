export function sequence_starts_with(seq: Uint8Array, pattern: Uint8Array): boolean {
    if (pattern.length > seq.length) {
        return false;
    }
    for (let i = 0; i < pattern.length; i++) {
        if (seq[i] !== pattern[i]) {
            return false;
        }
    }
    return true;
}

export function sequences_are_equal(l: Uint8Array | undefined, r: Uint8Array | undefined): boolean {
    if (l === r) {
        return true;
    }
    if (!l || !r) {
        return false;
    }
    if (l.length !== r.length) {
        return false;
    }
    for (let i = 0; i < l.length; i++) {
        if (l[i] !== r[i]) {
            return false;
        }
    }
    return true;
}