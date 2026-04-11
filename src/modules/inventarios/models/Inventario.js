const prisma = require('../../../shared/db/prisma');

function includeRelaciones() {
  return {
    almacen: {
      select: {
        idAlmacen: true,
        nombre: true,
        idSucursal: true,
        sucursal: {
          select: { idSucursal: true, nombre: true },
        },
      },
    },
    producto: {
      select: {
        idProducto: true,
        nombre: true,
        sku: true,
        precio: true,
      },
    },
  };
}

async function listarInventarios(db = prisma) {
  return db.inventario.findMany({
    include: includeRelaciones(),
    orderBy: { createdAt: 'desc' },
  });
}

async function obtenerInventarioPorId(idInventario, db = prisma) {
  return db.inventario.findUnique({
    where: { idInventario },
    include: includeRelaciones(),
  });
}

async function existeInventario(idInventario, db = prisma) {
  const inventario = await db.inventario.findUnique({
    where: { idInventario },
    select: { idInventario: true },
  });

  return Boolean(inventario);
}

async function obtenerInventarioPorAlmacenProducto(idAlmacen, idProducto, db = prisma) {
  return db.inventario.findUnique({
    where: {
      idAlmacen_idProducto: {
        idAlmacen,
        idProducto,
      },
    },
    select: {
      idInventario: true,
      idAlmacen: true,
      idProducto: true,
    },
  });
}

async function crearInventarioBase(payload, db = prisma) {
  return db.inventario.create({
    data: payload,
    include: includeRelaciones(),
  });
}

async function actualizarInventarioBase({ idInventario, ...payload }, db = prisma) {
  return db.inventario.update({
    where: { idInventario },
    data: payload,
    include: includeRelaciones(),
  });
}

async function eliminarInventarioPorId(idInventario, db = prisma) {
  return db.inventario.delete({ where: { idInventario } });
}

async function eliminarInventariosMultiplesPorIds(ids, db = prisma) {
  const resultado = await db.inventario.deleteMany({
    where: {
      idInventario: {
        in: ids,
      },
    },
  });

  return resultado.count;
}

module.exports = {
  listarInventarios,
  obtenerInventarioPorId,
  existeInventario,
  obtenerInventarioPorAlmacenProducto,
  crearInventarioBase,
  actualizarInventarioBase,
  eliminarInventarioPorId,
  eliminarInventariosMultiplesPorIds,
};
