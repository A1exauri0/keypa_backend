const prisma = require('../../../src/shared/db/prisma');

function calcularStockBase(indexAlmacen, indexProducto) {
  const stockActual = 8 + ((indexAlmacen + indexProducto) % 12);

  return {
    stockActual,
  };
}

async function ejecutarInventarioSeeder() {
  const [almacenes, productos] = await Promise.all([
    prisma.almacen.findMany({
      where: {
        activo: true,
        nombre: {
          contains: 'Tuxtla',
        },
      },
      select: { idAlmacen: true, nombre: true },
      orderBy: { idAlmacen: 'asc' },
    }),
    prisma.producto.findMany({
      where: { activo: true },
      select: { idProducto: true, nombre: true, sku: true },
      orderBy: { idProducto: 'asc' },
    }),
  ]);

  if (almacenes.length < 1 || productos.length < 1) {
    console.log('InventarioSeeder omitido: no hay almacenes o productos activos');
    return;
  }

  const objetivos = [];

  for (const [indexAlmacen, almacen] of almacenes.entries()) {
    for (const [indexProducto, producto] of productos.entries()) {
      const stock = calcularStockBase(indexAlmacen, indexProducto);

      objetivos.push({
        idAlmacen: almacen.idAlmacen,
        idProducto: producto.idProducto,
      });

      await prisma.inventario.upsert({
        where: {
          idAlmacen_idProducto: {
            idAlmacen: almacen.idAlmacen,
            idProducto: producto.idProducto,
          },
        },
        update: {
          stockActual: stock.stockActual,
        },
        create: {
          idAlmacen: almacen.idAlmacen,
          idProducto: producto.idProducto,
          stockActual: stock.stockActual,
        },
      });
    }
  }

  await prisma.inventario.deleteMany({
    where: {
      NOT: {
        OR: objetivos.map((item) => ({
          idAlmacen: item.idAlmacen,
          idProducto: item.idProducto,
        })),
      },
    },
  });

  console.log('InventarioSeeder ejecutado correctamente');
}

module.exports = {
  ejecutarInventarioSeeder,
};
