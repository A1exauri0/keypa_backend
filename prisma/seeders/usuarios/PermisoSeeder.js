const prisma = require('../../../src/shared/db/prisma');

const permisosBase = [
  {
    nombre: 'panel.ver',
    descripcion: 'Puede acceder al panel principal',
  },
  {
    nombre: 'usuarios.index',
    descripcion: 'Puede listar usuarios',
  },
  {
    nombre: 'usuarios.show',
    descripcion: 'Puede ver detalle de usuario',
  },
  {
    nombre: 'usuarios.store',
    descripcion: 'Puede crear usuarios',
  },
  {
    nombre: 'usuarios.update',
    descripcion: 'Puede actualizar usuarios',
  },
  {
    nombre: 'usuarios.destroy',
    descripcion: 'Puede eliminar usuarios',
  },
  {
    nombre: 'usuarios.asignar_roles',
    descripcion: 'Puede asignar roles a usuarios',
  },
  {
    nombre: 'usuarios.asignar_permisos',
    descripcion: 'Puede asignar permisos directos a usuarios',
  },
  {
    nombre: 'roles.index',
    descripcion: 'Puede listar roles',
  },
  {
    nombre: 'roles.show',
    descripcion: 'Puede ver detalle de rol',
  },
  {
    nombre: 'roles.store',
    descripcion: 'Puede crear roles',
  },
  {
    nombre: 'roles.update',
    descripcion: 'Puede actualizar roles',
  },
  {
    nombre: 'roles.destroy',
    descripcion: 'Puede eliminar roles',
  },
  {
    nombre: 'roles.asignar_permisos',
    descripcion: 'Puede asignar permisos a roles',
  },
  {
    nombre: 'permisos.index',
    descripcion: 'Puede listar permisos',
  },
  {
    nombre: 'permisos.show',
    descripcion: 'Puede ver detalle de permiso',
  },
  {
    nombre: 'permisos.store',
    descripcion: 'Puede crear permisos',
  },
  {
    nombre: 'permisos.update',
    descripcion: 'Puede actualizar permisos',
  },
  {
    nombre: 'permisos.destroy',
    descripcion: 'Puede eliminar permisos',
  },
];

async function ejecutarPermisoSeeder() {
  for (const permiso of permisosBase) {
    await prisma.permiso.upsert({
      where: { nombre: permiso.nombre },
      update: {
        descripcion: permiso.descripcion,
      },
      create: {
        nombre: permiso.nombre,
        descripcion: permiso.descripcion,
      },
    });
  }

  console.log('PermisoSeeder ejecutado correctamente');
}

module.exports = {
  ejecutarPermisoSeeder,
};
