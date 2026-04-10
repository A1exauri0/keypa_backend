const prisma = require('../../../shared/db/prisma');

function includeProducto() {
  return {
    marca: true,
    categorias: {
      include: {
        categoria: true,
      },
    },
    imagenes: {
      orderBy: [{ principal: 'desc' }, { orden: 'asc' }],
    },
  };
}

async function listarProductos(filtros = {}) {
  const where = {
    ...(filtros.q
      ? {
          OR: [
            { nombre: { contains: filtros.q } },
            { sku: { contains: filtros.q } },
          ],
        }
      : {}),
    ...(filtros.tipo ? { tipo: filtros.tipo } : {}),
    ...(filtros.disponibilidad ? { disponibilidad: filtros.disponibilidad } : {}),
    ...(filtros.idMarca ? { idMarca: filtros.idMarca } : {}),
    ...(filtros.idCategoria
      ? {
          categorias: {
            some: {
              idCategoria: filtros.idCategoria,
            },
          },
        }
      : {}),
    ...(filtros.activo !== undefined ? { activo: filtros.activo } : {}),
  };

  return prisma.producto.findMany({
    where,
    include: includeProducto(),
    orderBy: { createdAt: 'desc' },
  });
}

async function obtenerProductoPorId(idProducto, db = prisma) {
  return db.producto.findUnique({
    where: { idProducto },
    include: includeProducto(),
  });
}

async function obtenerProductoPorSlug(slug, db = prisma) {
  return db.producto.findFirst({
    where: { slug },
    select: { idProducto: true, slug: true },
  });
}

async function crearProductoBase(data, db = prisma) {
  const {
    nombre,
    slug,
    sku,
    descripcion,
    tipo,
    disponibilidad = 'Disponible',
    precio,
    costo,
    activo = true,
    color,
    talla,
    tono,
    material,
    idMarca,
  } = data;

  return db.producto.create({
    data: {
      nombre,
      slug,
      sku,
      descripcion,
      tipo,
      disponibilidad,
      precio,
      costo,
      activo,
      color,
      talla,
      tono,
      material,
      idMarca,
    },
    select: { idProducto: true },
  });
}

async function existeProducto(idProducto, db = prisma) {
  const existe = await db.producto.findUnique({
    where: { idProducto },
    select: { idProducto: true },
  });

  return Boolean(existe);
}

async function actualizarProductoBase(idProducto, data, db = prisma) {
  const {
    nombre,
    slug,
    sku,
    descripcion,
    tipo,
    disponibilidad,
    precio,
    costo,
    activo,
    color,
    talla,
    tono,
    material,
    idMarca,
  } = data;

  return db.producto.update({
    where: { idProducto },
    data: {
      ...(nombre !== undefined ? { nombre } : {}),
      ...(slug !== undefined ? { slug } : {}),
      ...(sku !== undefined ? { sku } : {}),
      ...(descripcion !== undefined ? { descripcion } : {}),
      ...(tipo !== undefined ? { tipo } : {}),
      ...(disponibilidad !== undefined ? { disponibilidad } : {}),
      ...(precio !== undefined ? { precio } : {}),
      ...(costo !== undefined ? { costo } : {}),
      ...(activo !== undefined ? { activo } : {}),
      ...(color !== undefined ? { color } : {}),
      ...(talla !== undefined ? { talla } : {}),
      ...(tono !== undefined ? { tono } : {}),
      ...(material !== undefined ? { material } : {}),
      ...(idMarca !== undefined ? { idMarca } : {}),
    },
  });
}

async function reemplazarCategoriasProducto(idProducto, categorias = [], db = prisma) {
  await db.productoCategoria.deleteMany({ where: { idProducto } });

  if (categorias.length < 1) {
    return;
  }

  await db.productoCategoria.createMany({
    data: categorias.map((idCategoria) => ({ idProducto, idCategoria })),
    skipDuplicates: true,
  });
}

async function reemplazarImagenesProducto(idProducto, imagenes = [], db = prisma) {
  await db.productoImagen.deleteMany({ where: { idProducto } });

  if (imagenes.length < 1) {
    return;
  }

  await db.productoImagen.createMany({
    data: imagenes.map((imagen) => ({
      idProducto,
      url: imagen.url,
      alt: imagen.alt,
      orden: imagen.orden || 0,
      principal: Boolean(imagen.principal),
    })),
  });
}

async function eliminarProductoPorId(idProducto, db = prisma) {
  return db.producto.delete({ where: { idProducto } });
}

async function eliminarProductosMultiplesPorIds(ids, db = prisma) {
  const resultado = await db.producto.deleteMany({
    where: {
      idProducto: {
        in: ids,
      },
    },
  });

  return resultado.count;
}

module.exports = {
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
};
