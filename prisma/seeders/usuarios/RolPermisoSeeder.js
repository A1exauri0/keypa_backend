const prisma = require('../../../config/prisma');

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
  ],
  vendedor: [
    'panel.ver',
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
