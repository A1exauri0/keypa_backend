const express = require('express');
const { requireAuth, requirePermiso, requireRol } = require('../../../shared/middlewares/auth');
const validarRequest = require('../../../shared/middlewares/validarRequest');
const MarcaController = require('../controllers/marca.controller');
const {
  validarIdMarca,
  validarCrearMarca,
  validarActualizarMarca,
  validarEliminarMarcasMultiples,
} = require('../validators/marcaValidator');

const router = express.Router();

router.use('/marcas', requireAuth);

// ==================== GET ====================
router.get('/marcas', requirePermiso('marcas.index'), MarcaController.index);
router.get(
  '/marcas/:id',
  requirePermiso('marcas.show'),
  validarIdMarca,
  validarRequest,
  MarcaController.show,
);

// ==================== POST ====================
router.post(
  '/marcas',
  requireRol('admin'),
  requirePermiso('marcas.store'),
  validarCrearMarca,
  validarRequest,
  MarcaController.store,
);

router.post(
  '/marcas/bulk-delete',
  requireRol('admin'),
  requirePermiso('marcas.destroy'),
  validarEliminarMarcasMultiples,
  validarRequest,
  MarcaController.destroyMany,
);

// ==================== PUT ====================
router.put(
  '/marcas/:id',
  requireRol('admin'),
  requirePermiso('marcas.update'),
  validarActualizarMarca,
  validarRequest,
  MarcaController.update,
);

// ==================== DELETE ====================
router.delete(
  '/marcas/:id',
  requireRol('admin'),
  requirePermiso('marcas.destroy'),
  validarIdMarca,
  validarRequest,
  MarcaController.destroy,
);

module.exports = router;
