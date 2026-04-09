const prisma = require('../../../shared/db/prisma');

async function listarPermisos() {
  return prisma.permiso.findMany({
    orderBy: { nombre: 'asc' },
  });
}

async function obtenerPermisoPorId(idPermiso) {
  return prisma.permiso.findUnique({
    where: { idPermiso },
  });
}

async function crearPermiso({ nombre, descripcion = null }) {
  return prisma.permiso.create({
    data: {
      nombre,
      descripcion,
    },
  });
}

async function actualizarPermiso({ idPermiso, nombre, descripcion }) {
  const permisoExistente = await prisma.permiso.findUnique({
    where: { idPermiso },
    select: { idPermiso: true },
  });

  if (!permisoExistente) {
    return null;
  }

  return prisma.permiso.update({
    where: { idPermiso },
    data: {
      ...(nombre !== undefined ? { nombre } : {}),
      ...(descripcion !== undefined ? { descripcion } : {}),
    },
  });
}

async function eliminarPermiso(idPermiso) {
  const permisoExistente = await prisma.permiso.findUnique({
    where: { idPermiso },
    select: { idPermiso: true },
  });

  if (!permisoExistente) {
    return null;
  }

  await prisma.permiso.delete({ where: { idPermiso } });
  return true;
}

async function buscarPermisosPorNombre(nombres) {
  if (!Array.isArray(nombres) || nombres.length === 0) {
    return [];
  }

  return prisma.permiso.findMany({
    where: {
      nombre: { in: nombres },
    },
  });
}

module.exports = {
  listarPermisos,
  obtenerPermisoPorId,
  crearPermiso,
  actualizarPermiso,
  eliminarPermiso,
  buscarPermisosPorNombre,
};
