const prisma = require('../../../src/shared/db/prisma');

const proveedoresBase = [
  {
    nombre: 'Proveedor General',
    contactoNombre: 'Operaciones',
    telefono: '9610000000',
    email: 'proveedor.general@keypa.local',
    direccion: 'Tuxtla Gutierrez, Chiapas',
    activo: true,
  },
  {
    nombre: 'Distribuidora MX',
    contactoNombre: 'Compras Regionales',
    telefono: '9611112233',
    email: 'compras@distribuidoramx.local',
    direccion: 'San Cristobal de Las Casas, Chiapas',
    activo: true,
  },
];

async function ejecutarProveedorSeeder() {
  for (const proveedor of proveedoresBase) {
    await prisma.proveedor.upsert({
      where: { nombre: proveedor.nombre },
      update: {
        contactoNombre: proveedor.contactoNombre,
        telefono: proveedor.telefono,
        email: proveedor.email,
        direccion: proveedor.direccion,
        activo: proveedor.activo,
      },
      create: proveedor,
    });
  }

  await prisma.proveedor.deleteMany({
    where: {
      nombre: {
        notIn: proveedoresBase.map((proveedor) => proveedor.nombre),
      },
    },
  });

  console.log('ProveedorSeeder ejecutado correctamente');
}

module.exports = {
  ejecutarProveedorSeeder,
};
