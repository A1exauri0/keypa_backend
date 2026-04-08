const prisma = require('../../../config/prisma');

const productosBase = [];

async function ejecutarProductoSeeder() {
  for (const producto of productosBase) {
    await prisma.producto.upsert({
      where: { nombre: producto.nombre },
      update: {
        descripcion: producto.descripcion,
        precio: producto.precio,
        stock: producto.stock,
      },
      create: {
        nombre: producto.nombre,
        descripcion: producto.descripcion,
        precio: producto.precio,
        stock: producto.stock,
      },
    });
  }

  console.log('ProductoSeeder ejecutado correctamente');
}

module.exports = {
  ejecutarProductoSeeder,
};
