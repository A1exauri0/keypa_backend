const prisma = require('../../../config/prisma');

const permisosBase = [
  {
    nombre: 'usuarios.ver',
    descripcion: 'Puede consultar usuarios',
  },
  {
    nombre: 'usuarios.gestionar',
    descripcion: 'Puede crear, editar y desactivar usuarios',
  },
  {
    nombre: 'productos.ver',
    descripcion: 'Puede consultar productos',
  },
  {
    nombre: 'productos.gestionar',
    descripcion: 'Puede crear, editar y actualizar stock',
  },
  {
    nombre: 'ventas.gestionar',
    descripcion: 'Puede registrar y administrar ventas',
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
