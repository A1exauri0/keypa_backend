const prisma = require('../../../config/prisma');

const permisosPorRol = {
  admin: [
    'usuarios.ver',
    'usuarios.gestionar',
    'productos.ver',
    'productos.gestionar',
    'ventas.gestionar',
  ],
  vendedor: [
    'productos.ver',
    'ventas.gestionar',
  ],
};

async function ejecutarRolPermisoSeeder() {
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

  console.log('RolPermisoSeeder ejecutado correctamente');
}

module.exports = {
  ejecutarRolPermisoSeeder,
};
