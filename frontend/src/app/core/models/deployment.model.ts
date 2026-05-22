export interface DeploymentRecord {
  id: number;
  containerId: string;
  containerName: string;
  image: string;
  ports: string[];
  deployedAt: string;
  currentStatus: string | null;
}
