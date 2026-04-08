const express = require('express');
const UsuarioController = require('../controllers/UsuarioController');
const { listarRoles } = require('../models/Rol');
const { listarPermisos } = require('../models/Permiso');
const { body, param } = require('express-validator');
const { requireAuth, requirePermiso } = require('../middlewares/auth');
const validarRequest = require('../middlewares/validarRequest');

const router = express.Router();

router.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'keypa_backend' });
});

router.post(
  '/auth/login',
  [
    body('email').isEmail().withMessage('Correo invalido'),
    body('password').isLength({ min: 6 }).withMessage('La contrasena debe tener al menos 6 caracteres'),
  ],
  validarRequest,
  UsuarioController.login,
);

router.post(
  '/auth/register',
  [
    body('nombre').isString().isLength({ min: 2 }),
    body('email').isEmail(),
    body('password').isLength({ min: 8 }),
  ],
  validarRequest,
  UsuarioController.registerInicial,
);

router.get('/auth/me', requireAuth, UsuarioController.me);
router.post('/auth/logout', requireAuth, UsuarioController.logout);

router.get('/inicio', requireAuth, requirePermiso('panel.ver'), (req, res) => {
  res.json({
    message: 'Logueado correctamente',
    nombre: req.user.nombre,
  });
});

router.get('/usuarios', requireAuth, requirePermiso('usuarios.ver'), UsuarioController.index);

router.post(
  '/usuarios',
  requireAuth,
  requirePermiso('usuarios.crear'),
  [
    body('nombre').isString().isLength({ min: 2 }),
    body('email').isEmail(),
    body('password').isLength({ min: 8 }),
    body('roles').isArray({ min: 1 }),
    body('permisosAdicionales').optional().isArray(),
  ],
  validarRequest,
  UsuarioController.store,
);

router.put(
  '/usuarios/:id/roles',
  requireAuth,
  requirePermiso('roles.asignar'),
  [param('id').isInt({ min: 1 }), body('roles').isArray({ min: 1 })],
  validarRequest,
  UsuarioController.asignarRoles,
);

router.get('/roles', requireAuth, requirePermiso('roles.ver'), async (_req, res) => {
  const roles = await listarRoles();
  res.json({ data: roles });
});

router.get('/permisos', requireAuth, requirePermiso('roles.ver'), async (_req, res) => {
  const permisos = await listarPermisos();
  res.json({ data: permisos });
});

module.exports = router;
