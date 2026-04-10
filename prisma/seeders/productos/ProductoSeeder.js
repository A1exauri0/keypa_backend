const prisma = require('../../../src/shared/db/prisma');

const productosBase = [
  {
    nombre: 'Labial Velvet Rose',
    slug: 'labial-velvet-rose',
    sku: 'MK-LAB-001',
    descripcion: 'Labial mate de larga duracion tono rosa',
    tipo: 'Maquillaje',
    disponibilidad: 'Disponible',
    precio: 249.9,
    costo: 120,
    color: 'Rosa Intenso',
    tono: 'Warm Rose',
    idMarcaSlug: 'glow-studio',
    categoriasSlug: ['maquillaje'],
    imagenes: [
      {
        url: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9',
        alt: 'Labial velvet rose',
        orden: 1,
        principal: true,
      },
    ],
  },
  {
    nombre: 'Blusa Satin Lilac',
    slug: 'blusa-satin-lilac',
    sku: 'RP-BLU-010',
    descripcion: 'Blusa satinada para uso casual',
    tipo: 'Ropa',
    disponibilidad: 'Disponible',
    precio: 699,
    costo: 340,
    color: 'Lila',
    talla: 'M',
    material: 'Satin',
    idMarcaSlug: 'urban-closet',
    categoriasSlug: ['ropa'],
    imagenes: [
      {
        url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab',
        alt: 'Blusa satin lilac',
        orden: 1,
        principal: true,
      },
    ],
  },
  {
    nombre: 'Taza Ceramica Corazon',
    slug: 'taza-ceramica-corazon',
    sku: 'HG-TAZ-007',
    descripcion: 'Taza ceramica de 350ml para regalo',
    tipo: 'Accesorios',
    disponibilidad: 'Disponible',
    precio: 189,
    costo: 80,
    material: 'Ceramica',
    idMarcaSlug: 'casa-chic',
    categoriasSlug: ['hogar', 'tazas'],
    imagenes: [
      {
        url: 'https://images.unsplash.com/photo-1514228742587-6b1558fcf93a',
        alt: 'Taza ceramica corazon',
        orden: 1,
        principal: true,
      },
    ],
  },
];

async function ejecutarProductoSeeder() {
  for (const producto of productosBase) {
    const marca = await prisma.marca.findUnique({
      where: { slug: producto.idMarcaSlug },
      select: { idMarca: true },
    });

    if (!marca) {
      continue;
    }

    const categorias = await prisma.categoria.findMany({
      where: { slug: { in: producto.categoriasSlug } },
      select: { idCategoria: true },
    });

    if (categorias.length === 0) {
      continue;
    }

    await prisma.producto.upsert({
      where: { slug: producto.slug },
      update: {
        nombre: producto.nombre,
        sku: producto.sku,
        descripcion: producto.descripcion,
        tipo: producto.tipo,
        disponibilidad: producto.disponibilidad,
        precio: producto.precio,
        costo: producto.costo,
        color: producto.color || null,
        talla: producto.talla || null,
        tono: producto.tono || null,
        material: producto.material || null,
        idMarca: marca.idMarca,
        activo: true,
      },
      create: {
        nombre: producto.nombre,
        slug: producto.slug,
        sku: producto.sku,
        descripcion: producto.descripcion,
        tipo: producto.tipo,
        disponibilidad: producto.disponibilidad,
        precio: producto.precio,
        costo: producto.costo,
        color: producto.color || null,
        talla: producto.talla || null,
        tono: producto.tono || null,
        material: producto.material || null,
        idMarca: marca.idMarca,
        activo: true,
      },
    });

    const productoDb = await prisma.producto.findUnique({
      where: { slug: producto.slug },
      select: { idProducto: true },
    });

    if (!productoDb) {
      continue;
    }

    await prisma.productoCategoria.deleteMany({
      where: { idProducto: productoDb.idProducto },
    });

    await prisma.productoCategoria.createMany({
      data: categorias.map((categoria) => ({
        idProducto: productoDb.idProducto,
        idCategoria: categoria.idCategoria,
      })),
      skipDuplicates: true,
    });

    await prisma.productoImagen.deleteMany({
      where: { idProducto: productoDb.idProducto },
    });

    await prisma.productoImagen.createMany({
      data: (producto.imagenes || []).map((imagen) => ({
        idProducto: productoDb.idProducto,
        url: imagen.url,
        alt: imagen.alt,
        orden: imagen.orden || 0,
        principal: Boolean(imagen.principal),
      })),
    });
  }

  console.log('ProductoSeeder ejecutado correctamente');
}

module.exports = {
  ejecutarProductoSeeder,
};
