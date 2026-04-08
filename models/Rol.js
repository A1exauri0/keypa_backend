const prisma = require('../config/prisma');

async function listarRoles() {
  return prisma.rol.findMany({
    orderBy: { nombre: 'asc' },
    include: {
      permisos: {
        include: { permiso: true },
      },
    },
  });
}

async function buscarRolesPorNombre(nombres) {
  if (!Array.isArray(nombres) || nombres.length === 0) {
    return [];
  }

  return prisma.rol.findMany({
    where: {
      nombre: { in: nombres },
    },
  });
}

module.exports = {
  listarRoles,
  buscarRolesPorNombre,
};
