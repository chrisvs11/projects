export interface NetworkState {
  since: string;
  online: boolean;
}

export enum WifiStatus {
  OFFLINE = "offline",
  ONLINE = "online",
  RECONNECTING = "reconnecting",
}

export enum NavigationStatus {
  ACTIVE = "active",
  WAITING = "waiting",
  INACTIVE = "inactive",
}

export interface PlayerConnection {
  connection_status: WifiStatus;
  activeMember?: NavigationStatus;
  activePlayer?: NavigationStatus;
}
