const prisma = require('../config/prisma');

async function listarProductos() {
  return prisma.producto.findMany({
    orderBy: { createdAt: 'desc' },
  });
}

module.exports = {
  listarProductos,
};
