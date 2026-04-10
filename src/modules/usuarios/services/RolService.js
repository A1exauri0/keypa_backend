const {
  listarRoles,
  obtenerRolPorId,
  crearRolConPermisosIds,
  actualizarRol,
  eliminarRol,
  actualizarPermisosRol,
  buscarRolesPorNombre,
} = require('../models/Rol');
const { buscarPermisosPorNombre } = require('./PermisoService');

/**
 * Crea rol con permisos por nombre resolviendo IDs en capa de servicio.
 */
async function crearRol({ nombre, descripcion = null, permisos = [] }) {
  const permisosDb = await buscarPermisosPorNombre(permisos);

  return crearRolConPermisosIds({
    nombre,
    descripcion,
    idPermisos: permisosDb.map((permiso) => permiso.idPermiso),
  });
}

/**
 * Reemplaza permisos del rol a partir de nombres y devuelve entidad actualizada.
 */
async function asignarPermisosARol({ idRol, permisos }) {
  const permisosDb = await buscarPermisosPorNombre(permisos);

  if (permisosDb.length === 0) {
    throw new Error('No se encontraron permisos validos para asignar al rol');
  }

  await actualizarPermisosRol({
    idRol,
    idPermisos: permisosDb.map((permiso) => permiso.idPermiso),
  });

  return obtenerRolPorId(idRol);
}

module.exports = {
  listarRoles,
  obtenerRolPorId,
  crearRol,
  actualizarRol,
  eliminarRol,
  asignarPermisosARol,
  buscarRolesPorNombre,
};
