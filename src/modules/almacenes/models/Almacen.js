const prisma = require('../../../shared/db/prisma');

function includeRelaciones() {
  return {
    sucursal: {
      select: { idSucursal: true, nombre: true, activo: true },
    },
  };
}

async function listarAlmacenes(db = prisma) {
  return db.almacen.findMany({
    include: includeRelaciones(),
    orderBy: { createdAt: 'desc' },
  });
}

async function obtenerAlmacenPorId(idAlmacen, db = prisma) {
  return db.almacen.findUnique({
    where: { idAlmacen },
    include: includeRelaciones(),
  });
}

async function existeAlmacen(idAlmacen, db = prisma) {
  const almacen = await db.almacen.findUnique({
    where: { idAlmacen },
    select: { idAlmacen: true },
  });

  return Boolean(almacen);
}

async function obtenerAlmacenPorSucursalYNombre(idSucursal, nombre, db = prisma) {
  return db.almacen.findFirst({
    where: { idSucursal, nombre },
    select: { idAlmacen: true, idSucursal: true, nombre: true },
  });
}

async function crearAlmacenBase(payload, db = prisma) {
  return db.almacen.create({
    data: payload,
    include: includeRelaciones(),
  });
}

async function actualizarAlmacenBase({ idAlmacen, ...payload }, db = prisma) {
  return db.almacen.update({
    where: { idAlmacen },
    data: payload,
    include: includeRelaciones(),
  });
}

async function eliminarAlmacenPorId(idAlmacen, db = prisma) {
  return db.almacen.delete({ where: { idAlmacen } });
}

async function eliminarAlmacenesMultiplesPorIds(ids, db = prisma) {
  const resultado = await db.almacen.deleteMany({
    where: {
      idAlmacen: {
        in: ids,
      },
    },
  });

  return resultado.count;
}

module.exports = {
  listarAlmacenes,
  obtenerAlmacenPorId,
  existeAlmacen,
  obtenerAlmacenPorSucursalYNombre,
  crearAlmacenBase,
  actualizarAlmacenBase,
  eliminarAlmacenPorId,
  eliminarAlmacenesMultiplesPorIds,
};
