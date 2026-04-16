const prisma = require('../../../shared/db/prisma');
const {
  listarCategorias,
  obtenerCategoriaPorId,
  obtenerCategoriaPorSlug,
  existeCategoria,
  crearCategoriaBase,
  actualizarCategoriaBase,
  eliminarCategoriaPorId,
  eliminarCategoriasMultiplesPorIds,
} = require('../models/Categoria');

function crearErrorConflicto(message) {
  // Crea un error de conflicto para slugs de categoria duplicados.
  const error = new Error(message);
  error.status = 409;
  return error;
}

async function index() {
  // Lista todas las categorias disponibles.
  return listarCategorias();
}

async function show(idCategoria) {
  // Obtiene una categoria por su ID.
  return obtenerCategoriaPorId(idCategoria);
}

async function store(payload) {
  // Crea una categoria nueva validando unicidad de slug.
  return prisma.$transaction(async (tx) => {
    const slugExistente = await obtenerCategoriaPorSlug(payload.slug, tx);
    if (slugExistente) {
      throw crearErrorConflicto('El slug de la categoria ya existe');
    }

    return crearCategoriaBase(payload, tx);
  });
}

async function update(idCategoria, payload) {
  // Actualiza una categoria existente y valida conflicto de slug.
  return prisma.$transaction(async (tx) => {
    const existe = await existeCategoria(idCategoria, tx);
    if (!existe) {
      return null;
    }

    if (payload.slug !== undefined) {
      const slugExistente = await obtenerCategoriaPorSlug(payload.slug, tx);
      if (slugExistente && slugExistente.idCategoria !== idCategoria) {
        throw crearErrorConflicto('El slug de la categoria ya existe');
      }
    }

    return actualizarCategoriaBase({ idCategoria, ...payload }, tx);
  });
}

async function destroy(idCategoria) {
  // Elimina una categoria individual si existe.
  return prisma.$transaction(async (tx) => {
    const existe = await existeCategoria(idCategoria, tx);
    if (!existe) {
      return false;
    }

    await eliminarCategoriaPorId(idCategoria, tx);
    return true;
  });
}

async function destroyMany(ids) {
  // Elimina varias categorias por IDs en una transaccion.
  return prisma.$transaction(async (tx) => {
    return eliminarCategoriasMultiplesPorIds(ids, tx);
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
