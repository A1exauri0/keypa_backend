# CONTEXT - Keypa Backend

## Objetivo

API REST para autenticacion, autorizacion y operacion de catalogos/ventas para Keypa Outlet.

## Stack

- Node.js + Express
- Prisma ORM
- MySQL
- JWT
- express-validator
- multer

## Estructura principal

```text
keypa_backend/
├── server.js
├── prisma/
│   ├── schema.prisma
│   ├── seed.js
│   └── seeders/
└── src/
    ├── routes/
    │   └── index.js
    ├── modules/
    │   ├── auth/
    │   ├── usuarios/
    │   ├── productos/
    │   ├── ubicaciones/
    │   ├── clientes/
    │   ├── sucursales/
    │   ├── almacenes/
    │   ├── inventarios/
    │   └── ventas/
    └── shared/
        ├── db/
        ├── middlewares/
        ├── services/
        └── utils/
```

## Arquitectura por modulo

Cada modulo de dominio mantiene estructura consistente:

- `controllers/`
- `services/`
- `models/`
- `validators/`
- `router/*.routes.js`

La composicion central de rutas se realiza en `src/routes/index.js`.

## Endpoints y dominios

Dominios montados actualmente:

- auth
- usuarios, roles, permisos
- productos, marcas, categorias
- ciudades, colonias
- clientes
- sucursales
- almacenes
- inventarios
- ventas

Endpoint de salud:

- `GET /health`

## Seguridad

- Middleware de autenticacion: `requireAuth`.
- Middleware de autorizacion por permiso: `requirePermiso`.
- Middleware de autorizacion por rol: `requireRol`.
- Token JWT por header `Authorization: Bearer <token>`.
- Rate limit global en servidor.
- CORS configurado por `FRONTEND_ORIGIN`.

## Base de datos y convenciones

- Prisma schema en `prisma/schema.prisma`.
- IDs semanticos por entidad (idUsuario, idProducto, idVenta, etc.).
- Relaciones y tablas pivote definidas para usuarios, roles y permisos.
- Respuestas orientadas a frontend admin con estados activos/inactivos cuando aplique.

## Seeders

Seeders organizados por dominio dentro de `prisma/seeders`:

- usuarios
- productos
- ubicaciones
- sucursales
- almacenes
- clientes
- inventarios

Politica de datos para ambientes de desarrollo:

- sincronizacion exacta cuando el seeder lo requiera
- eliminacion de residuos para estado determinista

## Archivos y media

- Archivos publicos servidos en `/storage` desde `storage/app/public`.
- Utilidades compartidas en `src/shared/utils/storageFiles.js`.
- Subida de imagenes y manejo de archivos via middlewares compartidos.

## Variables de entorno clave

- `PORT`
- `DATABASE_URL`
- `JWT_SECRET`
- `FRONTEND_ORIGIN`
- `DB_CONNECT_RETRIES`
- `DB_CONNECT_RETRY_DELAY_MS`

## Comandos locales

- `npm run dev`
- `npm start`
- `npm run prisma:generate`
- `npm run prisma:migrate -- --name <nombre>`
- `npm run db:seed`
- `npm run db:reset`

## Docker

El stack se orquesta desde `keypa_outlet`.

- `npm run upd`
- `npm run logs`
- `npm run down`
- `npm run migrate`
- `npm run seed`
- `npm run migrate-seed`
- `npm run fresh`

## Convenciones de equipo

- Idioma de mensajes funcionales: espanol.
- Mantener contrato estable con frontend (nombres de campos e IDs).
- Reutilizar utilidades y middlewares compartidos para evitar duplicacion.
