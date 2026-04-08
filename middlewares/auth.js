const jwt = require('jsonwebtoken');
const { buscarPorId, mapearUsuarioAuth } = require('../models/User');

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
      return res.status(401).json({ message: 'No autenticado' });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await buscarPorId(payload.sub);

    if (!user || !user.activo) {
      return res.status(401).json({ message: 'No autenticado' });
    }

    req.user = mapearUsuarioAuth(user);
    return next();
  } catch (_error) {
    return res.status(401).json({ message: 'No autenticado' });
  }
}

function requirePermiso(nombrePermiso) {
  return (req, res, next) => {
    if (!req.user || !req.user.permisos.includes(nombrePermiso)) {
      return res.status(403).json({ message: 'No tienes permiso para esta accion' });
    }

    return next();
  };
}

module.exports = {
  requireAuth,
  requirePermiso,
};
