const prisma = require('../../../shared/db/prisma');

// Lista clientes ordenados por fecha de creacion descendente.
async function listarClientes(db = prisma) {
  return db.cliente.findMany({
    include: {
      ciudad: {
        select: { idCiudad: true, nombre: true, estado: true },
      },
      colonia: {
        select: { idColonia: true, nombre: true, codigoPostal: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
}

// Obtiene un cliente por su ID.
async function obtenerClientePorId(idCliente, db = prisma) {
  return db.cliente.findUnique({
    where: { idCliente },
    include: {
      ciudad: {
        select: { idCiudad: true, nombre: true, estado: true },
      },
      colonia: {
        select: { idColonia: true, nombre: true, codigoPostal: true },
      },
    },
  });
}

// Verifica existencia de cliente por ID.
async function existeCliente(idCliente, db = prisma) {
  const existe = await db.cliente.findUnique({
    where: { idCliente },
    select: { idCliente: true },
  });

  return Boolean(existe);
}

// Busca cliente por email para evitar duplicados.
async function obtenerClientePorEmail(email, db = prisma) {
  if (!email) {
    return null;
  }

  return db.cliente.findUnique({
    where: { email },
    select: { idCliente: true, email: true },
  });
}

// Crea un cliente base.
async function crearClienteBase(payload, db = prisma) {
  return db.cliente.create({
    data: payload,
    include: {
      ciudad: {
        select: { idCiudad: true, nombre: true, estado: true },
      },
      colonia: {
        select: { idColonia: true, nombre: true, codigoPostal: true },
      },
    },
  });
}

// Actualiza un cliente existente.
async function actualizarClienteBase({ idCliente, ...payload }, db = prisma) {
  return db.cliente.update({
    where: { idCliente },
    data: payload,
    include: {
      ciudad: {
        select: { idCiudad: true, nombre: true, estado: true },
      },
      colonia: {
        select: { idColonia: true, nombre: true, codigoPostal: true },
      },
    },
  });
}

// Elimina un cliente por ID.
async function eliminarClientePorId(idCliente, db = prisma) {
  return db.cliente.delete({ where: { idCliente } });
}

// Elimina varios clientes por IDs.
async function eliminarClientesMultiplesPorIds(ids, db = prisma) {
  const resultado = await db.cliente.deleteMany({
    where: {
      idCliente: {
        in: ids,
      },
    },
  });

  return resultado.count;
}

module.exports = {
  listarClientes,
  obtenerClientePorId,
  existeCliente,
  obtenerClientePorEmail,
  crearClienteBase,
  actualizarClienteBase,
  eliminarClientePorId,
  eliminarClientesMultiplesPorIds,
};
