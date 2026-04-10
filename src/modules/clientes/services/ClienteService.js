const prisma = require('../../../shared/db/prisma');
const { existeCiudad } = require('../../ubicaciones/models/Ciudad');
const { obtenerColoniaPorId } = require('../../ubicaciones/models/Colonia');
const {
  listarClientes,
  obtenerClientePorId,
  existeCliente,
  obtenerClientePorEmail,
  crearClienteBase,
  actualizarClienteBase,
  eliminarClientePorId,
  eliminarClientesMultiplesPorIds,
} = require('../models/Cliente');

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
    apellidos: payload.apellidos?.trim(),
    email: payload.email ? payload.email.trim().toLowerCase() : null,
    telefono: payload.telefono?.trim(),
    fechaNacimiento: payload.fechaNacimiento ? new Date(payload.fechaNacimiento) : null,
    genero: payload.genero || null,
    direccion: payload.direccion?.trim() || null,
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

// Lista clientes registrados.
async function index() {
  return listarClientes();
}

// Obtiene detalle de cliente por ID.
async function show(idCliente) {
  return obtenerClientePorId(idCliente);
}

// Crea cliente validando email unico y consistencia de ciudad/colonia.
async function store(payload) {
  return prisma.$transaction(async (tx) => {
    const data = normalizarPayload(payload);

    if (data.email) {
      const emailExistente = await obtenerClientePorEmail(data.email, tx);
      if (emailExistente) {
        throw crearErrorConflicto('El email del cliente ya existe');
      }
    }

    await validarRelacionUbicacion(data, tx);

    return crearClienteBase(data, tx);
  });
}

// Actualiza cliente validando existencia, email unico y relacion de ubicacion.
async function update(idCliente, payload) {
  return prisma.$transaction(async (tx) => {
    const existe = await existeCliente(idCliente, tx);
    if (!existe) {
      return null;
    }

    const data = normalizarPayload({ ...payload, activo: payload.activo });

    const clienteActual = await obtenerClientePorId(idCliente, tx);
    const emailDestino = payload.email !== undefined ? data.email : clienteActual.email;
    const idCiudadDestino = payload.idCiudad !== undefined ? data.idCiudad : clienteActual.idCiudad;
    const idColoniaDestino = payload.idColonia !== undefined ? data.idColonia : clienteActual.idColonia;

    if (emailDestino) {
      const emailExistente = await obtenerClientePorEmail(emailDestino, tx);
      if (emailExistente && emailExistente.idCliente !== idCliente) {
        throw crearErrorConflicto('El email del cliente ya existe');
      }
    }

    await validarRelacionUbicacion({ idCiudad: idCiudadDestino, idColonia: idColoniaDestino }, tx);

    const payloadUpdate = {
      ...(payload.nombre !== undefined ? { nombre: data.nombre } : {}),
      ...(payload.apellidos !== undefined ? { apellidos: data.apellidos } : {}),
      ...(payload.email !== undefined ? { email: data.email } : {}),
      ...(payload.telefono !== undefined ? { telefono: data.telefono } : {}),
      ...(payload.fechaNacimiento !== undefined ? { fechaNacimiento: data.fechaNacimiento } : {}),
      ...(payload.genero !== undefined ? { genero: data.genero } : {}),
      ...(payload.direccion !== undefined ? { direccion: data.direccion } : {}),
      ...(payload.numeroExterior !== undefined ? { numeroExterior: data.numeroExterior } : {}),
      ...(payload.numeroInterior !== undefined ? { numeroInterior: data.numeroInterior } : {}),
      ...(payload.referencias !== undefined ? { referencias: data.referencias } : {}),
      ...(payload.codigoPostal !== undefined ? { codigoPostal: data.codigoPostal } : {}),
      ...(payload.idCiudad !== undefined ? { idCiudad: data.idCiudad } : {}),
      ...(payload.idColonia !== undefined ? { idColonia: data.idColonia } : {}),
      ...(payload.activo !== undefined ? { activo: Boolean(payload.activo) } : {}),
    };

    return actualizarClienteBase({ idCliente, ...payloadUpdate }, tx);
  });
}

// Elimina cliente por ID si existe.
async function destroy(idCliente) {
  return prisma.$transaction(async (tx) => {
    const existe = await existeCliente(idCliente, tx);
    if (!existe) {
      return false;
    }

    await eliminarClientePorId(idCliente, tx);
    return true;
  });
}

// Elimina varios clientes por IDs.
async function destroyMany(ids) {
  return prisma.$transaction(async (tx) => {
    return eliminarClientesMultiplesPorIds(ids, tx);
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
