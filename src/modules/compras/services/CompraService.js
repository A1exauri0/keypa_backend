const prisma = require('../../../shared/db/prisma');
const {
  listarCompras,
  obtenerCompraPorId,
  obtenerCompraConDetalleStock,
  crearCompraBase,
  actualizarEstadoCompraBase,
} = require('../models/Compra');

const ESTADOS_PERMITIDOS = ['completada', 'cancelada'];

function crearErrorValidacion(message) {
  const error = new Error(message);
  error.status = 422;
  return error;
}

function crearErrorConflicto(message) {
  const error = new Error(message);
  error.status = 409;
  return error;
}

function normalizarNumeroEntero(valor) {
  if (valor === undefined || valor === null || valor === '') {
    return null;
  }

  return Number(valor);
}

function redondearMoneda(valor) {
  return Math.round((Number(valor) + Number.EPSILON) * 100) / 100;
}

function generarFolio() {
  const base = Date.now().toString(36).toUpperCase();
  const random = Math.floor(Math.random() * 999)
    .toString()
    .padStart(3, '0');

  return `CMP-${base}-${random}`;
}

function normalizarPayload(payload) {
  return {
    idProveedor: normalizarNumeroEntero(payload.idProveedor),
    idAlmacen: normalizarNumeroEntero(payload.idAlmacen),
    observaciones: payload.observaciones?.trim() || null,
    detalles: Array.isArray(payload.detalles)
      ? payload.detalles.map((item) => ({
          idProducto: normalizarNumeroEntero(item.idProducto),
          cantidad: normalizarNumeroEntero(item.cantidad),
        }))
      : [],
  };
}

function agruparDetallePorProducto(detalles) {
  const mapa = new Map();

  for (const item of detalles) {
    if (!item.idProducto || !item.cantidad || item.cantidad < 1) {
      continue;
    }

    const previo = mapa.get(item.idProducto) || 0;
    mapa.set(item.idProducto, previo + item.cantidad);
  }

  return Array.from(mapa.entries()).map(([idProducto, cantidad]) => ({
    idProducto,
    cantidad,
  }));
}

function validarPayloadCreacion(data) {
  if (!data.idProveedor || data.idProveedor < 1) {
    throw crearErrorValidacion('El proveedor es obligatorio');
  }

  if (!data.idAlmacen || data.idAlmacen < 1) {
    throw crearErrorValidacion('El almacen es obligatorio');
  }

  if (!Array.isArray(data.detalles) || data.detalles.length < 1) {
    throw crearErrorValidacion('Debes enviar al menos un producto en la compra');
  }
}

async function index() {
  return listarCompras();
}

async function show(idCompra) {
  return obtenerCompraPorId(idCompra);
}

