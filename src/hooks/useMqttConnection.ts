import { useEffect } from 'react';

import { mqttService } from '../services/mqtt/MqttService';
import { useBinStore } from '../store/binStore';

export function useMqttConnection(enabled: boolean) {
  const setConnectionState = useBinStore((state) => state.setConnectionState);
  const upsertBins = useBinStore((state) => state.upsertBins);

  useEffect(() => {
    if (!enabled) {
      mqttService.disconnect();
      setConnectionState('idle');
      return;
    }

    const unsubscribeBatches = mqttService.onBatch((messages) => {
      upsertBins(messages);
    });
    const unsubscribeState = mqttService.onState((state) => {
      setConnectionState(state);
    });

    mqttService.connect();

    return () => {
      unsubscribeBatches();
      unsubscribeState();
      mqttService.disconnect();
    };
  }, [enabled, setConnectionState, upsertBins]);
}
