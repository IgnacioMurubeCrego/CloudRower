# CloudRower

**Demo en producción:** https://cloudrower.3.65.122.104.nip.io

Aplicación web para desplegar y gestionar contenedores Docker a través de una interfaz visual. Permite a los usuarios registrarse, autenticarse y administrar contenedores desde un catálogo de imágenes populares o introduciendo una imagen personalizada.

Disponible en modo local (Docker Compose) y en producción sobre AWS EC2 con HTTPS automático mediante Let's Encrypt.

## Stack tecnológico

| Capa | Tecnología |
|------|-----------|
| Frontend | Angular 19, TypeScript, Tailwind CSS |
| Backend | Spring Boot 3.5, Java 21, Spring Security |
| Base de datos | PostgreSQL 16 |
| Autenticación | JWT (JJWT 0.12) |
| Docker API | docker-java-client 3.3.6 |
| Infraestructura local | Docker, Docker Compose |
| Infraestructura cloud | AWS EC2 t3.small (eu-central-1) |
| HTTPS | Let's Encrypt + nip.io (sin dominio registrado) |
| CI/CD | GitHub Actions + Ansible |

## Despliegue local

### Requisitos previos

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado y en ejecución
- **Docker Desktop → Settings → Resources → WSL Integration** activo (necesario en Windows para exponer el socket Unix)

### Arranque

Desde la raíz del proyecto:

```bash
docker compose up --build
```

| Servicio | URL |
|---------|-----|
| Frontend | http://localhost |
| Backend API | http://localhost:8080 |

Para detener:

```bash
docker compose down
```

Para detener y eliminar también los volúmenes (base de datos):

```bash
docker compose down -v
```

### Variables de entorno (local)

El `docker-compose.yml` incluye valores por defecto funcionales para desarrollo local. Se pueden sobreescribir creando un fichero `.env` en la raíz:

```env
DB_USER=cloudrower
DB_PASSWORD=cloudrower
JWT_SECRET=cambia-esto-por-un-secreto-seguro-de-al-menos-32-caracteres
```

---

## Despliegue en producción (AWS EC2)

El despliegue en producción se ejecuta automáticamente mediante un pipeline de GitHub Actions + Ansible cada vez que se hace push a la rama `develop`.

### Infraestructura necesaria

- Instancia EC2 **t3.small** (Ubuntu 22.04 LTS) con Elastic IP fija
- Security Group con los siguientes puertos abiertos:

| Puerto | Protocolo | Uso |
|--------|-----------|-----|
| 22 | TCP | SSH (Ansible) |
| 80 | TCP | Redirección HTTP → HTTPS |
| 443 | TCP | Aplicación (HTTPS) |

### Secretos de GitHub Actions

Configura los siguientes secretos en **Settings → Secrets and variables → Actions**:

| Secreto | Descripción |
|---------|-------------|
| `EC2_HOST` | IP pública o Elastic IP de la instancia |
| `EC2_USER` | Usuario SSH (normalmente `ubuntu`) |
| `EC2_SSH_KEY` | Clave privada SSH (contenido del fichero `.pem`) |
| `DB_USER` | Usuario de PostgreSQL |
| `DB_PASSWORD` | Contraseña de PostgreSQL |
| `JWT_SECRET` | Secreto para firmar los tokens JWT (mínimo 32 caracteres) |
| `ALLOWED_ORIGINS` | Origen permitido por CORS, p.ej. `https://cloudrower.<IP>.nip.io` |
| `CERTBOT_EMAIL` | Email para registrar el certificado Let's Encrypt |

### HTTPS automático

