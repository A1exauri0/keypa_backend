# Keypa Backend

API REST para autenticacion y gestion de usuarios en Keypa, construida con Express + Prisma + MySQL.

## Contexto del repositorio

- Stack: Node.js, Express, Prisma, MySQL, JWT, bcryptjs, express-validator.
- Arquitectura: rutas en `routes/routes.js`, controlador principal en `controllers/UsuarioController.js`, acceso a datos en `models/`.
- Base de datos: Prisma ORM con esquema en `prisma/schema.prisma`.
- Seeder actual: `UserSeeder` (crea usuarios iniciales).

## Requisitos

- Node.js 20+
- MySQL activo
- Variables de entorno configuradas

## Instalacion

1. Instalar dependencias:

```bash
npm install
```

2. Crear archivo de entorno:

```bash
Copy-Item .env.example .env
```

3. Ajustar `DATABASE_URL`, `JWT_SECRET` y `FRONTEND_ORIGIN` en `.env`.

## Comandos principales

- Desarrollo:

```bash
npm run dev
```

- Produccion:

```bash
npm start
```

- Generar cliente Prisma:

```bash
npm run prisma:generate
```

## Migraciones

- Crear/aplicar migracion en desarrollo:

```bash
npm run prisma:migrate -- --name init
```

- Aplicar migraciones existentes en entorno productivo:

```bash
npx prisma migrate deploy
```

- Reiniciar base de datos (solo desarrollo):

```bash
npm run db:reset
```

## Seeders

- Ejecutar seeders:

```bash
npm run db:seed
```

- Seeder activo: `prisma/seeders/UserSeeder.js`
- Usuarios iniciales:
  - `admin@example.com` / `password`
  - `vendedor@example.com` / `password`

## Endpoints base

- `GET /health`
- `POST /auth/login`
- `GET /auth/me`
- `POST /auth/logout`

## Docker (stack en carpeta padre)

La orquestacion ahora vive en `keypa_outlet/docker-compose.yml`.

1. Ir a carpeta padre:

```bash
cd c:\laragon\www\keypa_outlet
```

2. Levantar servicios:

```bash
docker compose up --build
```

3. Ejecutar migraciones y seeders:

```bash
npm run migrate
npm run seed
```

Tambien puedes ejecutar ambos en un solo paso:

```bash
npm run migrate-seed
```

4. Reinicio total de BD + seed (equivalente a fresh + seed):

```bash
docker compose exec backend npx prisma migrate reset --force
```

5. Detener servicios:

```bash
docker compose down
```

## Conexion a MySQL en Docker

Cuando usas Docker, la conexion cambia segun desde donde te conectas:

- Desde el contenedor `backend`:
  - Host: `mysql`
  - Port: `3306`
  - DB: `keypa_outlet`
  - User: `keypa`
  - Password: `keypa123`
  - URL: `mysql://keypa:keypa123@mysql:3306/keypa_outlet`

- Desde tu maquina (Workbench, DBeaver, etc.):
  - Host: `localhost`
  - Port: `3307`
  - DB: `keypa_outlet`
  - User: `keypa`
  - Password: `keypa123`

Si usas `localhost:3306` vas a conectarte a otra instancia (normalmente la local de Laragon), no a la de Docker.
