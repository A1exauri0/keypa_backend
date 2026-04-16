const prisma = require('../../../shared/db/prisma');
const {
  listarVentas,
  obtenerVentaPorId,
  obtenerVentaConDetalleStock,
  crearVentaBase,
  actualizarEstadoVentaBase,
  listarInventarioDisponibleParaVenta,
} = require('../models/Venta');

const ESTADOS_PERMITIDOS = ['pendiente', 'pagado', 'cancelado'];
const TIPOS_PAGO_PERMITIDOS = ['efectivo', 'transferencia'];

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

function normalizarNumeroDecimal(valor) {
  if (valor === undefined || valor === null || valor === '') {
    return null;
  }

  return Number(valor);
}

function redondearMoneda(valor) {
  return Math.round((Number(valor) + Number.EPSILON) * 100) / 100;
}

// Genera folio de venta legible con timestamp y componente aleatorio.
function generarFolio() {
  const base = Date.now().toString(36).toUpperCase();
  const random = Math.floor(Math.random() * 999)
    .toString()
    .padStart(3, '0');

  return `VTA-${base}-${random}`;
}

// Normaliza payload de creacion para reglas de negocio.
function normalizarPayload(payload) {
  return {
    idCliente: normalizarNumeroEntero(payload.idCliente),
    idAlmacen: normalizarNumeroEntero(payload.idAlmacen),
    tipoPago: typeof payload.tipoPago === 'string' ? payload.tipoPago.trim().toLowerCase() : '',
    montoPagado: normalizarNumeroDecimal(payload.montoPagado),
    detalles: Array.isArray(payload.detalles)
      ? payload.detalles.map((item) => ({
          idProducto: normalizarNumeroEntero(item.idProducto),
          cantidad: normalizarNumeroEntero(item.cantidad),
        }))
      : [],
  };
}

// Agrupa productos repetidos para descontar stock de forma consolidada.
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

// Valida cliente, almacen, tipo de pago y detalle minimo de venta.
function validarPayloadCreacion(data) {
  if (!data.idCliente || data.idCliente < 1) {
    throw crearErrorValidacion('El cliente es obligatorio');
  }

  if (!data.idAlmacen || data.idAlmacen < 1) {
    throw crearErrorValidacion('El almacen es obligatorio');
  }

  if (!TIPOS_PAGO_PERMITIDOS.includes(data.tipoPago)) {
    throw crearErrorValidacion('El tipo de pago debe ser efectivo o transferencia');
  }

  if (!Array.isArray(data.detalles) || data.detalles.length < 1) {
    throw crearErrorValidacion('Debes enviar al menos un producto en la venta');
  }
}

// Lista ventas registradas.
async function index() {
  return listarVentas();
}

// Devuelve el detalle de una venta por ID.
async function show(idVenta) {
  return obtenerVentaPorId(idVenta);
}

// Lista inventario disponible para cargar selector de productos en ventas.
async function catalogoInventario(idAlmacen) {
  const almacenNormalizado = normalizarNumeroEntero(idAlmacen);
  return listarInventarioDisponibleParaVenta(almacenNormalizado);
}

