const prisma = require('../../../shared/db/prisma');
const { existeCiudad } = require('../../ubicaciones/models/Ciudad');
const { obtenerColoniaPorId } = require('../../ubicaciones/models/Colonia');
const {
  listarSucursales,
  obtenerSucursalPorId,
  existeSucursal,
  obtenerSucursalPorNombre,
  crearSucursalBase,
  actualizarSucursalBase,
  eliminarSucursalPorId,
  eliminarSucursalesMultiplesPorIds,
} = require('../models/Sucursal');

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
    nombre: payload.nombre?.trim(),
    telefono: payload.telefono?.trim(),
    email: payload.email ? payload.email.trim().toLowerCase() : null,
    encargado: payload.encargado?.trim() || null,
    direccion: payload.direccion?.trim(),
    numeroExterior: payload.numeroExterior?.trim() || null,
    numeroInterior: payload.numeroInterior?.trim() || null,
    referencias: payload.referencias?.trim() || null,
    codigoPostal: payload.codigoPostal?.trim() || null,
    idCiudad: payload.idCiudad ?? null,
    idColonia: payload.idColonia ?? null,
    activo: payload.activo !== undefined ? Boolean(payload.activo) : true,
  };
}

async function validarRelacionUbicacion({ idCiudad, idColonia }, tx) {
  if (idCiudad !== null) {
    const ciudadValida = await existeCiudad(idCiudad, tx);
    if (!ciudadValida) {
      throw crearErrorValidacion('La ciudad seleccionada no existe');
    }
  }

  if (idColonia !== null) {
    const colonia = await obtenerColoniaPorId(idColonia, tx);
    if (!colonia) {
      throw crearErrorValidacion('La colonia seleccionada no existe');
    }

    if (idCiudad !== null && colonia.idCiudad !== idCiudad) {
      throw crearErrorValidacion('La colonia no pertenece a la ciudad seleccionada');
    }
  }
}

async function index() {
  return listarSucursales();
}

async function show(idSucursal) {
  return obtenerSucursalPorId(idSucursal);
}

async function store(payload) {
  return prisma.$transaction(async (tx) => {
    const data = normalizarPayload(payload);

    const sucursalExistente = await obtenerSucursalPorNombre(data.nombre, tx);
    if (sucursalExistente) {
      throw crearErrorConflicto('Ya existe una sucursal con ese nombre');
    }

    await validarRelacionUbicacion(data, tx);

    return crearSucursalBase(data, tx);
  });
}

async function update(idSucursal, payload) {
  return prisma.$transaction(async (tx) => {
    const existe = await existeSucursal(idSucursal, tx);
    if (!existe) {
      return null;
    }

    const data = normalizarPayload(payload);
    const sucursalActual = await obtenerSucursalPorId(idSucursal, tx);

    const nombreDestino = payload.nombre !== undefined ? data.nombre : sucursalActual.nombre;
    const idCiudadDestino = payload.idCiudad !== undefined ? data.idCiudad : sucursalActual.idCiudad;
    const idColoniaDestino = payload.idColonia !== undefined ? data.idColonia : sucursalActual.idColonia;

    if (nombreDestino) {
      const sucursalExistente = await obtenerSucursalPorNombre(nombreDestino, tx);
      if (sucursalExistente && sucursalExistente.idSucursal !== idSucursal) {
        throw crearErrorConflicto('Ya existe una sucursal con ese nombre');
      }
    }

    await validarRelacionUbicacion({ idCiudad: idCiudadDestino, idColonia: idColoniaDestino }, tx);

    const payloadUpdate = {
      ...(payload.nombre !== undefined ? { nombre: data.nombre } : {}),
      ...(payload.telefono !== undefined ? { telefono: data.telefono } : {}),
      ...(payload.email !== undefined ? { email: data.email } : {}),
      ...(payload.encargado !== undefined ? { encargado: data.encargado } : {}),
      ...(payload.direccion !== undefined ? { direccion: data.direccion } : {}),
      ...(payload.numeroExterior !== undefined ? { numeroExterior: data.numeroExterior } : {}),
      ...(payload.numeroInterior !== undefined ? { numeroInterior: data.numeroInterior } : {}),
      ...(payload.referencias !== undefined ? { referencias: data.referencias } : {}),
      ...(payload.codigoPostal !== undefined ? { codigoPostal: data.codigoPostal } : {}),
      ...(payload.idCiudad !== undefined ? { idCiudad: data.idCiudad } : {}),
      ...(payload.idColonia !== undefined ? { idColonia: data.idColonia } : {}),
      ...(payload.activo !== undefined ? { activo: Boolean(payload.activo) } : {}),
    };

    return actualizarSucursalBase({ idSucursal, ...payloadUpdate }, tx);
  });
}

async function destroy(idSucursal) {
  return prisma.$transaction(async (tx) => {
    const existe = await existeSucursal(idSucursal, tx);
    if (!existe) {
      return false;
    }

    await eliminarSucursalPorId(idSucursal, tx);
    return true;
  });
}

async function destroyMany(ids) {
  return prisma.$transaction(async (tx) => {
    return eliminarSucursalesMultiplesPorIds(ids, tx);
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
