# CloudRower

Aplicación web para desplegar y gestionar contenedores Docker a través de una interfaz visual. Permite a los usuarios registrarse, autenticarse y administrar contenedores desde un catálogo de imágenes populares o introduciendo una imagen personalizada.

## Stack tecnológico

| Capa | Tecnología |
|------|-----------|
| Frontend | Angular 21, TypeScript, Tailwind CSS |
| Backend | Spring Boot 3.5, Java 21, Spring Security |
| Base de datos | PostgreSQL 16 |
| Autenticación | JWT (JJWT 0.12) |
| Docker API | docker-java-client 3.3.6 |
| Infraestructura | Docker, Docker Compose |

## Requisitos previos

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado y en ejecución
- **Docker Desktop → Settings → Resources → WSL Integration** activo (necesario en Windows para exponer el socket Unix)

## Despliegue local

Desde la raíz del proyecto:

```bash
docker compose up --build
```

| Servicio | URL |
|---------|-----|
| Frontend | http://localhost |
| Backend API | http://localhost:8080 |

Para detener todos los servicios:

```bash
docker compose down
```

Para detener y eliminar también los volúmenes (base de datos):

```bash
docker compose down -v
```

## Variables de entorno

El `docker-compose.yml` incluye valores por defecto funcionales para desarrollo local. Se pueden sobreescribir creando un fichero `.env` en la raíz:

```env
DB_USER=cloudrower
DB_PASSWORD=cloudrower
JWT_SECRET=cambia-esto-por-un-secreto-seguro-de-al-menos-32-caracteres
```

## Funcionalidades

### Autenticación
- Registro de usuario con nombre, email y contraseña
- La contraseña debe tener mínimo 8 caracteres, una mayúscula, un número y un carácter especial
- Login con email y contraseña
- Sesión basada en JWT (24 horas de validez)

### Dashboard — Resumen
Muestra el total de contenedores, cuántos están en ejecución y cuántos detenidos.

### Dashboard — Contenedores
Lista todos los contenedores del sistema (activos y detenidos) con:
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

## API REST

### Autenticación

```
POST /api/auth/register
Body: { "email": "...", "password": "...", "name": "..." }
Response 201: { "token": "...", "user": { "id", "email", "name" } }

POST /api/auth/login
Body: { "email": "...", "password": "..." }
Response 200: { "token": "...", "user": { "id", "email", "name" } }
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

## Estructura del proyecto

```
CloudRower/
├── docker-compose.yml
├── frontend/
│   ├── Dockerfile
│   ├── nginx.conf
│   └── src/app/
│       ├── core/              # servicios, modelos, guards
│       └── features/
│           ├── auth/          # login, registro
│           └── dashboard/     # home, contenedores, despliegue
└── backend/
    ├── Dockerfile
    └── src/main/java/com/cloudrower/api/
        ├── controller/        # AuthController, ContainerController
        ├── service/           # DockerService
        ├── model/             # UserEntity
        ├── repository/        # UserRepository
        ├── security/          # JWT, filtros, CORS
        └── dto/               # contratos de API
```
