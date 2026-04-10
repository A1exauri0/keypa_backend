const prisma = require('../../../shared/db/prisma');

// Lista ciudades ordenadas alfabeticamente.
async function listarCiudades(db = prisma) {
  return db.ciudad.findMany({
    orderBy: { nombre: 'asc' },
  });
}

// Obtiene una ciudad por su ID.
async function obtenerCiudadPorId(idCiudad, db = prisma) {
  return db.ciudad.findUnique({
    where: { idCiudad },
  });
}

// Busca una ciudad por nombre para validar duplicados.
async function obtenerCiudadPorNombre(nombre, db = prisma) {
  return db.ciudad.findFirst({
    where: { nombre },
    select: { idCiudad: true, nombre: true },
  });
}

// Verifica existencia de una ciudad por ID.
async function existeCiudad(idCiudad, db = prisma) {
  const existe = await db.ciudad.findUnique({
    where: { idCiudad },
    select: { idCiudad: true },
  });

  return Boolean(existe);
}

// Crea una ciudad con estado y estatus inicial.
async function crearCiudadBase({ nombre, estado = 'Chiapas', activo = true }, db = prisma) {
  return db.ciudad.create({
    data: {
      nombre,
      estado,
      activo,
    },
  });
}

// Actualiza campos editables de una ciudad.
async function actualizarCiudadBase({ idCiudad, nombre, estado, activo }, db = prisma) {
  return db.ciudad.update({
    where: { idCiudad },
    data: {
      ...(nombre !== undefined ? { nombre } : {}),
      ...(estado !== undefined ? { estado } : {}),
      ...(activo !== undefined ? { activo } : {}),
    },
  });
}

// Elimina una ciudad por su ID.
async function eliminarCiudadPorId(idCiudad, db = prisma) {
  return db.ciudad.delete({ where: { idCiudad } });
}

// Elimina varias ciudades por IDs y retorna el conteo.
async function eliminarCiudadesMultiplesPorIds(ids, db = prisma) {
  const resultado = await db.ciudad.deleteMany({
    where: {
      idCiudad: {
        in: ids,
      },
    },
  });

  return resultado.count;
}

module.exports = {
  listarCiudades,
  obtenerCiudadPorId,
  obtenerCiudadPorNombre,
  existeCiudad,
  crearCiudadBase,
  actualizarCiudadBase,
  eliminarCiudadPorId,
  eliminarCiudadesMultiplesPorIds,
};