// Crea una venta descontando inventario del almacen origen.
async function store(payload, idUsuario) {
  return prisma.$transaction(async (tx) => {
    const data = normalizarPayload(payload);
    validarPayloadCreacion(data);

    const [cliente, almacen] = await Promise.all([
      tx.cliente.findUnique({ where: { idCliente: data.idCliente }, select: { idCliente: true } }),
      tx.almacen.findUnique({ where: { idAlmacen: data.idAlmacen }, select: { idAlmacen: true } }),
    ]);

    if (!cliente) {
      throw crearErrorValidacion('El cliente seleccionado no existe');
    }

    if (!almacen) {
      throw crearErrorValidacion('El almacen seleccionado no existe');
    }

    const detalleAgrupado = agruparDetallePorProducto(data.detalles);
    if (detalleAgrupado.length < 1) {
      throw crearErrorValidacion('Debes enviar cantidades validas en el detalle');
    }

    const idsProducto = detalleAgrupado.map((item) => item.idProducto);

    const [productos, inventarios] = await Promise.all([
      tx.producto.findMany({
        where: {
          idProducto: { in: idsProducto },
          activo: true,
        },
        select: {
          idProducto: true,
          precio: true,
        },
      }),
      tx.inventario.findMany({
        where: {
          idAlmacen: data.idAlmacen,
          idProducto: { in: idsProducto },
        },
        select: {
          idInventario: true,
          idProducto: true,
          stockActual: true,
        },
      }),
    ]);

    const mapaProductos = new Map(productos.map((item) => [item.idProducto, item]));
    const mapaInventarios = new Map(inventarios.map((item) => [item.idProducto, item]));

    let subtotal = 0;
    const detallePersistencia = [];

    for (const item of detalleAgrupado) {
      const producto = mapaProductos.get(item.idProducto);
      if (!producto) {
        throw crearErrorValidacion(`El producto ${item.idProducto} no existe o no esta activo`);
      }

      const inventario = mapaInventarios.get(item.idProducto);
      if (!inventario) {
        throw crearErrorValidacion(`El producto ${item.idProducto} no existe en el inventario del almacen`);
      }

      if (inventario.stockActual < item.cantidad) {
        throw crearErrorConflicto(`Stock insuficiente para el producto ${item.idProducto}`);
      }

      const precioUnitario = Number(producto.precio.toString());
      const subtotalLinea = precioUnitario * item.cantidad;
      subtotal += subtotalLinea;

      detallePersistencia.push({
        idProducto: item.idProducto,
        cantidad: item.cantidad,
        precioUnitario,
        subtotal: subtotalLinea,
      });
    }

    subtotal = redondearMoneda(subtotal);

    let montoPagado = subtotal;
    let cambio = 0;

    if (data.tipoPago === 'efectivo') {
      if (data.montoPagado === null || !Number.isFinite(data.montoPagado) || data.montoPagado <= 0) {
        throw crearErrorValidacion('Debes enviar un monto pagado valido para ventas en efectivo');
      }

      if (data.montoPagado < subtotal) {
        throw crearErrorValidacion('El monto pagado no puede ser menor al total de la venta');
      }

      montoPagado = redondearMoneda(data.montoPagado);
      cambio = redondearMoneda(montoPagado - subtotal);
    }

    const venta = await crearVentaBase(
      {
        folio: generarFolio(),
        idCliente: data.idCliente,
        idUsuario,
        idAlmacen: data.idAlmacen,
        tipoPago: data.tipoPago,
        estado: 'pagado',
        subtotal,
        total: subtotal,
        montoPagado,
        cambio,
        detalles: {
          create: detallePersistencia,
        },
      },
      tx,
    );

    for (const item of detallePersistencia) {
      await tx.inventario.update({
        where: {
          idAlmacen_idProducto: {
            idAlmacen: data.idAlmacen,
            idProducto: item.idProducto,
          },
        },
        data: {
          stockActual: { decrement: item.cantidad },
        },
      });
    }

    return venta;
  });
}

// Cambia estado de venta y revierte inventario cuando se cancela.
async function actualizarEstado(idVenta, estadoDestino) {
  return prisma.$transaction(async (tx) => {
    const estado = typeof estadoDestino === 'string' ? estadoDestino.trim().toLowerCase() : '';

    if (!ESTADOS_PERMITIDOS.includes(estado)) {
      throw crearErrorValidacion('Estado invalido. Usa pendiente, pagado o cancelado');
    }

    const ventaActual = await obtenerVentaConDetalleStock(idVenta, tx);
    if (!ventaActual) {
      return null;
    }

    if (ventaActual.estado === 'cancelado') {
      throw crearErrorConflicto('La venta ya esta cancelada');
    }

    if (ventaActual.estado === estado) {
      return obtenerVentaPorId(idVenta, tx);
    }

    if (estado === 'pendiente') {
      throw crearErrorValidacion('No se puede regresar una venta a pendiente');
    }

    if (estado === 'cancelado') {
      for (const item of ventaActual.detalles) {
        await tx.inventario.update({
          where: {
            idAlmacen_idProducto: {
              idAlmacen: ventaActual.almacen.idAlmacen,
              idProducto: item.idProducto,
            },
          },
          data: {
            stockActual: { increment: item.cantidad },
          },
        });
      }
    }

    return actualizarEstadoVentaBase(idVenta, estado, tx);
  });
}

module.exports = {
  index,
  show,
  catalogoInventario,
  store,
  actualizarEstado,
};
