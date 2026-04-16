const express = require('express');
const { requireAuth, requirePermiso, requireRol } = require('../../../shared/middlewares/auth');
const validarRequest = require('../../../shared/middlewares/validarRequest');
const CompraController = require('../controllers/CompraController');
const {
  validarIdCompra,
  validarCrearCompra,
  validarActualizarEstadoCompra,
} = require('../validators/compraValidator');

const router = express.Router();

router.use('/compras', requireAuth);

// ==================== GET ====================
router.get('/compras', requirePermiso('compras.index'), CompraController.index);
router.get(
  '/compras/:id',
  requirePermiso('compras.show'),
  validarIdCompra,
  validarRequest,
  CompraController.show,
);

// ==================== POST ====================
router.post(
  '/compras',
  requireRol('admin'),
  requirePermiso('compras.store'),
  validarCrearCompra,
  validarRequest,
  CompraController.store,
);

// ==================== PATCH ====================
router.patch(
  '/compras/:id/estado',
  requireRol('admin'),
  requirePermiso('compras.update'),
  validarActualizarEstadoCompra,
  validarRequest,
  CompraController.actualizarEstado,
);

module.exports = router;
