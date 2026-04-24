import { DockerImage } from '../models/container.model';

export const DOCKER_IMAGE_CATALOG: DockerImage[] = [
  // Web servers
  { name: 'nginx', tag: 'latest', description: 'Servidor web y proxy inverso de alto rendimiento', category: 'Web', defaultPorts: ['80:80', '443:443'] },
  { name: 'httpd', tag: 'latest', description: 'Apache HTTP Server', category: 'Web', defaultPorts: ['80:80'] },
  { name: 'traefik', tag: 'latest', description: 'Proxy inverso y balanceador de carga moderno', category: 'Web', defaultPorts: ['80:80', '8080:8080'] },

  // Bases de datos relacionales
  { name: 'postgres', tag: '16', description: 'Base de datos relacional PostgreSQL', category: 'Base de datos', defaultPorts: ['5432:5432'] },
  { name: 'mysql', tag: '8.0', description: 'Base de datos relacional MySQL', category: 'Base de datos', defaultPorts: ['3306:3306'] },
  { name: 'mariadb', tag: 'latest', description: 'Fork comunitario de MySQL', category: 'Base de datos', defaultPorts: ['3306:3306'] },

  // Bases de datos NoSQL
  { name: 'mongo', tag: '7', description: 'Base de datos documental MongoDB', category: 'Base de datos', defaultPorts: ['27017:27017'] },
  { name: 'redis', tag: '7', description: 'Caché en memoria y almacén clave-valor', category: 'Caché', defaultPorts: ['6379:6379'] },
  { name: 'elasticsearch', tag: '8.12.0', description: 'Motor de búsqueda y análisis distribuido', category: 'Búsqueda', defaultPorts: ['9200:9200', '9300:9300'] },

  // Runtimes
  { name: 'node', tag: '20-alpine', description: 'Entorno de ejecución Node.js (imagen Alpine ligera)', category: 'Runtime', defaultPorts: ['3000:3000'] },
  { name: 'python', tag: '3.12-slim', description: 'Intérprete Python (imagen Slim)', category: 'Runtime', defaultPorts: [] },
  { name: 'openjdk', tag: '21-jdk-slim', description: 'Java Development Kit 21', category: 'Runtime', defaultPorts: ['8080:8080'] },

  // Mensajería
  { name: 'rabbitmq', tag: '3-management', description: 'Broker de mensajes con panel de administración', category: 'Mensajería', defaultPorts: ['5672:5672', '15672:15672'] },
  { name: 'confluentinc/cp-kafka', tag: 'latest', description: 'Apache Kafka para streaming de eventos', category: 'Mensajería', defaultPorts: ['9092:9092'] },

  // Monitorización
  { name: 'grafana/grafana', tag: 'latest', description: 'Plataforma de observabilidad y dashboards', category: 'Monitorización', defaultPorts: ['3000:3000'] },
  { name: 'prom/prometheus', tag: 'latest', description: 'Sistema de monitorización y alertas', category: 'Monitorización', defaultPorts: ['9090:9090'] },

  // Herramientas
  { name: 'portainer/portainer-ce', tag: 'latest', description: 'Interfaz web para gestionar Docker', category: 'Herramientas', defaultPorts: ['9000:9000', '9443:9443'] },
  { name: 'dpage/pgadmin4', tag: 'latest', description: 'Administrador web para PostgreSQL', category: 'Herramientas', defaultPorts: ['80:80'] },
  { name: 'adminer', tag: 'latest', description: 'Gestor de bases de datos en un solo fichero', category: 'Herramientas', defaultPorts: ['8080:8080'] },
  { name: 'alpine', tag: 'latest', description: 'Imagen base Linux Alpine ultra-ligera (5 MB)', category: 'Base', defaultPorts: [] },
];

export const IMAGE_CATEGORIES = [...new Set(DOCKER_IMAGE_CATALOG.map(i => i.category))];
