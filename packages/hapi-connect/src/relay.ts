import { createEmitter } from "ts-typed-events";


export class Relay {
  private readonly url: string;
  private socket!: WebSocket;
  private readonly emitConnected = createEmitter();
  private readonly emitDisconnected = createEmitter();
  private readonly emitReceived = createEmitter<string>();
  public readonly received = this.emitReceived.event;
  public readonly connected = this.emitConnected.event;
  public readonly disconnected = this.emitDisconnected.event;
  public get isOpen() {
    return this.socket.readyState === WebSocket.OPEN;
  }

  constructor(url = "wss://hashconnect.hashpack.app") {
    this.url = url;
    this.connect();
  }

  send(message: string): void {
    this.socket.send(message);
  }

  private connect() {
    const socket = new WebSocket(this.url);
    socket.onopen = this.onOpen.bind(this);
    socket.onmessage = this.onMessage.bind(this);
    socket.onerror = this.onError.bind(this);
    socket.onclose = this.onClose.bind(this);
    this.socket = socket;
  }

  private onOpen() {
    this.emitConnected();
  }

  private onMessage(message: any) {
    this.emitReceived(message.data);
  }

  private onClose() {
    this.emitDisconnected();
    this.socket.onopen = null;
    this.socket.onmessage = null;
    this.socket.onerror = null;
    this.socket.onclose = null;
    this.connect();
  }

  private onError(err: any) {
    console.error(err);
  }
}
