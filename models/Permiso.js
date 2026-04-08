const prisma = require('../config/prisma');

async function listarPermisos() {
  return prisma.permiso.findMany({
    orderBy: { nombre: 'asc' },
  });
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
  buscarPermisosPorNombre,
};
