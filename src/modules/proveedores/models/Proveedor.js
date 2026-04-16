const prisma = require('../../../shared/db/prisma');

async function listarProveedores(db = prisma) {
  return db.proveedor.findMany({
    orderBy: { createdAt: 'desc' },
  });
}

async function obtenerProveedorPorId(idProveedor, db = prisma) {
  return db.proveedor.findUnique({
    where: { idProveedor },
  });
}

async function existeProveedor(idProveedor, db = prisma) {
  const proveedor = await db.proveedor.findUnique({
    where: { idProveedor },
    select: { idProveedor: true },
  });

  return Boolean(proveedor);
}

async function obtenerProveedorPorNombre(nombre, db = prisma) {
  if (!nombre) {
    return null;
  }

  return db.proveedor.findUnique({
    where: { nombre },
    select: { idProveedor: true, nombre: true },
  });
}

async function contarComprasPorProveedor(idProveedor, db = prisma) {
  return db.compra.count({
    where: { idProveedor },
  });
}

async function crearProveedorBase(payload, db = prisma) {
  return db.proveedor.create({
    data: payload,
  });
}

async function actualizarProveedorBase({ idProveedor, ...payload }, db = prisma) {
  return db.proveedor.update({
    where: { idProveedor },
    data: payload,
  });
}

async function eliminarProveedorPorId(idProveedor, db = prisma) {
  return db.proveedor.delete({ where: { idProveedor } });
}

async function eliminarProveedoresMultiplesPorIds(ids, db = prisma) {
  const resultado = await db.proveedor.deleteMany({
    where: {
      idProveedor: {
        in: ids,
      },
    },
  });

  return resultado.count;
}

module.exports = {
  listarProveedores,
  obtenerProveedorPorId,
  existeProveedor,
  obtenerProveedorPorNombre,
  contarComprasPorProveedor,
  crearProveedorBase,
  actualizarProveedorBase,
  eliminarProveedorPorId,
  eliminarProveedoresMultiplesPorIds,
};
