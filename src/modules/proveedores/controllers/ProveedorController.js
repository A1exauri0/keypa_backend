const {
  index: indexService,
  show: showService,
  store: storeService,
  update: updateService,
  destroy: destroyService,
  destroyMany: destroyManyService,
} = require('../services/ProveedorService');

// GET /proveedores - Lista todos los proveedores.
async function index(_req, res) {
  const proveedores = await indexService();
  return res.json({ data: proveedores });
}

// GET /proveedores/:id - Obtiene proveedor por ID.
async function show(req, res) {
  const idProveedor = Number(req.params.id);
  const proveedor = await showService(idProveedor);

  if (!proveedor) {
    return res.status(404).json({ message: 'Proveedor no encontrado' });
  }

  return res.json({ data: proveedor });
}

// POST /proveedores - Crea un nuevo proveedor.
async function store(req, res) {
  const proveedor = await storeService(req.body);

  return res.status(201).json({
    message: 'Proveedor creado correctamente',
    data: proveedor,
  });
}

// PUT /proveedores/:id - Actualiza proveedor existente.
async function update(req, res) {
  const idProveedor = Number(req.params.id);
  const proveedor = await updateService(idProveedor, req.body);

  if (!proveedor) {
    return res.status(404).json({ message: 'Proveedor no encontrado' });
  }

  return res.json({
    message: 'Proveedor actualizado correctamente',
    data: proveedor,
  });
}

// DELETE /proveedores/:id - Elimina proveedor por ID.
async function destroy(req, res) {
  const idProveedor = Number(req.params.id);
  const eliminado = await destroyService(idProveedor);

  if (!eliminado) {
    return res.status(404).json({ message: 'Proveedor no encontrado' });
  }

  return res.json({ message: 'Proveedor eliminado correctamente' });
}

// POST /proveedores/bulk-delete - Elimina varios proveedores por IDs.
async function destroyMany(req, res) {
  const ids = req.body.ids.map((item) => Number(item));
  const eliminados = await destroyManyService(ids);

  return res.json({
    message: 'Proveedores eliminados correctamente',
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
