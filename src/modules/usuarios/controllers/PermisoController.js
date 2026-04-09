const {
  listarPermisos,
  obtenerPermisoPorId,
  crearPermiso,
  actualizarPermiso,
  eliminarPermiso,
} = require('../models/Permiso');

async function index(_req, res) {
  const permisos = await listarPermisos();
  return res.json({ data: permisos });
}

async function show(req, res) {
  const idPermiso = Number(req.params.id);
  const permiso = await obtenerPermisoPorId(idPermiso);

  if (!permiso) {
    return res.status(404).json({ message: 'Permiso no encontrado' });
  }

  return res.json({ data: permiso });
}

async function store(req, res) {
  const { nombre, descripcion } = req.body;
  const permiso = await crearPermiso({ nombre, descripcion });

  return res.status(201).json({
    message: 'Permiso creado correctamente',
    data: permiso,
  });
}

async function update(req, res) {
  const idPermiso = Number(req.params.id);
  const { nombre, descripcion } = req.body;
  const permiso = await actualizarPermiso({ idPermiso, nombre, descripcion });

  if (!permiso) {
    return res.status(404).json({ message: 'Permiso no encontrado' });
  }

  return res.json({
    message: 'Permiso actualizado correctamente',
    data: permiso,
  });
}

async function destroy(req, res) {
  const idPermiso = Number(req.params.id);
  const eliminado = await eliminarPermiso(idPermiso);

  if (!eliminado) {
    return res.status(404).json({ message: 'Permiso no encontrado' });
  }

  return res.json({ message: 'Permiso eliminado correctamente' });
}

module.exports = {
  index,
  show,
  store,
  update,
  destroy,
};
