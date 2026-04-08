const prisma = require('../config/prisma');

async function listarPermisos() {
  return prisma.permiso.findMany({
    orderBy: { nombre: 'asc' },
  });
}

module.exports = {
  listarPermisos,
};
