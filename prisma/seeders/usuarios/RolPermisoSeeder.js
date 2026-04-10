const prisma = require('../../../src/shared/db/prisma');

const permisosPorRol = {
  admin: [
    'panel.ver',
    'usuarios.index',
    'usuarios.show',
    'usuarios.store',
    'usuarios.update',
    'usuarios.destroy',
    'usuarios.asignar_roles',
    'usuarios.asignar_permisos',
    'roles.index',
    'roles.show',
    'roles.store',
    'roles.update',
    'roles.destroy',
    'roles.asignar_permisos',
    'permisos.index',
    'permisos.show',
    'permisos.store',
    'permisos.update',
    'permisos.destroy',
    'marcas.index',
    'marcas.show',
    'marcas.store',
    'marcas.update',
    'marcas.destroy',
    'categorias.index',
    'categorias.show',
    'categorias.store',
    'categorias.update',
    'categorias.destroy',
    'productos.index',
    'productos.show',
    'productos.store',
    'productos.update',
    'productos.destroy',
    'ciudades.index',
    'ciudades.show',
    'ciudades.store',
    'ciudades.update',
    'ciudades.destroy',
    'colonias.index',
    'colonias.show',
    'colonias.store',
    'colonias.update',
    'colonias.destroy',
    'clientes.index',
    'clientes.show',
    'clientes.store',
    'clientes.update',
    'clientes.destroy',
    'sucursales.index',
    'sucursales.show',
    'sucursales.store',
    'sucursales.update',
    'sucursales.destroy',
    'almacenes.index',
    'almacenes.show',
    'almacenes.store',
    'almacenes.update',
    'almacenes.destroy',
    'inventarios.index',
    'inventarios.show',
    'inventarios.store',
    'inventarios.update',
    'inventarios.destroy',
  ],
  vendedor: [
    'panel.ver',
    'marcas.index',
    'marcas.show',
    'categorias.index',
    'categorias.show',
    'productos.index',
    'productos.show',
    'ciudades.index',
    'ciudades.show',
    'colonias.index',
    'colonias.show',
    'clientes.index',
    'clientes.show',
    'sucursales.index',
    'sucursales.show',
    'almacenes.index',
    'almacenes.show',
    'inventarios.index',
    'inventarios.show',
  ],
};

async function ejecutarRolPermisoSeeder() {
  const objetivos = [];

  for (const [nombreRol, permisos] of Object.entries(permisosPorRol)) {
    const rol = await prisma.rol.findUnique({
      where: { nombre: nombreRol },
      select: { idRol: true },
    });

    if (!rol) {
      continue;
    }

    for (const nombrePermiso of permisos) {
      const permiso = await prisma.permiso.findUnique({
        where: { nombre: nombrePermiso },
        select: { idPermiso: true },
      });

      if (!permiso) {
        continue;
      }

      objetivos.push({
        idRol: rol.idRol,
        idPermiso: permiso.idPermiso,
      });

      await prisma.rolPermiso.upsert({
        where: {
          idRol_idPermiso: {
            idRol: rol.idRol,
            idPermiso: permiso.idPermiso,
          },
        },
        update: {},
        create: {
          idRol: rol.idRol,
          idPermiso: permiso.idPermiso,
        },
      });
    }
  }

  if (objetivos.length > 0) {
    await prisma.rolPermiso.deleteMany({
      where: {
        NOT: {
          OR: objetivos.map((item) => ({
            idRol: item.idRol,
            idPermiso: item.idPermiso,
          })),
        },
      },
    });
  }

  console.log('RolPermisoSeeder ejecutado correctamente');
}

module.exports = {
  ejecutarRolPermisoSeeder,
};
