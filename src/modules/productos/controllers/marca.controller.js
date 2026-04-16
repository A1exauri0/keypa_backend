const {
  index: indexService,
  show: showService,
  store: storeService,
  update: updateService,
  destroy: destroyService,
  destroyMany: destroyManyService,
} = require('../services/marca.service');

// GET /marcas - Lista todas las marcas ordenadas por nombre.
async function index(_req, res) {
  const marcas = await indexService();
  return res.json({ data: marcas });
}

// GET /marcas/:id - Obtiene una marca por su ID.
async function show(req, res) {
  const idMarca = Number(req.params.id);
  const marca = await showService(idMarca);

  if (!marca) {
    return res.status(404).json({ message: 'Marca no encontrada' });
  }

  return res.json({ data: marca });
}

// POST /marcas - Crea una nueva marca.
async function store(req, res) {
  const marca = await storeService(req.body);
  return res.status(201).json({
    message: 'Marca creada correctamente',
    data: marca,
  });
}

// PUT /marcas/:id - Actualiza una marca existente.
async function update(req, res) {
  const idMarca = Number(req.params.id);
  const marca = await updateService(idMarca, req.body);

  if (!marca) {
    return res.status(404).json({ message: 'Marca no encontrada' });
  }

  return res.json({
    message: 'Marca actualizada correctamente',
    data: marca,
  });
}

// DELETE /marcas/:id - Elimina una marca por ID.
async function destroy(req, res) {
  const idMarca = Number(req.params.id);
  const eliminada = await destroyService(idMarca);

  if (!eliminada) {
    return res.status(404).json({ message: 'Marca no encontrada' });
  }

  return res.json({ message: 'Marca eliminada correctamente' });
}

// POST /marcas/bulk-delete - Elimina multiples marcas por IDs.
async function destroyMany(req, res) {
  const ids = req.body.ids.map((item) => Number(item));
  const eliminados = await destroyManyService(ids);

  return res.json({
    message: 'Marcas eliminadas correctamente',
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