async function store(payload, idUsuario) {
  return prisma.$transaction(async (tx) => {
    const data = normalizarPayload(payload);
    validarPayloadCreacion(data);

    const [proveedor, almacen] = await Promise.all([
      tx.proveedor.findUnique({ where: { idProveedor: data.idProveedor }, select: { idProveedor: true, activo: true } }),
      tx.almacen.findUnique({ where: { idAlmacen: data.idAlmacen }, select: { idAlmacen: true, activo: true } }),
    ]);

    if (!proveedor || !proveedor.activo) {
      throw crearErrorValidacion('El proveedor seleccionado no existe o esta inactivo');
    }

    if (!almacen || !almacen.activo) {
      throw crearErrorValidacion('El almacen seleccionado no existe o esta inactivo');
    }

    const idsProducto = [...new Set(data.detalles.map((item) => item.idProducto).filter(Boolean))];

    const productos = await tx.producto.findMany({
      where: {
        idProducto: { in: idsProducto },
        activo: true,
      },
      select: {
        idProducto: true,
        costo: true,
      },
    });

    const mapaProductos = new Map(productos.map((item) => [item.idProducto, item]));

    let subtotal = 0;
    const detallePersistencia = [];

    for (const item of data.detalles) {
      if (!item.idProducto || item.idProducto < 1) {
        throw crearErrorValidacion('Cada detalle debe incluir un producto valido');
      }

      const producto = mapaProductos.get(item.idProducto);
      if (!producto) {
        throw crearErrorValidacion(`El producto ${item.idProducto} no existe o esta inactivo`);
      }

      if (!Number.isFinite(item.cantidad) || item.cantidad < 1) {
        throw crearErrorValidacion('Cada detalle debe incluir una cantidad valida mayor a 0');
      }

      const costoUnitario = Number(producto.costo.toString());
      if (!Number.isFinite(costoUnitario) || costoUnitario <= 0) {
        throw crearErrorValidacion(`El producto ${item.idProducto} no tiene un costo valido`);
      }

      const subtotalLinea = redondearMoneda(item.cantidad * costoUnitario);
      subtotal += subtotalLinea;

      detallePersistencia.push({
        idProducto: item.idProducto,
        cantidad: item.cantidad,
        costoUnitario: redondearMoneda(costoUnitario),
        subtotal: subtotalLinea,
      });
    }

    subtotal = redondearMoneda(subtotal);

    const compra = await crearCompraBase(
      {
        folio: generarFolio(),
        idProveedor: data.idProveedor,
        idUsuario,
        idAlmacen: data.idAlmacen,
        estado: 'completada',
        observaciones: data.observaciones,
        subtotal,
        total: subtotal,
        detalles: {
          create: detallePersistencia,
        },
      },
      tx,
    );

    const detalleAgrupado = agruparDetallePorProducto(detallePersistencia);

    for (const item of detalleAgrupado) {
      await tx.inventario.upsert({
        where: {
          idAlmacen_idProducto: {
            idAlmacen: data.idAlmacen,
            idProducto: item.idProducto,
          },
        },
        update: {
          stockActual: { increment: item.cantidad },
        },
        create: {
          idAlmacen: data.idAlmacen,
          idProducto: item.idProducto,
          stockActual: item.cantidad,
        },
      });
    }

    return compra;
  });
}

async function actualizarEstado(idCompra, estadoDestino) {
  return prisma.$transaction(async (tx) => {
    const estado = typeof estadoDestino === 'string' ? estadoDestino.trim().toLowerCase() : '';

    if (!ESTADOS_PERMITIDOS.includes(estado)) {
      throw crearErrorValidacion('Estado invalido. Usa completada o cancelada');
    }

    const compraActual = await obtenerCompraConDetalleStock(idCompra, tx);
    if (!compraActual) {
      return null;
    }

    if (compraActual.estado === estado) {
      return obtenerCompraPorId(idCompra, tx);
    }

    if (estado === 'completada') {
      throw crearErrorValidacion('No se puede reactivar una compra cancelada');
    }

    if (compraActual.estado === 'cancelada') {
      throw crearErrorConflicto('La compra ya esta cancelada');
    }

    for (const item of compraActual.detalles) {
      const inventario = await tx.inventario.findUnique({
        where: {
          idAlmacen_idProducto: {
            idAlmacen: compraActual.almacen.idAlmacen,
            idProducto: item.idProducto,
          },
        },
        select: {
          stockActual: true,
        },
      });

      if (!inventario || inventario.stockActual < item.cantidad) {
        throw crearErrorConflicto('No hay stock suficiente para revertir la compra en inventario');
      }
    }

    for (const item of compraActual.detalles) {
      await tx.inventario.update({
        where: {
          idAlmacen_idProducto: {
            idAlmacen: compraActual.almacen.idAlmacen,
            idProducto: item.idProducto,
          },
        },
        data: {
          stockActual: { decrement: item.cantidad },
        },
      });
    }

    return actualizarEstadoCompraBase(idCompra, 'cancelada', tx);
  });
}

module.exports = {
  index,
  show,
  store,
  actualizarEstado,
};
