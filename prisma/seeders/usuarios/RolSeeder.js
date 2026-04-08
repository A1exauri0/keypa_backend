const prisma = require('../../../config/prisma');

const rolesBase = [
  {
    nombre: 'admin',
    descripcion: 'Rol administrador con acceso total',
  },
  {
    nombre: 'vendedor',
    descripcion: 'Rol vendedor para operaciones de ventas',
  },
];

async function ejecutarRolSeeder() {
  for (const rol of rolesBase) {
    await prisma.rol.upsert({
      where: { nombre: rol.nombre },
      update: {
        descripcion: rol.descripcion,
      },
      create: {
        nombre: rol.nombre,
        descripcion: rol.descripcion,
      },
    });
  }

  console.log('RolSeeder ejecutado correctamente');
}

module.exports = {
  ejecutarRolSeeder,
};
