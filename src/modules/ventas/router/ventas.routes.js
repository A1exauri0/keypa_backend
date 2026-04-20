const express = require('express');
const { requireAuth, requirePermiso, requireRol } = require('../../../shared/middlewares/auth.middleware');
const validarRequest = require('../../../shared/middlewares/validar-request.middleware');
const VentaController = require('../controllers/venta.controller');
const {
  validarIdVenta,
  validarCrearVenta,
  validarActualizarEstadoVenta,
  validarCatalogoInventarioVenta,
} = require('../validators/ventaValidator');

const router = express.Router();

router.use('/ventas', requireAuth);

// ==================== GET ====================
router.get('/ventas', requirePermiso('ventas.index'), VentaController.index);
router.get(
  '/ventas/catalogo-inventario',
  requirePermiso('ventas.index'),
  validarCatalogoInventarioVenta,
  validarRequest,
  VentaController.catalogoInventario,
);
router.get(
  '/ventas/:id',
  requirePermiso('ventas.show'),
  validarIdVenta,
  validarRequest,
  VentaController.show,
);

// ==================== POST ====================
router.post(
  '/ventas',
  requireRol(['admin', 'vendedor']),
  requirePermiso('ventas.store'),
  validarCrearVenta,
  validarRequest,
  VentaController.store,
);

// ==================== PATCH ====================
router.patch(
  '/ventas/:id/estado',
  requireRol('admin'),
  requirePermiso('ventas.update'),
  validarActualizarEstadoVenta,
  validarRequest,
  VentaController.actualizarEstado,
);

module.exports = router;
