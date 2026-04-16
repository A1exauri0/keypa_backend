const {
  index: indexService,
  show: showService,
  store: storeService,
  update: updateService,
  destroy: destroyService,
  destroyMany: destroyManyService,
} = require('../services/cliente.service');

// GET /clientes - Lista todos los clientes.
async function index(_req, res) {
  const clientes = await indexService();
  return res.json({ data: clientes });
}

// GET /clientes/:id - Obtiene cliente por ID.
async function show(req, res) {
  const idCliente = Number(req.params.id);
  const cliente = await showService(idCliente);

  if (!cliente) {
    return res.status(404).json({ message: 'Cliente no encontrado' });
  }

  return res.json({ data: cliente });
}

// POST /clientes - Crea un nuevo cliente.
async function store(req, res) {
  const cliente = await storeService(req.body);
  return res.status(201).json({
    message: 'Cliente creado correctamente',
    data: cliente,
  });
}

// PUT /clientes/:id - Actualiza cliente existente.
async function update(req, res) {
  const idCliente = Number(req.params.id);
  const cliente = await updateService(idCliente, req.body);

  if (!cliente) {
    return res.status(404).json({ message: 'Cliente no encontrado' });
  }

  return res.json({
    message: 'Cliente actualizado correctamente',
    data: cliente,
  });
}

// DELETE /clientes/:id - Elimina cliente por ID.
async function destroy(req, res) {
  const idCliente = Number(req.params.id);
  const eliminado = await destroyService(idCliente);

  if (!eliminado) {
    return res.status(404).json({ message: 'Cliente no encontrado' });
  }

  return res.json({ message: 'Cliente eliminado correctamente' });
}

// POST /clientes/bulk-delete - Elimina varios clientes por IDs.
async function destroyMany(req, res) {
  const ids = req.body.ids.map((item) => Number(item));
  const eliminados = await destroyManyService(ids);

  return res.json({
    message: 'Clientes eliminados correctamente',
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
