import ReconnectingWebSocket, { Event, Options } from 'reconnecting-websocket';
import ws from 'ws';
import { step } from 'ts-test-decorators';
import { ErrorEvent, CloseEvent } from 'reconnecting-websocket/dist/events';
import ValueGenerator from '../utils/ValueGenerator';
import { AllureCommons } from '../utils/AllureCommon';

const API_URL = process.env.API_URL || 'localhost:8080';
const SOCKET_PING_INTERVAL = +process.env.SOCKET_PING_INTERVAL || 20000;

export class SocketClient {
  socket: ReconnectingWebSocket;
  private pingTimer: NodeJS.Timeout;
  idMap = new Map<string, {
    resolve: ((event: Response) => void) | null,
    reject: ((event: Response) => void) | null
  }>();


  private options = {
    WebSocket: ws,
    connectionTimeout: 1000,
    maxRetries: 10,
  };

  constructor(
    apiUrl: string = API_URL,
    onOpen: ((event: Event) => void) | null = null,
    onMessage: ((event: MessageEvent) => void) | null = null,
    onError: ((event: ErrorEvent) => void) | null = null,
    onClose: ((event: CloseEvent) => void) | null = null
  ) {
    step('Open socket');
    this.socket = this.open(apiUrl, this.options);

    this.socket.onopen = (event) => {
      this.pingTimer = setInterval(() => {
        this.ping();
      }, SOCKET_PING_INTERVAL);

      if (onOpen) {
        onOpen(event);
      }
    };

    this.socket.onmessage = (event) => {
      this.onMessageDefault(event);

      if (onMessage) {
        onMessage(event);
      }
    };

    this.socket.onerror = (event) => {
      clearInterval(this.pingTimer);

      if (onError) {
        onError(event);
      }
    };

    this.socket.onclose = (event) => {
      clearInterval(this.pingTimer);

      if (onClose) {
        onClose(event);
      }
    };
  }

  @step('Connecting to socket')
  private open(apiUrl: string, options: Options): ReconnectingWebSocket{
    return new ReconnectingWebSocket(apiUrl, [], options);
  }

  @step('Sending message to socket')
  async send(message : Message): Promise<Response> {
    return new Promise((resolve, reject) => {
      const { id, method, data, } = message;

      this.idMap.set(id, { resolve, reject, });

      const dataString = JSON.stringify({
        jsonrpc: '2.0',
        params: data,
        method,
        id,
      });

      try {
        AllureCommons.attachText('data', dataString);
        this.socket.send(dataString);
      } catch (err) {
        reject(err);
      }
    });
  }

  @step('Socket closed')
  close(): void {
    this.socket.close(1000);
  }

  ping(): void {
    const id = ValueGenerator.generateUUID();
    const dataString = JSON.stringify({
      jsonrpc: '2.0',
      method: 'ping',
      id,
    });

    try {
      this.socket.send(dataString);
    } catch (err) {
    //
    }
  }

  @step('Reconnecting socket')
  reconnect(): void {
    try {
      this.socket.reconnect();
    } catch (err) {
    //
    }
  }

  @step('Message received from socket')
  onMessageDefault({ data, }: MessageEvent): void {
    const message = JSON.parse(data);
    AllureCommons.attachText('data', data);

    const element = this.idMap.get(message.id);
    const resolve = element?.resolve;
    const reject = element?.reject;

    if (message?.error?.message) {

      if (typeof reject === 'function') {
        reject(message.error);
      }
      return;
    }

    if (typeof resolve === 'function') {
      resolve(message.result);
    }
  }
}

export interface Message {
    id: string,
    method: string,
    data: unknown,
}

export interface MessageEvent extends Event {
  /**
   * Returns the data of the message.
   */
  readonly data: string;
  /**
   * Returns the last event ID string, for server-sent events.
   */
  readonly lastEventId: string;
  /**
   * Returns the origin of the message, for server-sent events and cross-document messaging.
   */
  readonly origin: string;
}

export interface Response {
  readonly jsonrpc: string;
  readonly id: string | number;
  readonly result?: unknown;
  readonly error?: unknown;
}
