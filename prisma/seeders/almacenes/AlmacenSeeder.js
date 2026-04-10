const prisma = require('../../../src/shared/db/prisma');

const almacenesBase = [
  {
    sucursal: 'Sucursal Tuxtla Centro',
    nombre: 'Almacen Principal Tuxtla',
  }
];

async function ejecutarAlmacenSeeder() {
  for (const almacen of almacenesBase) {
    const sucursal = await prisma.sucursal.findUnique({
      where: { nombre: almacen.sucursal },
      select: { idSucursal: true },
    });

    if (!sucursal) {
      continue;
    }

    await prisma.almacen.upsert({
      where: {
        idSucursal_nombre: {
          idSucursal: sucursal.idSucursal,
          nombre: almacen.nombre,
        },
      },
      update: {
        activo: true,
      },
      create: {
        idSucursal: sucursal.idSucursal,
        nombre: almacen.nombre,
        activo: true,
      },
    });
  }

  console.log('AlmacenSeeder ejecutado correctamente');
}

module.exports = {
  ejecutarAlmacenSeeder,
};
