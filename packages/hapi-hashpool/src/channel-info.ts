import type { EntityIdKeyString } from "@bugbytes/hapi-util";

export interface ChannelInfo {
  account: EntityIdKeyString;
  endpoints: string[];
}
