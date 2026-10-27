export type DatabaseStatus = 'up' | 'disabled';

export interface HealthStatus {
  status: 'ok';
  uptimeSeconds: number;
  database: DatabaseStatus;
}
