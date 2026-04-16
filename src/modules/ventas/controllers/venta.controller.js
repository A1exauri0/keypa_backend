const {
  index: indexService,
  show: showService,
  catalogoInventario: catalogoInventarioService,
  store: storeService,
  actualizarEstado: actualizarEstadoService,
} = require('../services/venta.service');

// GET /ventas - lista ventas con relaciones.
async function index(_req, res) {
  const ventas = await indexService();
  return res.json({ data: ventas });
}

// GET /ventas/:id - detalle de venta.
async function show(req, res) {
  const idVenta = Number(req.params.id);
  const venta = await showService(idVenta);

  if (!venta) {
    return res.status(404).json({ message: 'Venta no encontrada' });
  }

  return res.json({ data: venta });
}

// GET /ventas/catalogo-inventario - inventario con stock para el modal de ventas.
async function catalogoInventario(req, res) {
  const inventario = await catalogoInventarioService(req.query.idAlmacen);
  return res.json({ data: inventario });
}

// POST /ventas - crea venta nueva y descuenta stock.
async function store(req, res) {
  const venta = await storeService(req.body, req.user.id);

  return res.status(201).json({
    message: 'Venta creada correctamente',
    data: venta,
  });
}

// PATCH /ventas/:id/estado - actualiza estado de la venta.
async function actualizarEstado(req, res) {
  const idVenta = Number(req.params.id);
  const venta = await actualizarEstadoService(idVenta, req.body.estado);

  if (!venta) {
    return res.status(404).json({ message: 'Venta no encontrada' });
  }

  return res.json({
    message: 'Estado de venta actualizado correctamente',
    data: venta,
  });
}

module.exports = {
  index,
  show,
  catalogoInventario,
  store,
  actualizarEstado,
};
