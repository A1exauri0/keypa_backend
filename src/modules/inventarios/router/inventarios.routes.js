const express = require('express');
const { requireAuth, requirePermiso, requireRol } = require('../../../shared/middlewares/auth.middleware');
const validarRequest = require('../../../shared/middlewares/validar-request.middleware');
const InventarioController = require('../controllers/inventario.controller');
const {
  validarIdInventario,
  validarCrearInventario,
  validarActualizarInventario,
  validarEliminarInventariosMultiples,
} = require('../validators/inventarioValidator');

const router = express.Router();

router.use('/inventarios', requireAuth);

router.get('/inventarios', requirePermiso('inventarios.index'), InventarioController.index);
router.get(
  '/inventarios/:id',
  requirePermiso('inventarios.show'),
  validarIdInventario,
  validarRequest,
  InventarioController.show,
);

router.post(
  '/inventarios',
  requireRol('admin'),
  requirePermiso('inventarios.store'),
  validarCrearInventario,
  validarRequest,
  InventarioController.store,
);

router.post(
  '/inventarios/bulk-delete',
  requireRol('admin'),
  requirePermiso('inventarios.destroy'),
  validarEliminarInventariosMultiples,
  validarRequest,
  InventarioController.destroyMany,
);

router.put(
  '/inventarios/:id',
  requireRol('admin'),
  requirePermiso('inventarios.update'),
  validarActualizarInventario,
  validarRequest,
  InventarioController.update,
);

router.delete(
  '/inventarios/:id',
  requireRol('admin'),
  requirePermiso('inventarios.destroy'),
  validarIdInventario,
  validarRequest,
  InventarioController.destroy,
);

module.exports = router;
