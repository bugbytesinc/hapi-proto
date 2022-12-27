import type { TimestampKeyString } from "@bugbytes/hapi-util";
import type { ChannelInfo } from "./channel-info";

export interface MempoolInfo {
  mirror_node: string;
  channels: ChannelInfo[];
  timestamp: TimestampKeyString;
  transaction_count: number;
}
