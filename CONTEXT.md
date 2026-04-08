# CONTEXT - Keypa Backend

## Proposito

Servicio API REST para autenticacion, gestion de usuarios y base para catalogo/ventas.

## Stack

- Node.js + Express
- Prisma ORM
- MySQL
- JWT para autenticacion

## Arquitectura principal

- Organizacion general del sistema (carpeta padre):
  - keypa_outlet/
  - keypa_outlet/keypa_backend/
  - keypa_outlet/keypa_frontend/
- Rutas: routes/routes.js
- Controladores: controllers/
- Capa de datos: models/
- Prisma schema: prisma/schema.prisma
- Seeders: prisma/seeders/

## Base de datos y convenciones

- Todas las tablas fisicas se manejan en minusculas.
- Tablas muchos a muchos usan nombre con verbo y guion bajo.
- Los IDs siguen convencion semantica por entidad:
  - idUsuario
  - idProducto
  - idRol
  - idPermiso
- Ejemplos:
  - usuarios
  - productos
  - roles
  - permisos
  - usuario_tiene_rol
  - usuario_tiene_permiso
  - rol_tiene_permiso

## Politica de permisos

- Los permisos por defecto del usuario se heredan desde sus roles (roles + rol_tiene_permiso).
- Los permisos extra por usuario se guardan en usuario_tiene_permiso.
- Permisos efectivos del usuario = union de permisos por rol + permisos directos.

## Seeders actuales

- Organizados por dominio:
  - prisma/seeders/usuarios/
    - RolSeeder
    - PermisoSeeder
    - RolPermisoSeeder
    - UserSeeder
  - prisma/seeders/productos/
    - ProductoSeeder

Flujo de seed:
1. Se crean roles.
2. Se crean permisos.
3. Se vinculan roles con permisos.
4. Se crean usuarios y se vinculan directamente a su rol.

## Docker y comandos cortos

Ubicacion del stack: carpeta padre keypa_outlet.

Comandos utiles desde keypa_outlet:
- npm run upd
- npm run migrate
- npm run seed
- npm run migrate-seed
- npm run fresh

## Convencion de idioma del proyecto

- Componentes, nombres funcionales y comentarios deben escribirse en espanol.
- Mantener mensajes de log y documentacion tecnica en espanol.
