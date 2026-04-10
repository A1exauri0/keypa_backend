const {
  index: indexService,
  show: showService,
  store: storeService,
  update: updateService,
  destroy: destroyService,
  destroyMany: destroyManyService,
} = require('../services/ColoniaService');

// GET /colonias - Lista colonias, con filtro opcional por ciudad.
async function index(req, res) {
  const idCiudad = req.query.idCiudad ? Number(req.query.idCiudad) : undefined;
  const colonias = await indexService({ idCiudad });
  return res.json({ data: colonias });
}

// GET /colonias/:id - Obtiene una colonia por su ID.
async function show(req, res) {
  const idColonia = Number(req.params.id);
  const colonia = await showService(idColonia);

  if (!colonia) {
    return res.status(404).json({ message: 'Colonia no encontrada' });
  }

  return res.json({ data: colonia });
}

// POST /colonias - Crea una nueva colonia asociada a ciudad.
async function store(req, res) {
  const colonia = await storeService(req.body);
  return res.status(201).json({
    message: 'Colonia creada correctamente',
    data: colonia,
  });
}

// PUT /colonias/:id - Actualiza una colonia existente.
async function update(req, res) {
  const idColonia = Number(req.params.id);
  const colonia = await updateService(idColonia, req.body);

  if (!colonia) {
    return res.status(404).json({ message: 'Colonia no encontrada' });
  }

  return res.json({
    message: 'Colonia actualizada correctamente',
    data: colonia,
  });
}

// DELETE /colonias/:id - Elimina una colonia por su ID.
async function destroy(req, res) {
  const idColonia = Number(req.params.id);
  const eliminada = await destroyService(idColonia);

  if (!eliminada) {
    return res.status(404).json({ message: 'Colonia no encontrada' });
  }

  return res.json({ message: 'Colonia eliminada correctamente' });
}

// POST /colonias/bulk-delete - Elimina varias colonias por IDs.
async function destroyMany(req, res) {
  const ids = req.body.ids.map((item) => Number(item));
  const eliminados = await destroyManyService(ids);

  return res.json({
    message: 'Colonias eliminadas correctamente',
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
