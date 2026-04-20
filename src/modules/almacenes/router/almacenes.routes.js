const express = require('express');
const { requireAuth, requirePermiso, requireRol } = require('../../../shared/middlewares/auth.middleware');
const validarRequest = require('../../../shared/middlewares/validar-request.middleware');
const AlmacenController = require('../controllers/almacen.controller');
const {
  validarIdAlmacen,
  validarCrearAlmacen,
  validarActualizarAlmacen,
  validarEliminarAlmacenesMultiples,
} = require('../validators/almacenValidator');

const router = express.Router();

router.use('/almacenes', requireAuth);

router.get('/almacenes', requirePermiso('almacenes.index'), AlmacenController.index);
router.get(
  '/almacenes/:id',
  requirePermiso('almacenes.show'),
  validarIdAlmacen,
  validarRequest,
  AlmacenController.show,
);

router.post(
  '/almacenes',
  requireRol('admin'),
  requirePermiso('almacenes.store'),
  validarCrearAlmacen,
  validarRequest,
  AlmacenController.store,
);

router.post(
  '/almacenes/bulk-delete',
  requireRol('admin'),
  requirePermiso('almacenes.destroy'),
  validarEliminarAlmacenesMultiples,
  validarRequest,
  AlmacenController.destroyMany,
);

router.put(
  '/almacenes/:id',
  requireRol('admin'),
  requirePermiso('almacenes.update'),
  validarActualizarAlmacen,
  validarRequest,
  AlmacenController.update,
);

router.delete(
  '/almacenes/:id',
  requireRol('admin'),
  requirePermiso('almacenes.destroy'),
  validarIdAlmacen,
  validarRequest,
  AlmacenController.destroy,
);

module.exports = router;
