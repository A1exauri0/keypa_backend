const {
  index: indexService,
  show: showService,
  store: storeService,
  update: updateService,
  destroy: destroyService,
  destroyMany: destroyManyService,
} = require('../services/AlmacenService');

async function index(_req, res) {
  const almacenes = await indexService();
  return res.json({ data: almacenes });
}

async function show(req, res) {
  const idAlmacen = Number(req.params.id);
  const almacen = await showService(idAlmacen);

  if (!almacen) {
    return res.status(404).json({ message: 'Almacen no encontrado' });
  }

  return res.json({ data: almacen });
}

async function store(req, res) {
  const almacen = await storeService(req.body);
  return res.status(201).json({
    message: 'Almacen creado correctamente',
    data: almacen,
  });
}

async function update(req, res) {
  const idAlmacen = Number(req.params.id);
  const almacen = await updateService(idAlmacen, req.body);

  if (!almacen) {
    return res.status(404).json({ message: 'Almacen no encontrado' });
  }

  return res.json({
    message: 'Almacen actualizado correctamente',
    data: almacen,
  });
}

async function destroy(req, res) {
  const idAlmacen = Number(req.params.id);
  const eliminado = await destroyService(idAlmacen);

  if (!eliminado) {
    return res.status(404).json({ message: 'Almacen no encontrado' });
  }

  return res.json({ message: 'Almacen eliminado correctamente' });
}

async function destroyMany(req, res) {
  const ids = req.body.ids.map((item) => Number(item));
  const eliminados = await destroyManyService(ids);

  return res.json({
    message: 'Almacenes eliminados correctamente',
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
