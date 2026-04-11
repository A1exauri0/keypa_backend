const prisma = require('../../../shared/db/prisma');

function includeRelaciones() {
  return {
    cliente: {
      select: {
        idCliente: true,
        nombre: true,
        apellidos: true,
        email: true,
        telefono: true,
      },
    },
    usuario: {
      select: {
        idUsuario: true,
        nombre: true,
        email: true,
      },
    },
    almacen: {
      select: {
        idAlmacen: true,
        nombre: true,
        sucursal: {
          select: {
            idSucursal: true,
            nombre: true,
          },
        },
      },
    },
    detalles: {
      include: {
        producto: {
          select: {
            idProducto: true,
            nombre: true,
            sku: true,
          },
        },
      },
      orderBy: { idVentaDetalle: 'asc' },
    },
  };
}

// Lista ventas con relaciones principales para pantalla administrativa.
async function listarVentas(db = prisma) {
  return db.venta.findMany({
    include: includeRelaciones(),
    orderBy: { createdAt: 'desc' },
  });
}

// Obtiene una venta por ID con su detalle completo.
async function obtenerVentaPorId(idVenta, db = prisma) {
  return db.venta.findUnique({
    where: { idVenta },
    include: includeRelaciones(),
  });
}

// Consulta una venta para operaciones de estado y stock.
async function obtenerVentaConDetalleStock(idVenta, db = prisma) {
  return db.venta.findUnique({
    where: { idVenta },
    include: {
      detalles: {
        select: {
          idProducto: true,
          cantidad: true,
        },
      },
      almacen: {
        select: { idAlmacen: true },
      },
    },
  });
}

// Crea una venta con su detalle en una sola operacion.
async function crearVentaBase(payload, db = prisma) {
  return db.venta.create({
    data: payload,
    include: includeRelaciones(),
  });
}

// Actualiza el estado de la venta.
async function actualizarEstadoVentaBase(idVenta, estado, db = prisma) {
  return db.venta.update({
    where: { idVenta },
    data: { estado },
    include: includeRelaciones(),
  });
}

// Lista inventario disponible para ventas, filtrando solo stock mayor a cero.
async function listarInventarioDisponibleParaVenta(idAlmacen = null, db = prisma) {
  return db.inventario.findMany({
    where: {
      stockActual: { gt: 0 },
      almacen: { activo: true },
      producto: { activo: true },
      ...(idAlmacen ? { idAlmacen } : {}),
    },
    select: {
      idInventario: true,
      idAlmacen: true,
      stockActual: true,
      almacen: {
        select: {
          idAlmacen: true,
          nombre: true,
          sucursal: {
            select: {
              idSucursal: true,
              nombre: true,
            },
          },
        },
      },
      producto: {
        select: {
          idProducto: true,
          nombre: true,
          sku: true,
          precio: true,
        },
      },
    },
    orderBy: [{ idAlmacen: 'asc' }, { producto: { nombre: 'asc' } }],
  });
}

module.exports = {
  listarVentas,
  obtenerVentaPorId,
  obtenerVentaConDetalleStock,
  crearVentaBase,
  actualizarEstadoVentaBase,
  listarInventarioDisponibleParaVenta,
};
