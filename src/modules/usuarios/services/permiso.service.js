const {
  listarPermisos,
  obtenerPermisoPorId,
  crearPermiso,
  existePermisoPorId,
  actualizarPermiso,
  eliminarPermiso,
  buscarPermisosPorNombre,
} = require('../models/permiso.model');

/**
 * Actualiza permiso solo si existe y mantiene contrato de retorno null si no existe.
 */
async function actualizarPermisoSeguro({ idPermiso, nombre, descripcion }) {
  const existe = await existePermisoPorId(idPermiso);

  if (!existe) {
    return null;
  }

  return actualizarPermiso({ idPermiso, nombre, descripcion });
}

/**
 * Elimina permiso solo si existe y mantiene contrato booleano para controlador.
 */
async function eliminarPermisoSeguro(idPermiso) {
  const existe = await existePermisoPorId(idPermiso);

  if (!existe) {
    return null;
  }

  await eliminarPermiso(idPermiso);
  return true;
}

module.exports = {
  listarPermisos,
  obtenerPermisoPorId,
  crearPermiso,
  actualizarPermiso: actualizarPermisoSeguro,
  eliminarPermiso: eliminarPermisoSeguro,
  buscarPermisosPorNombre,
};
