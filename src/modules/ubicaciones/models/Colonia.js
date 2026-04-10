const prisma = require('../../../shared/db/prisma');

// Lista colonias y opcionalmente filtra por ciudad.
async function listarColonias({ idCiudad } = {}, db = prisma) {
  return db.colonia.findMany({
    where: {
      ...(idCiudad ? { idCiudad } : {}),
    },
    include: {
      ciudad: {
        select: {
          idCiudad: true,
          nombre: true,
          estado: true,
        },
      },
    },
    orderBy: [{ nombre: 'asc' }, { codigoPostal: 'asc' }],
  });
}

// Obtiene una colonia por su ID incluyendo su ciudad.
async function obtenerColoniaPorId(idColonia, db = prisma) {
  return db.colonia.findUnique({
    where: { idColonia },
    include: {
      ciudad: {
        select: {
          idCiudad: true,
          nombre: true,
          estado: true,
        },
      },
    },
  });
}

// Busca colonia por clave compuesta para evitar duplicados.
async function obtenerColoniaUnica({ idCiudad, nombre, codigoPostal }, db = prisma) {
  return db.colonia.findFirst({
    where: {
      idCiudad,
      nombre,
      codigoPostal,
    },
    select: {
      idColonia: true,
      idCiudad: true,
      nombre: true,
      codigoPostal: true,
    },
  });
}

// Verifica existencia de una colonia por ID.
async function existeColonia(idColonia, db = prisma) {
  const existe = await db.colonia.findUnique({
    where: { idColonia },
    select: { idColonia: true },
  });

  return Boolean(existe);
}

// Crea una colonia base asociada a ciudad.
async function crearColoniaBase({ nombre, codigoPostal, idCiudad, activo = true }, db = prisma) {
  return db.colonia.create({
    data: {
      nombre,
      codigoPostal,
      idCiudad,
      activo,
    },
    include: {
      ciudad: {
        select: {
          idCiudad: true,
          nombre: true,
          estado: true,
        },
      },
    },
  });
}

// Actualiza campos editables de una colonia.
async function actualizarColoniaBase({ idColonia, nombre, codigoPostal, idCiudad, activo }, db = prisma) {
  return db.colonia.update({
    where: { idColonia },
    data: {
      ...(nombre !== undefined ? { nombre } : {}),
      ...(codigoPostal !== undefined ? { codigoPostal } : {}),
      ...(idCiudad !== undefined ? { idCiudad } : {}),
      ...(activo !== undefined ? { activo } : {}),
    },
    include: {
      ciudad: {
        select: {
          idCiudad: true,
          nombre: true,
          estado: true,
        },
      },
    },
  });
}

// Elimina una colonia por su ID.
async function eliminarColoniaPorId(idColonia, db = prisma) {
  return db.colonia.delete({ where: { idColonia } });
}

// Elimina varias colonias por IDs y retorna el conteo.
async function eliminarColoniasMultiplesPorIds(ids, db = prisma) {
  const resultado = await db.colonia.deleteMany({
    where: {
      idColonia: {
        in: ids,
      },
    },
  });

  return resultado.count;
}

module.exports = {
  listarColonias,
  obtenerColoniaPorId,
  obtenerColoniaUnica,
  existeColonia,
  crearColoniaBase,
  actualizarColoniaBase,
  eliminarColoniaPorId,
  eliminarColoniasMultiplesPorIds,
};
