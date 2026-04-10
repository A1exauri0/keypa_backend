const prisma = require('../../../shared/db/prisma');

async function listarCategorias() {
  return prisma.categoria.findMany({
    orderBy: { nombre: 'asc' },
  });
}

async function obtenerCategoriaPorId(idCategoria) {
  return prisma.categoria.findUnique({
    where: { idCategoria },
  });
}

async function obtenerCategoriaPorSlug(slug, db = prisma) {
  return db.categoria.findFirst({
    where: { slug },
    select: { idCategoria: true, slug: true },
  });
}

async function existeCategoria(idCategoria, db = prisma) {
  const existe = await db.categoria.findUnique({
    where: { idCategoria },
    select: { idCategoria: true },
  });

  return Boolean(existe);
}

async function crearCategoriaBase({ nombre, slug, descripcion = null, activo = true }, db = prisma) {
  return db.categoria.create({
    data: {
      nombre,
      slug,
      descripcion,
      activo,
    },
  });
}

async function actualizarCategoriaBase({ idCategoria, nombre, slug, descripcion, activo }, db = prisma) {
  return db.categoria.update({
    where: { idCategoria },
    data: {
      ...(nombre !== undefined ? { nombre } : {}),
      ...(slug !== undefined ? { slug } : {}),
      ...(descripcion !== undefined ? { descripcion } : {}),
      ...(activo !== undefined ? { activo } : {}),
    },
  });
}

async function eliminarCategoriaPorId(idCategoria, db = prisma) {
  return db.categoria.delete({ where: { idCategoria } });
}

async function eliminarCategoriasMultiplesPorIds(ids, db = prisma) {
  const resultado = await db.categoria.deleteMany({
    where: {
      idCategoria: {
        in: ids,
      },
    },
  });

  return resultado.count;
}

module.exports = {
  listarCategorias,
  obtenerCategoriaPorId,
  obtenerCategoriaPorSlug,
  existeCategoria,
  crearCategoriaBase,
  actualizarCategoriaBase,
  eliminarCategoriaPorId,
  eliminarCategoriasMultiplesPorIds,
};
