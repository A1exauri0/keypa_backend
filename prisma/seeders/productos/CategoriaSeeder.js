const prisma = require('../../../src/shared/db/prisma');

const categoriasBase = [
  {
    nombre: 'Maquillaje',
    slug: 'maquillaje',
    descripcion: 'Productos cosmeticos y belleza',
    activo: true,
  },
  {
    nombre: 'Ropa',
    slug: 'ropa',
    descripcion: 'Prendas y accesorios de vestir',
    activo: true,
  },
  {
    nombre: 'Hogar',
    slug: 'hogar',
    descripcion: 'Articulos decorativos y utilitarios para casa',
    activo: true,
  },
  {
    nombre: 'Tazas',
    slug: 'tazas',
    descripcion: 'Tazas y articulos de regalo',
    activo: true,
  },
];

async function ejecutarCategoriaSeeder() {
  for (const categoria of categoriasBase) {
    await prisma.categoria.upsert({
      where: { slug: categoria.slug },
      update: {
        nombre: categoria.nombre,
        descripcion: categoria.descripcion,
        activo: categoria.activo,
      },
      create: categoria,
    });
  }

  await prisma.categoria.deleteMany({
    where: {
      slug: {
        notIn: categoriasBase.map((categoria) => categoria.slug),
      },
    },
  });

  console.log('CategoriaSeeder ejecutado correctamente');
}

module.exports = {
  ejecutarCategoriaSeeder,
};
