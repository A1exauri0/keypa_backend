const {
  listarRoles,
  obtenerRolPorId,
  crearRol,
  actualizarRol,
  eliminarRol,
  asignarPermisosARol,
} = require('../services/RolService');

async function index(_req, res) {
  const roles = await listarRoles();
  return res.json({ data: roles });
}

async function show(req, res) {
  const idRol = Number(req.params.id);
  const rol = await obtenerRolPorId(idRol);

  if (!rol) {
    return res.status(404).json({ message: 'Rol no encontrado' });
  }

  return res.json({ data: rol });
}

async function store(req, res) {
  const { nombre, descripcion, permisos = [] } = req.body;
  const rol = await crearRol({ nombre, descripcion, permisos });

  return res.status(201).json({
    message: 'Rol creado correctamente',
    data: rol,
  });
}

async function update(req, res) {
  const idRol = Number(req.params.id);
  const { nombre, descripcion } = req.body;
  const rol = await actualizarRol({ idRol, nombre, descripcion });

  if (!rol) {
    return res.status(404).json({ message: 'Rol no encontrado' });
  }

  return res.json({
    message: 'Rol actualizado correctamente',
    data: rol,
  });
}

async function destroy(req, res) {
  const idRol = Number(req.params.id);
  const eliminado = await eliminarRol(idRol);

  if (!eliminado) {
    return res.status(404).json({ message: 'Rol no encontrado' });
  }

  return res.json({ message: 'Rol eliminado correctamente' });
}

async function asignarPermisos(req, res) {
  const idRol = Number(req.params.id);
  const rol = await asignarPermisosARol({
    idRol,
    permisos: req.body.permisos,
  });

  if (!rol) {
    return res.status(404).json({ message: 'Rol no encontrado' });
  }

  return res.json({
    message: 'Permisos del rol actualizados correctamente',
    data: rol,
  });
}

module.exports = {
  index,
  show,
  store,
  update,
  destroy,
  asignarPermisos,
};
