# CONTEXT - Keypa Backend

## Vista rapida

API REST para autenticacion, usuarios, roles y permisos.

## Stack

- Node.js + Express
- Prisma ORM
- MySQL
- JWT

## Mapa visual del proyecto

```text
keypa_outlet/
└── keypa_backend/
    ├── controllers/
    │   ├── UsuarioController.js
    │   ├── RolController.js
    │   └── PermisoController.js
    ├── models/
    │   ├── User.js
    │   ├── Rol.js
    │   └── Permiso.js
    ├── routes/
    │   ├── index.js
    │   ├── auth.router.js
    │   ├── usuarios.router.js
    │   ├── roles.router.js
    │   └── permisos.router.js
    ├── validators/
    │   ├── authValidator.js
    │   ├── usuarioValidator.js
    │   ├── rolValidator.js
    │   └── permisoValidator.js
    ├── middlewares/
    ├── prisma/
    │   ├── schema.prisma
    │   └── seeders/
    │       ├── usuarios/
    │       └── productos/
    └── server.js
```

## Convenciones de rutas

- Los archivos de rutas usan formato: nombre.router.js
- El archivo routes/index.js solo compone routers.
- Cada archivo de ruta se organiza por metodo:
  - GET
  - POST
  - PUT
  - DELETE

## Base de datos y naming

- Tablas padre en plural y minusculas:
  - usuarios
  - productos
  - roles
  - permisos
- Tablas pivote con verbo y guion bajo:
  - usuario_tiene_rol
  - usuario_tiene_permiso
  - rol_tiene_permiso
- IDs por entidad:
  - idUsuario
  - idProducto
  - idRol
  - idPermiso

## Politica de autorizacion

- Se protege por token, rol y permiso por endpoint.
- Permisos efectivos del usuario:
  - permisos heredados por rol
  - mas permisos directos en usuario_tiene_permiso

## Seeders por dominio

- prisma/seeders/usuarios/
  - RolSeeder
  - PermisoSeeder
  - RolPermisoSeeder
  - UserSeeder
- prisma/seeders/productos/
  - MarcaSeeder
  - CategoriaSeeder
  - ProductoSeeder
- prisma/seeders/ubicaciones/
  - CiudadSeeder
  - ColoniaSeeder
- prisma/seeders/sucursales/
  - SucursalSeeder
- prisma/seeders/almacenes/
  - AlmacenSeeder
- prisma/seeders/clientes/
  - ClienteSeeder
- prisma/seeders/inventarios/
  - InventarioSeeder

Politica de sincronizacion:
1. Todos los seeders deben trabajar en modo sincronizacion exacta.
2. Cada seeder hace upsert de su base y despues elimina registros fuera del conjunto objetivo.
3. Las tablas pivote tambien se sincronizan de forma exacta para evitar residuos.
4. Esta politica es intencionalmente destructiva para mantener ambientes deterministas.

Flujo:
1. Se crean roles.
2. Se crean permisos.
3. Se vinculan roles y permisos.
4. Se crean usuarios base.
5. Se crean catalogos de productos (marcas, categorias, productos).
6. Se crean ubicaciones (ciudades, colonias).
7. Se crean sucursales y almacenes.
8. Se crean clientes base.
9. Se crea inventario inicial.

## Operacion local con Docker

Desde keypa_outlet:
- npm run upd
- npm run migrate
- npm run seed
- npm run migrate-seed
- npm run fresh

## Idioma del codigo

- Comentarios, mensajes funcionales y documentacion en espanol.

## Reglas de documentacion

- Cada controlador debe incluir comentarios cortos sobre cada funcion de ruta indicando metodo HTTP, ruta y responsabilidad.
- Cada funcion nueva en services, models, controllers y utilidades debe incluir comentario corto sobre su responsabilidad.
- Todo cambio nuevo debe quedar comentado en el codigo cuando la intencion no sea obvia a primera vista.

## Reglas para archivos e imagenes

- Toda logica de manejo de archivos (normalizar URL, resolver ruta local y eliminar fisico) debe reutilizar utilidades compartidas en `src/shared/utils`.
- Evitar duplicar logica de borrado de archivos dentro de cada service de modulo.
- Todo middleware de subida de archivos debe declararse en `src/shared/middlewares` para reutilizacion global.
