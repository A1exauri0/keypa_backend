const jwt = require('jsonwebtoken');
const { buscarPorId, mapearUsuarioAuth } = require('../../modules/usuarios/models/User');

function esDepuracionAuth() {
  return process.env.DEBUG_AUTH_RESPONSES === 'true' || process.env.NODE_ENV === 'development';
}

function obtenerTokenDesdeRequest(req) {
  const authorization = req.headers.authorization || '';

  if (authorization.startsWith('Bearer ')) {
    return authorization.slice(7).trim();
  }

  return null;
}

async function requireAuth(req, res, next) {
  try {
    const token = obtenerTokenDesdeRequest(req);
    if (!token) {
      return res.status(401).json({
        message: 'No autenticado',
        codigo: 'TOKEN_NO_ENVIADO',
      });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await buscarPorId(payload.sub);

    if (!user || !user.activo) {
      return res.status(401).json({
        message: 'No autenticado',
        codigo: 'USUARIO_TOKEN_INVALIDO_O_INACTIVO',
      });
    }

    req.user = mapearUsuarioAuth(user);
    return next();
  } catch (error) {
    return res.status(401).json({
      message: 'No autenticado',
      codigo: 'TOKEN_INVALIDO',
      diagnostico: esDepuracionAuth()
        ? {
            detalle: error.message,
          }
        : undefined,
    });
  }
}

function requirePermiso(nombrePermiso) {
  const permisosRequeridos = Array.isArray(nombrePermiso) ? nombrePermiso : [nombrePermiso];

  return (req, res, next) => {
    if (!req.user) {
      return res.status(403).json({
        message: 'No tienes permiso para esta accion',
        codigo: 'USUARIO_NO_AUTENTICADO',
      });
    }

    const autorizado = permisosRequeridos.some((permiso) => req.user.permisos.includes(permiso));
    if (!autorizado) {
      return res.status(403).json({
        message: 'No tienes permiso para esta accion',
        codigo: 'PERMISO_INSUFICIENTE',
      });
    }

    return next();
  };
}

function requireRol(nombreRol) {
  const rolesRequeridos = Array.isArray(nombreRol) ? nombreRol : [nombreRol];

  return (req, res, next) => {
    if (!req.user) {
      return res.status(403).json({
        message: 'No tienes rol para esta accion',
        codigo: 'USUARIO_NO_AUTENTICADO',
      });
    }

    const autorizado = rolesRequeridos.some((rol) => req.user.roles.includes(rol));
    if (!autorizado) {
      return res.status(403).json({
        message: 'No tienes rol para esta accion',
        codigo: 'ROL_INSUFICIENTE',
      });
    }

    return next();
  };
}

module.exports = {
  requireAuth,
  requirePermiso,
  requireRol,
};
