const express = require('express');
const { requireAuth, requirePermiso, requireRol } = require('../../../shared/middlewares/auth');
const validarRequest = require('../../../shared/middlewares/validarRequest');
const SucursalController = require('../controllers/sucursal.controller');
const {
  validarIdSucursal,
  validarCrearSucursal,
  validarActualizarSucursal,
  validarEliminarSucursalesMultiples,
} = require('../validators/sucursalValidator');

const router = express.Router();

router.use('/sucursales', requireAuth);

router.get('/sucursales', requirePermiso('sucursales.index'), SucursalController.index);
router.get(
  '/sucursales/:id',
  requirePermiso('sucursales.show'),
  validarIdSucursal,
  validarRequest,
  SucursalController.show,
);

router.post(
  '/sucursales',
  requireRol('admin'),
  requirePermiso('sucursales.store'),
  validarCrearSucursal,
  validarRequest,
  SucursalController.store,
);

router.post(
  '/sucursales/bulk-delete',
  requireRol('admin'),
  requirePermiso('sucursales.destroy'),
  validarEliminarSucursalesMultiples,
  validarRequest,
  SucursalController.destroyMany,
);

router.put(
  '/sucursales/:id',
  requireRol('admin'),
  requirePermiso('sucursales.update'),
  validarActualizarSucursal,
  validarRequest,
  SucursalController.update,
);

router.delete(
  '/sucursales/:id',
  requireRol('admin'),
  requirePermiso('sucursales.destroy'),
  validarIdSucursal,
  validarRequest,
  SucursalController.destroy,
);

module.exports = router;
