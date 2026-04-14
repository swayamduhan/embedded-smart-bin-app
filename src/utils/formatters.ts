import type { BinAlertType, BinStatus } from '../types/bin';

export function formatDistance(distanceKm: number) {
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)} m`;
  }

  return `${distanceKm.toFixed(1)} km`;
}

export function formatTimestamp(timestamp: number) {
  return new Intl.DateTimeFormat('en-IN', {
    hour: 'numeric',
    minute: '2-digit',
    month: 'short',
    day: 'numeric',
  }).format(timestamp);
}

export function statusLabel(status: BinStatus) {
  switch (status) {
    case 'ALMOST_FULL':
      return 'Almost Full';
    case 'FULL':
      return 'Full';
    case 'EMPTY':
      return 'Empty';
    default:
      return 'Normal';
  }
}

export function alertLabel(alert: BinAlertType) {
  switch (alert) {
    case 'FIRE':
      return 'Fire';
    case 'GAS':
      return 'Gas Leak';
    case 'TAMPERING':
      return 'Tampering';
    default:
      return 'No Alert';
  }
}
