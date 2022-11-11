export interface RelayMessage {
  timestamp: number;
  type: string;
  data: any;
  topic: string;
}
