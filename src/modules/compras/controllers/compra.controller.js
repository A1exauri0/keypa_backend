const {
  index: indexService,
  show: showService,
  store: storeService,
  actualizarEstado: actualizarEstadoService,
} = require('../services/compra.service');

// GET /compras - lista compras con relaciones.
async function index(_req, res) {
  const compras = await indexService();
  return res.json({ data: compras });
}

// GET /compras/:id - detalle de compra.
async function show(req, res) {
  const idCompra = Number(req.params.id);
  const compra = await showService(idCompra);

  if (!compra) {
    return res.status(404).json({ message: 'Compra no encontrada' });
  }

  return res.json({ data: compra });
}

// POST /compras - crea compra completa y suma stock.
async function store(req, res) {
  const compra = await storeService(req.body, req.user.id);

  return res.status(201).json({
    message: 'Compra creada correctamente',
    data: compra,
  });
}

// PATCH /compras/:id/estado - cancela compra y revierte stock.
async function actualizarEstado(req, res) {
  const idCompra = Number(req.params.id);
  const compra = await actualizarEstadoService(idCompra, req.body.estado);

  if (!compra) {
    return res.status(404).json({ message: 'Compra no encontrada' });
  }

  return res.json({
    message: 'Estado de compra actualizado correctamente',
    data: compra,
  });
}

module.exports = {
  index,
  show,
  store,
  actualizarEstado,
};
