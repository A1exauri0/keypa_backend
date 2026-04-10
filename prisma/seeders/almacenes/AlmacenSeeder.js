const prisma = require('../../../src/shared/db/prisma');

const almacenesBase = [
  {
    sucursal: 'Sucursal Tuxtla Centro',
    nombre: 'Almacen Principal Tuxtla',
  }
];

async function ejecutarAlmacenSeeder() {
  const objetivos = [];

  for (const almacen of almacenesBase) {
    const sucursal = await prisma.sucursal.findUnique({
      where: { nombre: almacen.sucursal },
      select: { idSucursal: true },
    });

    if (!sucursal) {
      continue;
    }

    objetivos.push({
      idSucursal: sucursal.idSucursal,
      nombre: almacen.nombre,
    });

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

  if (objetivos.length > 0) {
    await prisma.almacen.deleteMany({
      where: {
        NOT: {
          OR: objetivos.map((item) => ({
            idSucursal: item.idSucursal,
            nombre: item.nombre,
          })),
        },
      },
    });
  }

  console.log('AlmacenSeeder ejecutado correctamente');
}

module.exports = {
  ejecutarAlmacenSeeder,
};
