const prisma = require('../../../shared/db/prisma');
const { existeCiudad } = require('../models/Ciudad');
const {
  listarColonias,
  obtenerColoniaPorId,
  obtenerColoniaUnica,
  existeColonia,
  crearColoniaBase,
  actualizarColoniaBase,
  eliminarColoniaPorId,
  eliminarColoniasMultiplesPorIds,
} = require('../models/Colonia');

function crearErrorConflicto(message) {
  // Crea error HTTP 409 para colonias duplicadas dentro de la misma ciudad.
  const error = new Error(message);
  error.status = 409;
  return error;
}

function crearErrorValidacion(message) {
  // Crea error HTTP 422 para datos de relacion invalidos.
  const error = new Error(message);
  error.status = 422;
  return error;
}

// Lista colonias con filtro opcional por ciudad.
async function index({ idCiudad } = {}) {
  return listarColonias({ idCiudad });
}

// Obtiene detalle de colonia por ID.
async function show(idColonia) {
  return obtenerColoniaPorId(idColonia);
}

// Crea colonia validando ciudad existente y duplicados por clave compuesta.
async function store(payload) {
  return prisma.$transaction(async (tx) => {
    const ciudadValida = await existeCiudad(payload.idCiudad, tx);
    if (!ciudadValida) {
      throw crearErrorValidacion('La ciudad seleccionada no existe');
    }

    const coloniaExistente = await obtenerColoniaUnica(
      {
        idCiudad: payload.idCiudad,
        nombre: payload.nombre,
        codigoPostal: payload.codigoPostal,
      },
      tx,
    );

    if (coloniaExistente) {
      throw crearErrorConflicto('Ya existe esa colonia con el mismo codigo postal en la ciudad');
    }

    return crearColoniaBase(payload, tx);
  });
}

// Actualiza colonia validando existencia, ciudad destino y duplicados.
async function update(idColonia, payload) {
  return prisma.$transaction(async (tx) => {
    const existe = await existeColonia(idColonia, tx);
    if (!existe) {
      return null;
    }

    const coloniaActual = await obtenerColoniaPorId(idColonia, tx);
    const idCiudadDestino = payload.idCiudad ?? coloniaActual.idCiudad;
    const nombreDestino = payload.nombre ?? coloniaActual.nombre;
    const codigoDestino = payload.codigoPostal ?? coloniaActual.codigoPostal;

    const ciudadValida = await existeCiudad(idCiudadDestino, tx);
    if (!ciudadValida) {
      throw crearErrorValidacion('La ciudad seleccionada no existe');
    }

    const coloniaExistente = await obtenerColoniaUnica(
      {
        idCiudad: idCiudadDestino,
        nombre: nombreDestino,
        codigoPostal: codigoDestino,
      },
      tx,
    );

    if (coloniaExistente && coloniaExistente.idColonia !== idColonia) {
      throw crearErrorConflicto('Ya existe esa colonia con el mismo codigo postal en la ciudad');
    }

    return actualizarColoniaBase({ idColonia, ...payload }, tx);
  });
}

// Elimina una colonia por ID si existe.
async function destroy(idColonia) {
  return prisma.$transaction(async (tx) => {
    const existe = await existeColonia(idColonia, tx);
    if (!existe) {
      return false;
    }

    await eliminarColoniaPorId(idColonia, tx);
    return true;
  });
}

// Elimina varias colonias por IDs.
async function destroyMany(ids) {
  return prisma.$transaction(async (tx) => {
    return eliminarColoniasMultiplesPorIds(ids, tx);
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
