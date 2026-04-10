const prisma = require('../../../shared/db/prisma');
const { existeSucursal } = require('../../sucursales/models/Sucursal');
const {
  listarAlmacenes,
  obtenerAlmacenPorId,
  existeAlmacen,
  obtenerAlmacenPorSucursalYNombre,
  crearAlmacenBase,
  actualizarAlmacenBase,
  eliminarAlmacenPorId,
  eliminarAlmacenesMultiplesPorIds,
} = require('../models/Almacen');

function crearErrorConflicto(message) {
  const error = new Error(message);
  error.status = 409;
  return error;
}

function crearErrorValidacion(message) {
  const error = new Error(message);
  error.status = 422;
  return error;
}

function normalizarPayload(payload) {
  return {
    idSucursal: payload.idSucursal,
    nombre: payload.nombre?.trim(),
    activo: payload.activo !== undefined ? Boolean(payload.activo) : true,
  };
}

async function index() {
  return listarAlmacenes();
}

async function show(idAlmacen) {
  return obtenerAlmacenPorId(idAlmacen);
}

async function store(payload) {
  return prisma.$transaction(async (tx) => {
    const data = normalizarPayload(payload);

    const sucursalValida = await existeSucursal(data.idSucursal, tx);
    if (!sucursalValida) {
      throw crearErrorValidacion('La sucursal seleccionada no existe');
    }

    const almacenExistente = await obtenerAlmacenPorSucursalYNombre(data.idSucursal, data.nombre, tx);
    if (almacenExistente) {
      throw crearErrorConflicto('Ya existe un almacen con ese nombre en la sucursal');
    }

    return crearAlmacenBase(data, tx);
  });
}

async function update(idAlmacen, payload) {
  return prisma.$transaction(async (tx) => {
    const existe = await existeAlmacen(idAlmacen, tx);
    if (!existe) {
      return null;
    }

    const data = normalizarPayload(payload);
    const almacenActual = await obtenerAlmacenPorId(idAlmacen, tx);

    const idSucursalDestino = payload.idSucursal !== undefined ? data.idSucursal : almacenActual.idSucursal;
    const nombreDestino = payload.nombre !== undefined ? data.nombre : almacenActual.nombre;

    const sucursalValida = await existeSucursal(idSucursalDestino, tx);
    if (!sucursalValida) {
      throw crearErrorValidacion('La sucursal seleccionada no existe');
    }

    const almacenExistente = await obtenerAlmacenPorSucursalYNombre(idSucursalDestino, nombreDestino, tx);
    if (almacenExistente && almacenExistente.idAlmacen !== idAlmacen) {
      throw crearErrorConflicto('Ya existe un almacen con ese nombre en la sucursal');
    }

    const payloadUpdate = {
      ...(payload.idSucursal !== undefined ? { idSucursal: data.idSucursal } : {}),
      ...(payload.nombre !== undefined ? { nombre: data.nombre } : {}),
      ...(payload.activo !== undefined ? { activo: Boolean(payload.activo) } : {}),
    };

    return actualizarAlmacenBase({ idAlmacen, ...payloadUpdate }, tx);
  });
}

async function destroy(idAlmacen) {
  return prisma.$transaction(async (tx) => {
    const existe = await existeAlmacen(idAlmacen, tx);
    if (!existe) {
      return false;
    }

    await eliminarAlmacenPorId(idAlmacen, tx);
    return true;
  });
}

async function destroyMany(ids) {
  return prisma.$transaction(async (tx) => {
    return eliminarAlmacenesMultiplesPorIds(ids, tx);
  });
}

module.exports = {
  index,
  show,
  store,
  update,
  destroy,
  destroyMany,
};
