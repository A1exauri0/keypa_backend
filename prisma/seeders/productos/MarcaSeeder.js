const prisma = require('../../../src/shared/db/prisma');

const marcasBase = [
  {
    nombre: 'Glow Studio',
    slug: 'glow-studio',
    descripcion: 'Marca enfocada en maquillaje y cuidado personal',
    activo: true,
  },
  {
    nombre: 'Urban Closet',
    slug: 'urban-closet',
    descripcion: 'Marca de ropa casual y urbana',
    activo: true,
  },
  {
    nombre: 'Casa Chic',
    slug: 'casa-chic',
    descripcion: 'Marca de articulos para hogar y regalos',
    activo: true,
  },
];

async function ejecutarMarcaSeeder() {
  for (const marca of marcasBase) {
    await prisma.marca.upsert({
      where: { slug: marca.slug },
      update: {
        nombre: marca.nombre,
        descripcion: marca.descripcion,
        activo: marca.activo,
      },
      create: marca,
    });
  }

  await prisma.marca.deleteMany({
    where: {
      slug: {
        notIn: marcasBase.map((marca) => marca.slug),
      },
    },
  });

  console.log('MarcaSeeder ejecutado correctamente');
}

module.exports = {
  ejecutarMarcaSeeder,
};
