const {
  index: indexService,
  show: showService,
  store: storeService,
  update: updateService,
  destroy: destroyService,
  destroyMany: destroyManyService,
} = require('../services/categoria.service');

// GET /categorias - Lista todas las categorias ordenadas por nombre.
async function index(_req, res) {
  const categorias = await indexService();
  return res.json({ data: categorias });
}

// GET /categorias/:id - Obtiene una categoria por su ID.
async function show(req, res) {
  const idCategoria = Number(req.params.id);
  const categoria = await showService(idCategoria);

  if (!categoria) {
    return res.status(404).json({ message: 'Categoria no encontrada' });
  }

  return res.json({ data: categoria });
}

// POST /categorias - Crea una nueva categoria.
async function store(req, res) {
  const categoria = await storeService(req.body);
  return res.status(201).json({
    message: 'Categoria creada correctamente',
    data: categoria,
  });
}

// PUT /categorias/:id - Actualiza una categoria existente.
async function update(req, res) {
  const idCategoria = Number(req.params.id);
  const categoria = await updateService(idCategoria, req.body);

  if (!categoria) {
    return res.status(404).json({ message: 'Categoria no encontrada' });
  }

  return res.json({
    message: 'Categoria actualizada correctamente',
    data: categoria,
  });
}

// DELETE /categorias/:id - Elimina una categoria por ID.
async function destroy(req, res) {
  const idCategoria = Number(req.params.id);
  const eliminada = await destroyService(idCategoria);

  if (!eliminada) {
    return res.status(404).json({ message: 'Categoria no encontrada' });
  }

  return res.json({ message: 'Categoria eliminada correctamente' });
}

// POST /categorias/bulk-delete - Elimina multiples categorias por IDs.
async function destroyMany(req, res) {
  const ids = req.body.ids.map((item) => Number(item));
  const eliminados = await destroyManyService(ids);

  return res.json({
    message: 'Categorias eliminadas correctamente',
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
