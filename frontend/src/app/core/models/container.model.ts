export interface ContainerInfo {
  id: string;
  name: string;
  image: string;
  status: string;
  ports: string[];
  created: number;
}

export interface ContainerRequest {
  image: string;
  containerName?: string;
  ports?: string[];
  envVars?: Record<string, string>;
}

export interface DockerImage {
  name: string;
  tag: string;
  description: string;
  category: string;
  defaultPorts?: string[];
}
