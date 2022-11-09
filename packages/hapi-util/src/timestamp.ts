import type { Timestamp } from "@bugbytes/hapi-proto";

export type TimestampKeyString = `${number}.${number}`;
export const EmptyTimestampKeyString: TimestampKeyString = "0.0";

export function timestamp_to_keyString(timestamp: Timestamp | undefined): TimestampKeyString {
    if (timestamp) {
        const seconds = timestamp.seconds || 0;
        const nanos = timestamp.nanos || 0;
        /* @ts-ignore */
        return `${seconds.toFixed(0)}.${nanos.toFixed(0).padStart(9, '0')}`;
    }
    return EmptyTimestampKeyString;
}

export function date_to_keyString(date: Date | undefined): TimestampKeyString {
	if (date) {
		const miliseconds = date.getTime();
		const seconds = Math.floor(miliseconds / 1000);
		const nanos = (miliseconds % 1000) * 1000;
        /* @ts-ignore */
		return `${seconds.toFixed(0)}.${nanos.toFixed(0).padStart(9, '0')}`;
	}
    return EmptyTimestampKeyString;
}

export function keyString_to_timestamp(timestamp: TimestampKeyString): Timestamp {
    if (/^\d+\.\d+$/.test(timestamp)) {
        const [secondsAsString, nanosAsString] = timestamp.split('.');
        const seconds = parseInt(secondsAsString, 10);
        const nanos = parseInt(nanosAsString, 10);
        return { seconds, nanos };
    }
    throw new Error('Invalid String Format for Timestamp');
}

export function is_timestamp(value: string): value is TimestampKeyString {
    if (/^\d+\.\d+$/.test(value)) {
        return true;
    }
    return false;
}

export function keyString_to_localeDateTimeString(timestamp: TimestampKeyString): string {
    const [secondsAsString, nanosecondsAsString] = timestamp.split('.');
    const seconds = parseInt(secondsAsString, 10);
    const nanoseconds = parseInt(nanosecondsAsString, 10);
    const date = new Date(seconds * 1000 + nanoseconds / 1000000.0);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
}

