const prisma = require('../../../shared/db/prisma');
const {
  listarProveedores,
  obtenerProveedorPorId,
  existeProveedor,
  obtenerProveedorPorNombre,
  contarComprasPorProveedor,
  crearProveedorBase,
  actualizarProveedorBase,
  eliminarProveedorPorId,
  eliminarProveedoresMultiplesPorIds,
} = require('../models/Proveedor');

function crearErrorConflicto(message) {
  const error = new Error(message);
  error.status = 409;
  return error;
}

function normalizarPayload(payload) {
  return {
    nombre: payload.nombre?.trim(),
    contactoNombre: payload.contactoNombre?.trim() || null,
    telefono: payload.telefono?.trim() || null,
    email: payload.email?.trim().toLowerCase() || null,
    direccion: payload.direccion?.trim() || null,
    activo: payload.activo !== undefined ? Boolean(payload.activo) : true,
  };
}

async function index() {
  return listarProveedores();
}

async function show(idProveedor) {
  return obtenerProveedorPorId(idProveedor);
}

async function store(payload) {
  return prisma.$transaction(async (tx) => {
    const data = normalizarPayload(payload);

    const existente = await obtenerProveedorPorNombre(data.nombre, tx);
    if (existente) {
      throw crearErrorConflicto('El nombre del proveedor ya existe');
    }

    return crearProveedorBase(data, tx);
  });
}

async function update(idProveedor, payload) {
  return prisma.$transaction(async (tx) => {
    const existe = await existeProveedor(idProveedor, tx);
    if (!existe) {
      return null;
    }

    const data = normalizarPayload(payload);

    if (payload.nombre !== undefined) {
      const existente = await obtenerProveedorPorNombre(data.nombre, tx);
      if (existente && existente.idProveedor !== idProveedor) {
        throw crearErrorConflicto('El nombre del proveedor ya existe');
      }
    }

    const payloadUpdate = {
      ...(payload.nombre !== undefined ? { nombre: data.nombre } : {}),
      ...(payload.contactoNombre !== undefined ? { contactoNombre: data.contactoNombre } : {}),
      ...(payload.telefono !== undefined ? { telefono: data.telefono } : {}),
      ...(payload.email !== undefined ? { email: data.email } : {}),
      ...(payload.direccion !== undefined ? { direccion: data.direccion } : {}),
      ...(payload.activo !== undefined ? { activo: Boolean(payload.activo) } : {}),
    };

    return actualizarProveedorBase({ idProveedor, ...payloadUpdate }, tx);
  });
}

async function destroy(idProveedor) {
  return prisma.$transaction(async (tx) => {
    const existe = await existeProveedor(idProveedor, tx);
    if (!existe) {
      return false;
    }

    const compras = await contarComprasPorProveedor(idProveedor, tx);
    if (compras > 0) {
      throw crearErrorConflicto('No se puede eliminar un proveedor con compras registradas');
    }

    await eliminarProveedorPorId(idProveedor, tx);
    return true;
  });
}

async function destroyMany(ids) {
  return prisma.$transaction(async (tx) => {
    const totalConCompras = await tx.compra.count({
      where: { idProveedor: { in: ids } },
    });

    if (totalConCompras > 0) {
      throw crearErrorConflicto('No se pueden eliminar proveedores con compras registradas');
    }

    return eliminarProveedoresMultiplesPorIds(ids, tx);
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
