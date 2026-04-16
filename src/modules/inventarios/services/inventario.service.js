const prisma = require('../../../shared/db/prisma');
const { existeAlmacen } = require('../../almacenes/models/Almacen');
const { existeProducto } = require('../../productos/models/Producto');
const {
  listarInventarios,
  obtenerInventarioPorId,
  existeInventario,
  obtenerInventarioPorAlmacenProducto,
  crearInventarioBase,
  actualizarInventarioBase,
  eliminarInventarioPorId,
  eliminarInventariosMultiplesPorIds,
} = require('../models/Inventario');

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

function normalizarNumeroEntero(valor, fallback = null) {
  if (valor === undefined || valor === null || valor === '') {
    return fallback;
  }

  return Number(valor);
}

function normalizarPayload(payload) {
  return {
    idAlmacen: normalizarNumeroEntero(payload.idAlmacen),
    idProducto: normalizarNumeroEntero(payload.idProducto),
    stockActual: normalizarNumeroEntero(payload.stockActual, 0),
  };
}

function validarReglasStock({ stockActual }) {
  if (stockActual < 0) {
    throw crearErrorValidacion('stockActual no puede ser menor a 0');
  }
}

async function validarRelaciones({ idAlmacen, idProducto }, tx) {
  const almacenValido = await existeAlmacen(idAlmacen, tx);
  if (!almacenValido) {
    throw crearErrorValidacion('El almacen seleccionado no existe');
  }

  const productoValido = await existeProducto(idProducto, tx);
  if (!productoValido) {
    throw crearErrorValidacion('El producto seleccionado no existe');
  }
}

async function index() {
  return listarInventarios();
}

async function show(idInventario) {
  return obtenerInventarioPorId(idInventario);
}

async function store(payload) {
  return prisma.$transaction(async (tx) => {
    const data = normalizarPayload(payload);

    await validarRelaciones(data, tx);
    validarReglasStock(data);

    const existe = await obtenerInventarioPorAlmacenProducto(data.idAlmacen, data.idProducto, tx);
    if (existe) {
      throw crearErrorConflicto('El producto ya existe en el inventario de ese almacen');
    }

    return crearInventarioBase(data, tx);
  });
}

async function update(idInventario, payload) {
  return prisma.$transaction(async (tx) => {
    const existe = await existeInventario(idInventario, tx);
    if (!existe) {
      return null;
    }

    const inventarioActual = await obtenerInventarioPorId(idInventario, tx);
    const data = normalizarPayload(payload);

    const idAlmacenDestino =
      payload.idAlmacen !== undefined ? data.idAlmacen : inventarioActual.idAlmacen;
    const idProductoDestino =
      payload.idProducto !== undefined ? data.idProducto : inventarioActual.idProducto;

    const stockActualDestino =
      payload.stockActual !== undefined ? data.stockActual : inventarioActual.stockActual;

    await validarRelaciones({ idAlmacen: idAlmacenDestino, idProducto: idProductoDestino }, tx);
    validarReglasStock({
      stockActual: stockActualDestino,
    });

    const duplicado = await obtenerInventarioPorAlmacenProducto(idAlmacenDestino, idProductoDestino, tx);
    if (duplicado && duplicado.idInventario !== idInventario) {
      throw crearErrorConflicto('El producto ya existe en el inventario de ese almacen');
    }

    const payloadUpdate = {
      ...(payload.idAlmacen !== undefined ? { idAlmacen: data.idAlmacen } : {}),
      ...(payload.idProducto !== undefined ? { idProducto: data.idProducto } : {}),
      ...(payload.stockActual !== undefined ? { stockActual: data.stockActual } : {}),
    };

    return actualizarInventarioBase({ idInventario, ...payloadUpdate }, tx);
  });
}

async function destroy(idInventario) {
  return prisma.$transaction(async (tx) => {
    const existe = await existeInventario(idInventario, tx);
    if (!existe) {
      return false;
    }

    await eliminarInventarioPorId(idInventario, tx);
    return true;
  });
}

async function destroyMany(ids) {
  return prisma.$transaction(async (tx) => {
    return eliminarInventariosMultiplesPorIds(ids, tx);
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
