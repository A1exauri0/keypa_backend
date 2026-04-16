const prisma = require('../../../shared/db/prisma');
const {
  listarCiudades,
  obtenerCiudadPorId,
  obtenerCiudadPorNombre,
  existeCiudad,
  crearCiudadBase,
  actualizarCiudadBase,
  eliminarCiudadPorId,
  eliminarCiudadesMultiplesPorIds,
} = require('../models/Ciudad');

function crearErrorConflicto(message) {
  // Crea error HTTP 409 para nombres de ciudad duplicados.
  const error = new Error(message);
  error.status = 409;
  return error;
}

// Lista todas las ciudades.
async function index() {
  return listarCiudades();
}

// Obtiene detalle de ciudad por ID.
async function show(idCiudad) {
  return obtenerCiudadPorId(idCiudad);
}

// Crea ciudad validando nombre unico.
async function store(payload) {
  return prisma.$transaction(async (tx) => {
    const ciudadExistente = await obtenerCiudadPorNombre(payload.nombre, tx);
    if (ciudadExistente) {
      throw crearErrorConflicto('Ya existe una ciudad con ese nombre');
    }

    return crearCiudadBase(payload, tx);
  });
}

// Actualiza ciudad validando existencia y conflicto de nombre.
async function update(idCiudad, payload) {
  return prisma.$transaction(async (tx) => {
    const existe = await existeCiudad(idCiudad, tx);
    if (!existe) {
      return null;
    }

    if (payload.nombre !== undefined) {
      const ciudadExistente = await obtenerCiudadPorNombre(payload.nombre, tx);
      if (ciudadExistente && ciudadExistente.idCiudad !== idCiudad) {
        throw crearErrorConflicto('Ya existe una ciudad con ese nombre');
      }
    }

    return actualizarCiudadBase({ idCiudad, ...payload }, tx);
  });
}

// Elimina una ciudad por ID si existe.
async function destroy(idCiudad) {
  return prisma.$transaction(async (tx) => {
    const existe = await existeCiudad(idCiudad, tx);
    if (!existe) {
      return false;
    }

    await eliminarCiudadPorId(idCiudad, tx);
    return true;
  });
}

// Elimina varias ciudades por IDs.
async function destroyMany(ids) {
  return prisma.$transaction(async (tx) => {
    return eliminarCiudadesMultiplesPorIds(ids, tx);
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
