export type BinStatus = 'EMPTY' | 'NORMAL' | 'ALMOST_FULL' | 'FULL';
export type BinAlertType = 'NONE' | 'FIRE' | 'GAS' | 'TAMPERING';
export type ConnectionState = 'idle' | 'connecting' | 'connected' | 'disconnected' | 'error';
export type SystemEventType = 'FULL' | 'FIRE' | 'GAS' | 'TAMPERING';

export interface BinMessagePayload {
  id: string;
  lat?: number;
  lng?: number;
  fill?: number;
  status?: string;
  alert?: string;
}

export interface Dustbin {
  id: string;
  lat: number;
  lng: number;
  fill: number;
  status: BinStatus;
  alert: BinAlertType;
  updatedAt: number;
}

export interface BinSystemEvent {
  id: string;
  binId: string;
  type: SystemEventType;
  title: string;
  body: string;
  createdAt: number;
}
