import { create } from 'zustand';

import type { BinAlertType, BinMessagePayload, BinStatus, BinSystemEvent, ConnectionState, Dustbin } from '../types/bin';

interface BinState {
  binsById: Record<string, Dustbin>;
  connectionState: ConnectionState;
  selectedBinId: string | null;
  events: BinSystemEvent[];
  setConnectionState: (state: ConnectionState) => void;
  selectBin: (binId: string | null) => void;
  upsertBins: (messages: BinMessagePayload[]) => void;
  reset: () => void;
}

function normalizeStatus(fill: number, status?: string): BinStatus {
  const normalized = status?.toUpperCase();

  if (normalized === 'FULL') {
    return 'FULL';
  }

  if (normalized === 'ALMOST_FULL') {
    return 'ALMOST_FULL';
  }

  if (normalized === 'EMPTY') {
    return 'EMPTY';
  }

  if (fill >= 90) {
    return 'FULL';
  }

  if (fill >= 70) {
    return 'ALMOST_FULL';
  }

  if (fill <= 10) {
    return 'EMPTY';
  }

  return 'NORMAL';
}

function normalizeAlert(alert?: string): BinAlertType {
  const normalized = alert?.toUpperCase();

  if (normalized === 'FIRE' || normalized === 'GAS' || normalized === 'TAMPERING') {
    return normalized;
  }

  return 'NONE';
}

function buildEvent(type: BinSystemEvent['type'], binId: string): BinSystemEvent {
  const timestamp = Date.now();

  if (type === 'FULL') {
    return {
      id: `${binId}-full-${timestamp}`,
      binId,
      type,
      title: `Bin ${binId} is full`,
      body: 'Dispatch collection staff to avoid overflow.',
      createdAt: timestamp,
    };
  }

  if (type === 'FIRE') {
    return {
      id: `${binId}-fire-${timestamp}`,
      binId,
      type,
      title: `Fire detected at ${binId}`,
      body: 'Emergency response is required immediately.',
      createdAt: timestamp,
    };
  }

  if (type === 'GAS') {
    return {
      id: `${binId}-gas-${timestamp}`,
      binId,
      type,
      title: `Gas leak detected at ${binId}`,
      body: 'Inspect the bin before sending field staff close to it.',
      createdAt: timestamp,
    };
  }

  return {
    id: `${binId}-tampering-${timestamp}`,
    binId,
    type,
    title: `Tampering detected at ${binId}`,
    body: 'Investigate the site and verify sensor integrity.',
    createdAt: timestamp,
  };
}

export const useBinStore = create<BinState>((set) => ({
  binsById: {},
  connectionState: 'idle',
  selectedBinId: null,
  events: [],
  setConnectionState: (connectionState) => set({ connectionState }),
  selectBin: (selectedBinId) => set({ selectedBinId }),
  upsertBins: (messages) =>
    set((state) => {
      const nextBins = { ...state.binsById };
      const newEvents: BinSystemEvent[] = [];

      messages.forEach((message) => {
        if (!message.id) {
          return;
        }

        const previousBin = state.binsById[message.id];
        const fill = message.fill ?? previousBin?.fill ?? 0;
        const status = normalizeStatus(fill, message.status ?? previousBin?.status);
        const alert = normalizeAlert(message.alert ?? previousBin?.alert);

        const nextBin: Dustbin = {
          id: message.id,
          lat: message.lat ?? previousBin?.lat ?? 0,
          lng: message.lng ?? previousBin?.lng ?? 0,
          fill,
          status,
          alert,
          updatedAt: Date.now(),
        };

        nextBins[message.id] = nextBin;

        if (previousBin?.status !== 'FULL' && nextBin.status === 'FULL') {
          newEvents.push(buildEvent('FULL', message.id));
        }

        if (previousBin?.alert !== nextBin.alert) {
          if (nextBin.alert === 'FIRE') {
            newEvents.push(buildEvent('FIRE', message.id));
          }

          if (nextBin.alert === 'GAS') {
            newEvents.push(buildEvent('GAS', message.id));
          }

          if (nextBin.alert === 'TAMPERING') {
            newEvents.push(buildEvent('TAMPERING', message.id));
          }
        }
      });

      return {
        binsById: nextBins,
        events: [...newEvents, ...state.events].slice(0, 40),
      };
    }),
  reset: () =>
    set({
      binsById: {},
      selectedBinId: null,
      events: [],
      connectionState: 'idle',
    }),
}));
