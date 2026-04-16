const prisma = require('../../../shared/db/prisma');

function includeRelaciones() {
  return {
    proveedor: {
      select: {
        idProveedor: true,
        nombre: true,
      },
    },
    usuario: {
      select: {
        idUsuario: true,
        nombre: true,
        email: true,
      },
    },
    almacen: {
      select: {
        idAlmacen: true,
        nombre: true,
        sucursal: {
          select: { idSucursal: true, nombre: true },
        },
      },
    },
    detalles: {
      include: {
        producto: {
          select: {
            idProducto: true,
            nombre: true,
            sku: true,
          },
        },
      },
      orderBy: { idCompraDetalle: 'asc' },
    },
  };
}

async function listarCompras(db = prisma) {
  return db.compra.findMany({
    include: includeRelaciones(),
    orderBy: { createdAt: 'desc' },
  });
}

async function obtenerCompraPorId(idCompra, db = prisma) {
  return db.compra.findUnique({
    where: { idCompra },
    include: includeRelaciones(),
  });
}

async function obtenerCompraConDetalleStock(idCompra, db = prisma) {
  return db.compra.findUnique({
    where: { idCompra },
    include: {
      detalles: {
        select: {
          idProducto: true,
          cantidad: true,
        },
      },
      almacen: {
        select: {
          idAlmacen: true,
        },
      },
    },
  });
}

async function crearCompraBase(payload, db = prisma) {
  return db.compra.create({
    data: payload,
    include: includeRelaciones(),
  });
}

async function actualizarEstadoCompraBase(idCompra, estado, db = prisma) {
  return db.compra.update({
    where: { idCompra },
    data: { estado },
    include: includeRelaciones(),
  });
}

module.exports = {
  listarCompras,
  obtenerCompraPorId,
  obtenerCompraConDetalleStock,
  crearCompraBase,
  actualizarEstadoCompraBase,
};
