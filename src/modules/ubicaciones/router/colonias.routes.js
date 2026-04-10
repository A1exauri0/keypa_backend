const express = require('express');
const { requireAuth, requirePermiso, requireRol } = require('../../../shared/middlewares/auth');
const validarRequest = require('../../../shared/middlewares/validarRequest');
const ColoniaController = require('../controllers/ColoniaController');
const {
  validarIdColonia,
  validarFiltroColonias,
  validarCrearColonia,
  validarActualizarColonia,
  validarEliminarColoniasMultiples,
} = require('../validators/coloniaValidator');

const router = express.Router();

router.use('/colonias', requireAuth);

// ==================== GET ====================
router.get('/colonias', requirePermiso('colonias.index'), validarFiltroColonias, validarRequest, ColoniaController.index);
router.get(
  '/colonias/:id',
  requirePermiso('colonias.show'),
  validarIdColonia,
  validarRequest,
  ColoniaController.show,
);

// ==================== POST ====================
router.post(
  '/colonias',
  requireRol('admin'),
  requirePermiso('colonias.store'),
  validarCrearColonia,
  validarRequest,
  ColoniaController.store,
);

router.post(
  '/colonias/bulk-delete',
  requireRol('admin'),
  requirePermiso('colonias.destroy'),
  validarEliminarColoniasMultiples,
  validarRequest,
  ColoniaController.destroyMany,
);

// ==================== PUT ====================
router.put(
  '/colonias/:id',
  requireRol('admin'),
  requirePermiso('colonias.update'),
  validarActualizarColonia,
  validarRequest,
  ColoniaController.update,
);

// ==================== DELETE ====================
router.delete(
  '/colonias/:id',
  requireRol('admin'),
  requirePermiso('colonias.destroy'),
  validarIdColonia,
  validarRequest,
  ColoniaController.destroy,
);

module.exports = router;
