export function clockTimestamp() {
    const miliseconds = Date.now();
    const seconds = ~~(miliseconds / 1_000);
    const nanos = (miliseconds % 1000) * 1_000_000;
    return { seconds, nanos };
}