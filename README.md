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