El pipeline utiliza [nip.io](https://nip.io) para obtener un dominio válido sin registrar ninguno. A partir de la Elastic IP de la instancia, el dominio queda como:

```
https://cloudrower.<ELASTIC_IP>.nip.io
```

Certbot obtiene el certificado en el primer despliegue y lo renueva automáticamente mediante cron. Nginx hace de proxy inverso hacia el backend y sirve el frontend Angular.

### Persistencia de datos

Los usuarios y el histórico de despliegues se almacenan en un volumen Docker nombrado (`postgres_data`). Este volumen **no se elimina** en los ciclos de `docker compose down / up` del pipeline, por lo que los datos persisten entre redespliegues.

---

## Funcionalidades

### Autenticación y roles

- Registro de usuario con nombre, email y contraseña
- La contraseña debe tener mínimo 8 caracteres, una mayúscula, un número y un carácter especial
- Login con email y contraseña
- Sesión basada en JWT (24 horas de validez)
- **El primer usuario registrado obtiene el rol `ADMIN`**; los siguientes obtienen el rol `USER`

### Control de acceso por rol

| Funcionalidad | USER | ADMIN |
|--------------|------|-------|
| Ver y gestionar sus contenedores | ✓ | ✓ |
| Desplegar nuevos contenedores | ✓ | ✓ |
| Ver histórico de despliegues | ✓ | ✓ |
| Ver contenedores internos del sistema (`cloudrower-*`) | — | ✓ |
| Ver estadísticas reales del sistema en el dashboard | — | ✓ |

### Dashboard — Resumen

Muestra el total de contenedores activos y detenidos. Los usuarios `USER` solo ven los contenedores que ellos han creado; los `ADMIN` ven todos incluidos los del sistema.

### Dashboard — Contenedores

Lista todos los contenedores visibles según el rol del usuario:
- ID, nombre, imagen, estado, puertos y fecha de creación
- Acción para **detener** contenedores en ejecución
- Acción para **eliminar** contenedores

### Dashboard — Desplegar

Permite lanzar nuevos contenedores con:
- Catálogo de más de 25 imágenes populares organizadas por categoría (web, bases de datos, runtimes, mensajería, monitorización, herramientas)
- Campo para introducir una imagen personalizada
- Nombre del contenedor (opcional)
- Mapeo de puertos (`host:contenedor`)
- Variables de entorno en formato clave-valor

### Dashboard — Histórico

Registro de todos los contenedores desplegados con su estado actual. Los usuarios `USER` no ven los despliegues de contenedores internos del sistema.

---

## API REST

### Autenticación

```
POST /api/auth/register
Body: { "email": "...", "password": "...", "name": "..." }
Response 201: { "token": "...", "user": { "id", "email", "name", "role" } }

POST /api/auth/login
Body: { "email": "...", "password": "..." }
Response 200: { "token": "...", "user": { "id", "email", "name", "role" } }
```

### Contenedores *(requieren Authorization: Bearer {token})*

```
GET    /api/containers            → lista todos los contenedores
POST   /api/containers/deploy     → despliega un nuevo contenedor
POST   /api/containers/{id}/stop  → detiene un contenedor
DELETE /api/containers/{id}       → elimina un contenedor
```

Ejemplo de body para despliegue:

```json
{
  "image": "nginx:latest",
  "containerName": "mi-nginx",
  "ports": ["8081:80"],
  "envVars": { "NGINX_HOST": "localhost" }
}
```

### Histórico *(requiere Authorization: Bearer {token})*

```
GET /api/deployments  → lista el histórico de despliegues
```

---

## Estructura del proyecto

```
CloudRower/
├── docker-compose.yml          # Configuración local
├── docker-compose.prod.yml     # Overrides de producción (HTTPS, volúmenes)
├── ansible/
│   ├── deploy.yml              # Playbook de despliegue (Docker + Certbot + Nginx)
│   ├── inventory.ini           # Hosts de producción
│   └── templates/
│       └── nginx-ssl.conf.j2   # Config Nginx con TLS
├── .github/
│   └── workflows/
│       └── cd.yml              # Pipeline CI/CD (build → push → deploy)
├── frontend/
│   ├── Dockerfile
│   ├── nginx.conf
│   └── src/app/
│       ├── core/               # servicios, modelos, guards, interceptors
│       └── features/
│           ├── auth/           # login, registro
│           └── dashboard/      # home, contenedores, despliegue, histórico
└── backend/
    ├── Dockerfile
    └── src/main/java/com/cloudrower/api/
        ├── controller/         # AuthController, ContainerController, DeploymentController
        ├── service/            # DockerService, DeploymentService
        ├── model/              # UserEntity, DeploymentRecord
        ├── repository/         # UserRepository, DeploymentRepository
        ├── security/           # JWT, JwtAuthFilter, SecurityConfig
        └── dto/                # contratos de API (User, AuthResponse, ...)
```
