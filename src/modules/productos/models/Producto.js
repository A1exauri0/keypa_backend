const prisma = require('../../../shared/db/prisma');

async function listarProductos() {
  return prisma.producto.findMany({
    orderBy: { createdAt: 'desc' },
  });
}

module.exports = {
  listarProductos,
};
