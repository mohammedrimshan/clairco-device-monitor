export interface AlertDevice {
  deviceId: string;
  name: string;
  alertEmail: string;
  lastSeenAt: Date | null;
  expectedInterval: number;
}