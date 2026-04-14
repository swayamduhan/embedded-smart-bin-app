import mqtt, { type MqttClient } from 'mqtt';

import { env } from '../../config/env';
import type { BinMessagePayload, ConnectionState } from '../../types/bin';

type StateListener = (state: ConnectionState) => void;
type BatchListener = (messages: BinMessagePayload[]) => void;

class MqttService {
  private client: MqttClient | null = null;
  private pendingMessages = new Map<string, BinMessagePayload>();
  private flushTimer: ReturnType<typeof setTimeout> | null = null;
  private batchListeners = new Set<BatchListener>();
  private stateListeners = new Set<StateListener>();
  private readonly topics = ['dustbin/status', 'dustbin/location', 'dustbin/alerts'];

  connect() {
    if (this.client) {
      return this.client;
    }

    this.emitState('connecting');

    this.client = mqtt.connect(env.mqttUrl, {
      username: env.mqttUsername,
      password: env.mqttPassword,
      keepalive: 30,
      reconnectPeriod: 4000,
      connectTimeout: 20000,
      clean: true,
    });

    this.client.on('connect', () => {
      this.emitState('connected');
      this.client?.subscribe(this.topics);
    });

    this.client.on('reconnect', () => {
      this.emitState('connecting');
    });

    this.client.on('error', () => {
      this.emitState('error');
    });

    this.client.on('close', () => {
      this.emitState('disconnected');
    });

    this.client.on('message', (_topic: string, payload: Buffer | Uint8Array) => {
      const parsed = this.parsePayload(payload.toString());

      if (!parsed) {
        return;
      }

      const current = this.pendingMessages.get(parsed.id) ?? { id: parsed.id };
      this.pendingMessages.set(parsed.id, {
        ...current,
        ...parsed,
      });
      this.scheduleFlush();
    });

    return this.client;
  }

  disconnect() {
    this.flushPending();
    this.client?.end(true);
    this.client = null;
    this.emitState('disconnected');
  }

  onBatch(listener: BatchListener) {
    this.batchListeners.add(listener);

    return () => {
      this.batchListeners.delete(listener);
    };
  }

  onState(listener: StateListener) {
    this.stateListeners.add(listener);

    return () => {
      this.stateListeners.delete(listener);
    };
  }

  private parsePayload(rawPayload: string) {
    try {
      const payload = JSON.parse(rawPayload) as BinMessagePayload;

      if (!payload.id) {
        return null;
      }

      return payload;
    } catch {
      return null;
    }
  }

  private scheduleFlush() {
    if (this.flushTimer) {
      return;
    }

    this.flushTimer = setTimeout(() => {
      this.flushTimer = null;
      this.flushPending();
    }, 350);
  }

  private flushPending() {
    if (this.pendingMessages.size === 0) {
      return;
    }

    const batch = Array.from(this.pendingMessages.values());
    this.pendingMessages.clear();

    this.batchListeners.forEach((listener) => listener(batch));
  }

  private emitState(state: ConnectionState) {
    this.stateListeners.forEach((listener) => listener(state));
  }
}

export const mqttService = new MqttService();
