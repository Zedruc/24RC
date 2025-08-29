import { AircraftCollection } from "../types";
import { WEBSOCKET_EVENT_TYPES, WebSocketMessage } from "../types/24data";
import { WEBSOCKET_EVENTS } from "../types/events";

// const DATA_URL = "ws://localhost:3000";
const DATA_URL = "wss://24data.ptfs.app/wss";

type EventCallbackFunction = (eventData: any) => void;

class WebsocketHandler {
    private dataWebsocket: WebSocket;
    private useEventData: boolean;

    private listeners: {
        [eventType: string]: EventCallbackFunction[];
    };

    constructor() {
        this.dataWebsocket = this.initWebsocket();
        this.useEventData = false;

        this.listeners = {};
        for (const key of Object.keys(WEBSOCKET_EVENTS)) {
            this.listeners[key] = [];
        }
    }

    private initWebsocket(): WebSocket {
        let ws = new WebSocket(DATA_URL);
        ws.onopen = this.onOpen.bind(this);
        ws.onmessage = this.onMessage.bind(this);
        ws.onclose = this.onClose.bind(this);
        ws.onerror = this.onError.bind(this);

        return ws;
    }

    // WebSocket Event Handlers
    ///////////////////////////

    private onOpen() {
        console.log("[WS] Connected to 24data WebSocket");
    }

    private onMessage(websocketMessage: MessageEvent) {
        /**
         * From here we send out the data to other listeners across 24RC
         * via the EventEmitter from events.ts
         * Other possibility are global variables but thats turned out
         * to be a pain in the scope
         */

        let apiMessage: WebSocketMessage;

        try {
            apiMessage = JSON.parse(websocketMessage.data);
        } catch (error) {
            console.log("[WS] 24data API did not send valid JSON");
            return;
        }

        this.dispatch(apiMessage.t, apiMessage.d);
    }
    private onClose() {
        console.log("[WS] WebSocket connection closed");
        
    }
    private onError(error: any) {
        console.log("[WS] WebSocket connection closed unexpectedly. Error:\n", error);
        console.log("[WS] Attemtping to reconnect...");
        this.dataWebsocket = this.initWebsocket();
    }

    private dispatch(eventType: WEBSOCKET_EVENT_TYPES, data: any) {
        this.listeners[eventType].forEach(callbackFunction => {
            /* Event mode handling */
            if((eventType as string) === "EVENT_ACFT_DATA" || (eventType as string) === "EVENT_FLIGHT_PLAN") {
                if(this.useEventData) callbackFunction(data);
                return;
            }

            callbackFunction(data);
        });
    }

    addEventListener(event: WEBSOCKET_EVENT_TYPES, callback: EventCallbackFunction) {
        this.listeners[event].push(callback);
    }

    removeEventListener(event: WEBSOCKET_EVENT_TYPES, callback: EventCallbackFunction) {
        this.listeners[event].splice(this.listeners[event].indexOf(callback), 1);
    }

    setEventMode(active: boolean) {
        this.useEventData = active;
    }
}

const WsHandler = new WebsocketHandler();

export default WsHandler;