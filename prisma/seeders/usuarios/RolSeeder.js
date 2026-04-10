const prisma = require('../../../src/shared/db/prisma');

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

  await prisma.rol.deleteMany({
    where: {
      nombre: {
        notIn: rolesBase.map((rol) => rol.nombre),
      },
    },
  });

  console.log('RolSeeder ejecutado correctamente');
}

module.exports = {
  ejecutarRolSeeder,
};
