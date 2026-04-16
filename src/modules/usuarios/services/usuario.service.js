const bcrypt = require('bcryptjs');
const { buscarRolesPorNombre } = require('./rol.service');
const { buscarPermisosPorNombre } = require('./permiso.service');
const {
  buscarPorEmail,
  buscarPorId,
  contarUsuarios,
  crearUsuarioConHash,
  listarUsuarios,
  obtenerUsuarioPorId,
  actualizarUsuario,
  eliminarUsuario,
  actualizarRolesUsuario,
  actualizarPermisosUsuario,
  existeUsuarioConEmail,
  guardarTokenRecuperacion,
  buscarPorTokenRecuperacion,
  actualizarPasswordConRecuperacion,
} = require('../models/User');

/**
 * Convierte la entidad usuario con relaciones a formato auth consumible por API.
 */
function mapearUsuarioAuth(user) {
  const roles = (user.roles || []).map((item) => item.rol?.nombre).filter(Boolean);

  const permisosSet = new Set();
  (user.roles || []).forEach((item) => {
    (item.rol?.permisos || []).forEach((rp) => {
      if (rp.permiso?.nombre) {
        permisosSet.add(rp.permiso.nombre);
      }
    });
  });

  (user.permisosDirectos || []).forEach((up) => {
    if (up.permiso?.nombre) {
      permisosSet.add(up.permiso.nombre);
    }
  });

  return {
    id: user.idUsuario,
    nombre: user.nombre,
    email: user.email,
    activo: user.activo,
    roles,
    permisos: Array.from(permisosSet),
  };
}

/**
 * Crea usuario con hash de contrasena y asignaciones iniciales de rol/permisos.
 */
async function crearUsuario({ nombre, email, password, roles = ['editor'], permisosAdicionales = [] }) {
  const passwordHash = await bcrypt.hash(password, 12);
  const rolesDb = await buscarRolesPorNombre(roles);
  const permisosDb = await buscarPermisosPorNombre(permisosAdicionales);

  if (rolesDb.length === 0) {
    throw new Error('No se encontraron roles validos para el usuario');
  }

  if (permisosAdicionales.length > 0 && permisosDb.length === 0) {
    throw new Error('No se encontraron permisos adicionales validos para el usuario');
  }

  return crearUsuarioConHash({
    nombre,
    email,
    passwordHash,
    idRoles: rolesDb.map((rol) => rol.idRol),
    idPermisos: permisosDb.map((permiso) => permiso.idPermiso),
  });
}

/**
 * Reemplaza por completo los roles del usuario y devuelve la entidad actualizada.
 */
async function asignarRolesAUsuario({ userId, roles }) {
  const rolesDb = await buscarRolesPorNombre(roles);

  if (rolesDb.length === 0) {
    throw new Error('No se encontraron roles validos para asignar');
  }

  await actualizarRolesUsuario({
    idUsuario: userId,
    idRoles: rolesDb.map((rol) => rol.idRol),
  });

  return buscarPorId(userId);
}

/**
 * Reemplaza permisos directos del usuario y devuelve la entidad actualizada.
 */
async function asignarPermisosAUsuario({ idUsuario, permisos }) {
  const permisosDb = await buscarPermisosPorNombre(permisos);

  if (permisosDb.length === 0) {
    throw new Error('No se encontraron permisos validos para asignar');
  }

  await actualizarPermisosUsuario({
    idUsuario,
    idPermisos: permisosDb.map((permiso) => permiso.idPermiso),
  });

  return buscarPorId(idUsuario);
}

module.exports = {
  buscarPorEmail,
  buscarPorId,
  contarUsuarios,
  crearUsuario,
  listarUsuarios,
  obtenerUsuarioPorId,
  actualizarUsuario,
  eliminarUsuario,
  asignarRolesAUsuario,
  asignarPermisosAUsuario,
  existeUsuarioConEmail,
  guardarTokenRecuperacion,
  buscarPorTokenRecuperacion,
  actualizarPasswordConRecuperacion,
  mapearUsuarioAuth,
};
