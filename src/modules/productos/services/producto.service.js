const prisma = require('../../../shared/db/prisma');
const { eliminarArchivosLocalesPorUrl } = require('../../../shared/utils/storageFiles');
const {
  listarProductos,
  obtenerProductoPorId,
  obtenerProductoPorSlug,
  crearProductoBase,
  existeProducto,
  actualizarProductoBase,
  reemplazarCategoriasProducto,
  reemplazarImagenesProducto,
  eliminarProductoPorId,
  eliminarProductosMultiplesPorIds,
} = require('../models/Producto');

function crearErrorConflicto(message) {
  // Crea un error de conflicto de dominio para respuestas 409.
  const error = new Error(message);
  error.status = 409;
  return error;
}

async function index(filtros) {
  // Lista productos usando filtros de busqueda opcionales.
  return listarProductos(filtros);
}

async function show(idProducto) {
  // Obtiene el detalle de un producto por su ID.
  return obtenerProductoPorId(idProducto);
}

async function store(payload) {
  // Crea un producto con sus categorias e imagenes en una transaccion.
  return prisma.$transaction(async (tx) => {
    const slugExistente = await obtenerProductoPorSlug(payload.slug, tx);
    if (slugExistente) {
      throw crearErrorConflicto('El slug del producto ya existe');
    }

    const categorias = Array.isArray(payload.categorias) ? payload.categorias : [];
    const imagenes = Array.isArray(payload.imagenes) ? payload.imagenes : [];

    const creado = await crearProductoBase(payload, tx);

    await reemplazarCategoriasProducto(creado.idProducto, categorias, tx);
    await reemplazarImagenesProducto(creado.idProducto, imagenes, tx);

    return obtenerProductoPorId(creado.idProducto, tx);
  });
}

async function update(idProducto, payload) {
  // Actualiza un producto y limpia archivos de imagen que quedan huerfanos.
  const resultado = await prisma.$transaction(async (tx) => {
    const existe = await existeProducto(idProducto, tx);
    if (!existe) {
      return { producto: null, urlsAEliminar: [] };
    }

    const anterior = await obtenerProductoPorId(idProducto, tx);

    if (payload.slug !== undefined) {
      const slugExistente = await obtenerProductoPorSlug(payload.slug, tx);
      if (slugExistente && slugExistente.idProducto !== idProducto) {
        throw crearErrorConflicto('El slug del producto ya existe');
      }
    }

    await actualizarProductoBase(idProducto, payload, tx);

    if (Array.isArray(payload.categorias)) {
      await reemplazarCategoriasProducto(idProducto, payload.categorias, tx);
    }

    if (Array.isArray(payload.imagenes)) {
      await reemplazarImagenesProducto(idProducto, payload.imagenes, tx);
    }

    const urlsAnteriores = (anterior?.imagenes || []).map((item) => item.url).filter(Boolean);
    const urlsNuevas = Array.isArray(payload.imagenes)
      ? payload.imagenes.map((item) => item.url).filter(Boolean)
      : urlsAnteriores;

    const urlsAEliminar = Array.isArray(payload.imagenes)
      ? urlsAnteriores.filter((url) => !urlsNuevas.includes(url))
      : [];

    const producto = await obtenerProductoPorId(idProducto, tx);

    return { producto, urlsAEliminar };
  });

  await eliminarArchivosLocalesPorUrl(resultado.urlsAEliminar);

  return resultado.producto;
}

async function destroy(idProducto) {
  // Elimina un producto individual si existe.
  return prisma.$transaction(async (tx) => {
    const existe = await existeProducto(idProducto, tx);
    if (!existe) {
      return false;
    }

    await eliminarProductoPorId(idProducto, tx);
    return true;
  });
}

async function destroyMany(ids) {
  // Elimina multiples productos por una lista de IDs.
  return prisma.$transaction(async (tx) => {
    return eliminarProductosMultiplesPorIds(ids, tx);
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
