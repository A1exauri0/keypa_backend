const prisma = require('../../../src/shared/db/prisma');

const ciudadesChiapasBase = [
  'Tuxtla Gutierrez',
  'San Cristobal de las Casas',
  'Tapachula',
  'Comitan de Dominguez',
  'Palenque',
  'Chiapa de Corzo',
  'Ocosingo',
  'Tonalá',
];

async function ejecutarCiudadSeeder() {
  for (const nombreCiudad of ciudadesChiapasBase) {
    await prisma.ciudad.upsert({
      where: { nombre: nombreCiudad },
      update: {
        estado: 'Chiapas',
        activo: true,
      },
      create: {
        nombre: nombreCiudad,
        estado: 'Chiapas',
        activo: true,
      },
    });
  }

  await prisma.ciudad.deleteMany({
    where: {
      nombre: {
        notIn: ciudadesChiapasBase,
      },
    },
  });

  console.log('CiudadSeeder ejecutado correctamente');
}

module.exports = {
  ejecutarCiudadSeeder,
};
