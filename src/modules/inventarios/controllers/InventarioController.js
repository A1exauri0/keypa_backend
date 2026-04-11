const {
  index: indexService,
  show: showService,
  store: storeService,
  update: updateService,
  destroy: destroyService,
  destroyMany: destroyManyService,
} = require('../services/InventarioService');

async function index(_req, res) {
  const inventarios = await indexService();
  return res.json({ data: inventarios });
}

async function show(req, res) {
  const idInventario = Number(req.params.id);
  const inventario = await showService(idInventario);

  if (!inventario) {
    return res.status(404).json({ message: 'Inventario no encontrado' });
  }

  return res.json({ data: inventario });
}

async function store(req, res) {
  const inventario = await storeService(req.body);
  return res.status(201).json({
    message: 'Inventario creado correctamente',
    data: inventario,
  });
}

async function update(req, res) {
  const idInventario = Number(req.params.id);
  const inventario = await updateService(idInventario, req.body);

  if (!inventario) {
    return res.status(404).json({ message: 'Inventario no encontrado' });
  }

  return res.json({
    message: 'Inventario actualizado correctamente',
    data: inventario,
  });
}

async function destroy(req, res) {
  const idInventario = Number(req.params.id);
  const eliminado = await destroyService(idInventario);

  if (!eliminado) {
    return res.status(404).json({ message: 'Inventario no encontrado' });
  }

  return res.json({ message: 'Inventario eliminado correctamente' });
}

async function destroyMany(req, res) {
  const ids = req.body.ids.map((item) => Number(item));
  const eliminados = await destroyManyService(ids);

  return res.json({
    message: 'Inventarios eliminados correctamente',
    eliminados,
  });
}

module.exports = {
  index,
  show,
  store,
  update,
  destroy,
  destroyMany,
};
