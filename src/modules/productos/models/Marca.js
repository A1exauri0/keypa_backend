const prisma = require('../../../shared/db/prisma');

async function listarMarcas() {
  return prisma.marca.findMany({
    orderBy: { nombre: 'asc' },
  });
}

async function obtenerMarcaPorId(idMarca) {
  return prisma.marca.findUnique({
    where: { idMarca },
  });
}

async function obtenerMarcaPorSlug(slug, db = prisma) {
  return db.marca.findFirst({
    where: { slug },
    select: { idMarca: true, slug: true },
  });
}

async function existeMarca(idMarca, db = prisma) {
  const existe = await db.marca.findUnique({
    where: { idMarca },
    select: { idMarca: true },
  });

  return Boolean(existe);
}

async function crearMarcaBase({ nombre, slug, descripcion = null, activo = true }, db = prisma) {
  return db.marca.create({
    data: {
      nombre,
      slug,
      descripcion,
      activo,
    },
  });
}

async function actualizarMarcaBase({ idMarca, nombre, slug, descripcion, activo }, db = prisma) {
  return db.marca.update({
    where: { idMarca },
    data: {
      ...(nombre !== undefined ? { nombre } : {}),
      ...(slug !== undefined ? { slug } : {}),
      ...(descripcion !== undefined ? { descripcion } : {}),
      ...(activo !== undefined ? { activo } : {}),
    },
  });
}

async function eliminarMarcaPorId(idMarca, db = prisma) {
  return db.marca.delete({ where: { idMarca } });
}

async function eliminarMarcasMultiplesPorIds(ids, db = prisma) {
  const resultado = await db.marca.deleteMany({
    where: {
      idMarca: {
        in: ids,
      },
    },
  });

  return resultado.count;
}

module.exports = {
  listarMarcas,
  obtenerMarcaPorId,
  obtenerMarcaPorSlug,
  existeMarca,
  crearMarcaBase,
  actualizarMarcaBase,
  eliminarMarcaPorId,
  eliminarMarcasMultiplesPorIds,
};
