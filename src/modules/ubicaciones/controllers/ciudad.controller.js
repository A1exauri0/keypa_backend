const {
  index: indexService,
  show: showService,
  store: storeService,
  update: updateService,
  destroy: destroyService,
  destroyMany: destroyManyService,
} = require('../services/ciudad.service');

// GET /ciudades - Lista todas las ciudades registradas.
async function index(_req, res) {
  const ciudades = await indexService();
  return res.json({ data: ciudades });
}

// GET /ciudades/:id - Obtiene una ciudad por su ID.
async function show(req, res) {
  const idCiudad = Number(req.params.id);
  const ciudad = await showService(idCiudad);

  if (!ciudad) {
    return res.status(404).json({ message: 'Ciudad no encontrada' });
  }

  return res.json({ data: ciudad });
}

// POST /ciudades - Crea una nueva ciudad.
async function store(req, res) {
  const ciudad = await storeService(req.body);
  return res.status(201).json({
    message: 'Ciudad creada correctamente',
    data: ciudad,
  });
}

// PUT /ciudades/:id - Actualiza una ciudad existente.
async function update(req, res) {
  const idCiudad = Number(req.params.id);
  const ciudad = await updateService(idCiudad, req.body);

  if (!ciudad) {
    return res.status(404).json({ message: 'Ciudad no encontrada' });
  }

  return res.json({
    message: 'Ciudad actualizada correctamente',
    data: ciudad,
  });
}

// DELETE /ciudades/:id - Elimina una ciudad por su ID.
async function destroy(req, res) {
  const idCiudad = Number(req.params.id);
  const eliminada = await destroyService(idCiudad);

  if (!eliminada) {
    return res.status(404).json({ message: 'Ciudad no encontrada' });
  }

  return res.json({ message: 'Ciudad eliminada correctamente' });
}

// POST /ciudades/bulk-delete - Elimina varias ciudades por IDs.
async function destroyMany(req, res) {
  const ids = req.body.ids.map((item) => Number(item));
  const eliminados = await destroyManyService(ids);

  return res.json({
    message: 'Ciudades eliminadas correctamente',
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
