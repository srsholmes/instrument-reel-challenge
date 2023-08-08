/**
 * ☑️ You can edit MOST of this file to add your own styles.
 */

/**
 * ✅ You can add/edit these imports
 */
import {
  Instrument, InstrumentSymbol, WebSocketReadyState,
} from '../../common-leave-me';

/**
 * Notes:
 *
 * To subscribe or unsubscribe to/from instrument(s), send a message to the server with the following format:
 *
 * export type WebSocketClientMessageJson =
  | {
      type: "subscribe";
      instrumentSymbols: InstrumentSymbol[];
    }
  | {
      type: "unsubscribe";
      instrumentSymbols: InstrumentSymbol[];
    };
  *
  * The server will start responding with a message with the following format:
  *
  * export type WebSocketServerMessageJson = {
      type: "update";
      instruments: Instrument[];
    };
 */

type SetInstruments = (instruments: Instrument[]) => void;

/**
 * ❌ Please do not edit this class name
 */
export class InstrumentSocketClient {
  /**
   * ❌ Please do not edit this private property name
   */
  private _socket: WebSocket;

  /**
   * ✅ You can add more properties for the class here (if you want) 👇
   */

  private reels: Map<string, { instrumentSymbols: InstrumentSymbol[], setInstruments: SetInstruments }>;

  constructor() {
    /**
     * ❌ Please do not edit this private property assignment
     */
    this._socket = new WebSocket('ws://localhost:3000/ws');

    /**
     * ✅ You can edit from here down 👇
     */
    this.reels = new Map();
    this._socket.addEventListener('message', this.onMessage);
  }

  addReel({ instrumentSymbols, id, setInstruments }: {
    id: string,
    instrumentSymbols: InstrumentSymbol[],
    setInstruments: SetInstruments
  }) {
    if (this._socket.readyState === WebSocketReadyState.CLOSED) {
      this._socket = new WebSocket('ws://localhost:3000/ws');
      this._socket.addEventListener('message', this.onMessage);
    }

    if (!this.reels.has(id)) {
      this.reels.set(id, { instrumentSymbols, setInstruments });
      this.subscribe(instrumentSymbols);
    }
  }

  removeReel({ id }: { id: string }) {
    if (this.reels.has(id)) {
      this.unsubscribe({ id });
      this.reels.delete(id);
      if (this.reels.size === 0) {
        this.close();
      }
    } else {
      console.log('reel does not exist');
    }
  }

  onMessage = (event: MessageEvent) => {
    const data = JSON.parse(event.data);
    console.log(data);
    console.log('data', data)
    if (data.type === 'update') {
      console.log(this.reels)
      this.reels.forEach((value) => {
        value.setInstruments(data.instruments);
      });
    }
  }

  subscribe(instrumentSymbols: InstrumentSymbol[]) {
    if (this._socket.readyState !== WebSocketReadyState.OPEN) {
      setTimeout(() => {
        this.subscribe(instrumentSymbols);
      }, 500);
      return;
    } else {
      this._socket.send(JSON.stringify({
        type: 'subscribe', instrumentSymbols
      }));
    }
  }

  close() {
    this._socket.close();
  }

  unsubscribe({ id }: { id: string }) {
    if (this._socket.readyState === WebSocketReadyState.OPEN) {
      const currentInstrumentSymbols = new Map<InstrumentSymbol, true>();
      this.reels.forEach((value, key) => {
        if (key !== id) {
          value.instrumentSymbols.forEach((symbol) => {
            currentInstrumentSymbols.set(symbol, true);
          });
        }
      });
      const reelInstrumentSymbols = this.reels.get(id);
      const instrumentSymbolsToFilter = reelInstrumentSymbols?.instrumentSymbols.filter((symbol) => {
        return !currentInstrumentSymbols.has(symbol);
      });
      this._socket.send(JSON.stringify({
        type: 'unsubscribe',
        instrumentSymbols: instrumentSymbolsToFilter
      }));
    }
  }
}
