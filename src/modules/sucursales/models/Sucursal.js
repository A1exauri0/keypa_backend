const prisma = require('../../../shared/db/prisma');

function includeUbicacionYAlmacenes() {
  return {
    ciudad: {
      select: { idCiudad: true, nombre: true, estado: true },
    },
    colonia: {
      select: { idColonia: true, nombre: true, codigoPostal: true, idCiudad: true },
    },
    _count: {
      select: { almacenes: true },
    },
  };
}

async function listarSucursales(db = prisma) {
  return db.sucursal.findMany({
    include: includeUbicacionYAlmacenes(),
    orderBy: { createdAt: 'desc' },
  });
}

async function obtenerSucursalPorId(idSucursal, db = prisma) {
  return db.sucursal.findUnique({
    where: { idSucursal },
    include: includeUbicacionYAlmacenes(),
  });
}

async function existeSucursal(idSucursal, db = prisma) {
  const sucursal = await db.sucursal.findUnique({
    where: { idSucursal },
    select: { idSucursal: true },
  });

  return Boolean(sucursal);
}

async function obtenerSucursalPorNombre(nombre, db = prisma) {
  return db.sucursal.findFirst({
    where: { nombre },
    select: { idSucursal: true, nombre: true },
  });
}

async function crearSucursalBase(payload, db = prisma) {
  return db.sucursal.create({
    data: payload,
    include: includeUbicacionYAlmacenes(),
  });
}

async function actualizarSucursalBase({ idSucursal, ...payload }, db = prisma) {
  return db.sucursal.update({
    where: { idSucursal },
    data: payload,
    include: includeUbicacionYAlmacenes(),
  });
}

async function eliminarSucursalPorId(idSucursal, db = prisma) {
  return db.sucursal.delete({ where: { idSucursal } });
}

async function eliminarSucursalesMultiplesPorIds(ids, db = prisma) {
  const resultado = await db.sucursal.deleteMany({
    where: {
      idSucursal: {
        in: ids,
      },
    },
  });

  return resultado.count;
}

module.exports = {
  listarSucursales,
  obtenerSucursalPorId,
  existeSucursal,
  obtenerSucursalPorNombre,
  crearSucursalBase,
  actualizarSucursalBase,
  eliminarSucursalPorId,
  eliminarSucursalesMultiplesPorIds,
};
