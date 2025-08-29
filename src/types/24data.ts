import { WEBSOCKET_EVENTS } from "./events";

export type WEBSOCKET_EVENT_TYPES = keyof typeof WEBSOCKET_EVENTS;

export interface WebSocketMessage {
    t: WEBSOCKET_EVENT_TYPES,
    d: any;
}

export interface AircraftData {
    heading: number;
    playerName: string;
    altitude: number;
    aircraftType: String;
    position: {
        x: number;
        y: number;
    };
    speed: number;
    wind: string;
    isOnGround?: boolean;
    groundSpeed: number;
}

export interface AircraftDataCollection {
    [ingameCallsign: string]: AircraftData;
}

export interface FlightPlan {
  robloxName: string,
  callsign: string,
  realcallsign: string,
  aircraft: string,
  flightrules: string,
  departing: string,
  arriving: string,
  route: string,
  flightlevel: string
}
export interface ControllerPosition {
    holder: string;
    claimable: boolean;
    airport: string;
    position: "CTR" | "TWR" | "GND";
    queue: string[];
}

export interface Atis {
    airport: string;
    letter: string;
    content: string;
    lines: string[];
    editor: string;
}