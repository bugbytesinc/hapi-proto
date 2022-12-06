import { createEmitter, Emitter, SealedEvent } from "ts-typed-events";


export class Relay {
  
  private readonly url: string;
  private socket!: WebSocket;
  private readonly emitConnected: Emitter<undefined, SealedEvent<undefined>>;
  private readonly emitDisconnected: Emitter<undefined, SealedEvent<undefined>>;
  private readonly emitReceived: Emitter<string, SealedEvent<string>>;
  public readonly received: SealedEvent<string>;
  public readonly connected: SealedEvent<undefined>;
  public readonly disconnected: SealedEvent<undefined>;

  public get isOpen() {
    return this.socket.readyState === WebSocket.OPEN;
  }

  constructor(url = "wss://hashconnect.hashpack.app") {
    this.url = url;
    this.emitConnected = createEmitter();
    this.emitDisconnected = createEmitter();
    this.emitReceived = createEmitter<string>();
    this.received = this.emitReceived.event;
    this.connected = this.emitConnected.event;
    this.disconnected = this.emitDisconnected.event;  
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
