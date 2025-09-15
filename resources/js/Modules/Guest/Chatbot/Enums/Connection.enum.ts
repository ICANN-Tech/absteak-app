export enum ConnectionEnum {
  Idle = 'idle',
  Connecting = 'connecting',
  Waiting = 'waiting',
  Connected = 'connected',
  Disconnected = 'disconnected'
}

const stateMap: Record<string, ConnectionEnum> = {
  idle: ConnectionEnum.Idle,
  connecting: ConnectionEnum.Connecting,
  waiting: ConnectionEnum.Waiting,
  connected: ConnectionEnum.Connected,
  disconnected: ConnectionEnum.Disconnected,
};

export function toConnectionEnum(state: string): ConnectionEnum {
  return stateMap[state] ?? ConnectionEnum.Idle; // fallback ke Idle
}

