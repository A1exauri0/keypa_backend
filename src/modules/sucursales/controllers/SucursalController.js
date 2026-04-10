const {
  index: indexService,
  show: showService,
  store: storeService,
  update: updateService,
  destroy: destroyService,
  destroyMany: destroyManyService,
} = require('../services/SucursalService');

async function index(_req, res) {
  const sucursales = await indexService();
  return res.json({ data: sucursales });
}

async function show(req, res) {
  const idSucursal = Number(req.params.id);
  const sucursal = await showService(idSucursal);

  if (!sucursal) {
    return res.status(404).json({ message: 'Sucursal no encontrada' });
  }

  return res.json({ data: sucursal });
}

async function store(req, res) {
  const sucursal = await storeService(req.body);
  return res.status(201).json({
    message: 'Sucursal creada correctamente',
    data: sucursal,
  });
}

async function update(req, res) {
  const idSucursal = Number(req.params.id);
  const sucursal = await updateService(idSucursal, req.body);

  if (!sucursal) {
    return res.status(404).json({ message: 'Sucursal no encontrada' });
  }

  return res.json({
    message: 'Sucursal actualizada correctamente',
    data: sucursal,
  });
}

async function destroy(req, res) {
  const idSucursal = Number(req.params.id);
  const eliminada = await destroyService(idSucursal);

  if (!eliminada) {
    return res.status(404).json({ message: 'Sucursal no encontrada' });
  }

  return res.json({ message: 'Sucursal eliminada correctamente' });
}

async function destroyMany(req, res) {
  const ids = req.body.ids.map((item) => Number(item));
  const eliminados = await destroyManyService(ids);

  return res.json({
    message: 'Sucursales eliminadas correctamente',
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
