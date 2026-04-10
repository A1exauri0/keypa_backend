const {
  index: indexService,
  show: showService,
  store: storeService,
  update: updateService,
  destroy: destroyService,
  destroyMany: destroyManyService,
} = require('../services/ProductoService');

function normalizarTipo(valor) {
  const mapa = {
    ROPA: 'Ropa',
    MAQUILLAJE: 'Maquillaje',
    HOGAR: 'Accesorios',
    OTROS: 'Otros',
    Ropa: 'Ropa',
    Maquillaje: 'Maquillaje',
    Accesorios: 'Accesorios',
    Otros: 'Otros',
  };
  return mapa[valor] || valor;
}

function normalizarDisponibilidad(valor) {
  const mapa = {
    PUBLICADO: 'Disponible',
    BORRADOR: 'Pausado',
    DESCONTINUADO: 'Descontinuado',
    Disponible: 'Disponible',
    Pausado: 'Pausado',
    Descontinuado: 'Descontinuado',
  };
  return mapa[valor] || valor;
}

// GET /productos - Lista productos con filtros opcionales por query.
async function index(req, res) {
  const filtros = {
    q: req.query.q,
    tipo: normalizarTipo(req.query.tipo ?? req.query.tipoProducto),
    disponibilidad: normalizarDisponibilidad(req.query.disponibilidad ?? req.query.estado),
    idMarca: req.query.idMarca ? Number(req.query.idMarca) : undefined,
    idCategoria: req.query.idCategoria ? Number(req.query.idCategoria) : undefined,
    activo: req.query.activo === undefined ? undefined : req.query.activo === 'true',
  };

  const productos = await indexService(filtros);
  return res.json({ data: productos });
}

// GET /productos/:id - Obtiene un producto por ID.
async function show(req, res) {
  const idProducto = Number(req.params.id);
  const producto = await showService(idProducto);

  if (!producto) {
    return res.status(404).json({ message: 'Producto no encontrado' });
  }

  return res.json({ data: producto });
}

// POST /productos - Crea un producto con marca, categorias e imagenes.
async function store(req, res) {
  const payload = {
    ...req.body,
    tipo: normalizarTipo(req.body.tipo ?? req.body.tipoProducto),
    disponibilidad: normalizarDisponibilidad(req.body.disponibilidad ?? req.body.estado),
    idMarca: Number(req.body.idMarca),
    categorias: (req.body.categorias || []).map((item) => Number(item)),
  };

  const producto = await storeService(payload);

  return res.status(201).json({
    message: 'Producto creado correctamente',
    data: producto,
  });
}

// POST /productos/upload-image - Sube una imagen de producto y retorna su URL publica.
async function uploadImage(req, res) {
  if (!req.file) {
    return res.status(400).json({ message: 'Debes enviar una imagen en el campo image' });
  }

  const url = `/storage/productos/${req.file.filename}`;

  return res.status(201).json({
    message: 'Imagen subida correctamente',
    data: {
      url,
      filename: req.file.filename,
      size: req.file.size,
      mimeType: req.file.mimetype,
    },
  });
}

// PUT /productos/:id - Actualiza un producto y sus relaciones.
async function update(req, res) {
  const idProducto = Number(req.params.id);
  const payload = {
    ...req.body,
    ...(req.body.tipo !== undefined || req.body.tipoProducto !== undefined
      ? { tipo: normalizarTipo(req.body.tipo ?? req.body.tipoProducto) }
      : {}),
    ...(req.body.disponibilidad !== undefined || req.body.estado !== undefined
      ? { disponibilidad: normalizarDisponibilidad(req.body.disponibilidad ?? req.body.estado) }
      : {}),
    ...(req.body.idMarca !== undefined ? { idMarca: Number(req.body.idMarca) } : {}),
    ...(Array.isArray(req.body.categorias)
      ? { categorias: req.body.categorias.map((item) => Number(item)) }
      : {}),
  };

  const producto = await updateService(idProducto, payload);

  if (!producto) {
    return res.status(404).json({ message: 'Producto no encontrado' });
  }

  return res.json({
    message: 'Producto actualizado correctamente',
    data: producto,
  });
}

// DELETE /productos/:id - Elimina un producto por ID.
async function destroy(req, res) {
  const idProducto = Number(req.params.id);
  const eliminado = await destroyService(idProducto);

  if (!eliminado) {
    return res.status(404).json({ message: 'Producto no encontrado' });
  }

  return res.json({ message: 'Producto eliminado correctamente' });
}

// POST /productos/bulk-delete - Elimina multiples productos por IDs.
async function destroyMany(req, res) {
  const ids = req.body.ids.map((item) => Number(item));
  const eliminados = await destroyManyService(ids);

  return res.json({
    message: 'Productos eliminados correctamente',
    eliminados,
  });
}

module.exports = {
  index,
  show,
  store,
  uploadImage,
  update,
  destroy,
  destroyMany,
};
