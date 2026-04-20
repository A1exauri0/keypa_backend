const express = require('express');
const { requireAuth, requirePermiso, requireRol } = require('../../../shared/middlewares/auth.middleware');
const validarRequest = require('../../../shared/middlewares/validar-request.middleware');
const ProveedorController = require('../controllers/proveedor.controller');
const {
  validarIdProveedor,
  validarCrearProveedor,
  validarActualizarProveedor,
  validarEliminarProveedoresMultiples,
} = require('../validators/proveedorValidator');

const router = express.Router();

router.use('/proveedores', requireAuth);

// ==================== GET ====================
router.get('/proveedores', requirePermiso('proveedores.index'), ProveedorController.index);
router.get(
  '/proveedores/:id',
  requirePermiso('proveedores.show'),
  validarIdProveedor,
  validarRequest,
  ProveedorController.show,
);

// ==================== POST ====================
router.post(
  '/proveedores',
  requireRol('admin'),
  requirePermiso('proveedores.store'),
  validarCrearProveedor,
  validarRequest,
  ProveedorController.store,
);

router.post(
  '/proveedores/bulk-delete',
  requireRol('admin'),
  requirePermiso('proveedores.destroy'),
  validarEliminarProveedoresMultiples,
  validarRequest,
  ProveedorController.destroyMany,
);

// ==================== PUT ====================
router.put(
  '/proveedores/:id',
  requireRol('admin'),
  requirePermiso('proveedores.update'),
  validarActualizarProveedor,
  validarRequest,
  ProveedorController.update,
);

// ==================== DELETE ====================
router.delete(
  '/proveedores/:id',
  requireRol('admin'),
  requirePermiso('proveedores.destroy'),
  validarIdProveedor,
  validarRequest,
  ProveedorController.destroy,
);

module.exports = router;
