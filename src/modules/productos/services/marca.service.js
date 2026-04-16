const prisma = require('../../../shared/db/prisma');
const {
  listarMarcas,
  obtenerMarcaPorId,
  obtenerMarcaPorSlug,
  existeMarca,
  crearMarcaBase,
  actualizarMarcaBase,
  eliminarMarcaPorId,
  eliminarMarcasMultiplesPorIds,
} = require('../models/Marca');

function crearErrorConflicto(message) {
  // Crea un error de conflicto para reportar slugs duplicados.
  const error = new Error(message);
  error.status = 409;
  return error;
}

async function index() {
  // Lista todas las marcas del catalogo.
  return listarMarcas();
}

async function show(idMarca) {
  // Obtiene una marca por su ID.
  return obtenerMarcaPorId(idMarca);
}

async function store(payload) {
  // Crea una marca validando unicidad de slug en transaccion.
  return prisma.$transaction(async (tx) => {
    const slugExistente = await obtenerMarcaPorSlug(payload.slug, tx);
    if (slugExistente) {
      throw crearErrorConflicto('El slug de la marca ya existe');
    }

    return crearMarcaBase(payload, tx);
  });
}

async function update(idMarca, payload) {
  // Actualiza una marca existente validando conflictos de slug.
  return prisma.$transaction(async (tx) => {
    const existe = await existeMarca(idMarca, tx);
    if (!existe) {
      return null;
    }

    if (payload.slug !== undefined) {
      const slugExistente = await obtenerMarcaPorSlug(payload.slug, tx);
      if (slugExistente && slugExistente.idMarca !== idMarca) {
        throw crearErrorConflicto('El slug de la marca ya existe');
      }
    }

    return actualizarMarcaBase({ idMarca, ...payload }, tx);
  });
}

async function destroy(idMarca) {
  // Elimina una marca individual si existe.
  return prisma.$transaction(async (tx) => {
    const existe = await existeMarca(idMarca, tx);
    if (!existe) {
      return false;
    }

    await eliminarMarcaPorId(idMarca, tx);
    return true;
  });
}

async function destroyMany(ids) {
  // Elimina varias marcas por IDs en una sola operacion.
  return prisma.$transaction(async (tx) => {
    return eliminarMarcasMultiplesPorIds(ids, tx);
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
