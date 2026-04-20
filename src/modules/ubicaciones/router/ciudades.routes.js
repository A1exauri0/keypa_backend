const express = require('express');
const { requireAuth, requirePermiso, requireRol } = require('../../../shared/middlewares/auth.middleware');
const validarRequest = require('../../../shared/middlewares/validar-request.middleware');
const CiudadController = require('../controllers/ciudad.controller');
const {
  validarIdCiudad,
  validarCrearCiudad,
  validarActualizarCiudad,
  validarEliminarCiudadesMultiples,
} = require('../validators/ciudadValidator');

const router = express.Router();

router.use('/ciudades', requireAuth);

// ==================== GET ====================
router.get('/ciudades', requirePermiso('ciudades.index'), CiudadController.index);
router.get(
  '/ciudades/:id',
  requirePermiso('ciudades.show'),
  validarIdCiudad,
  validarRequest,
  CiudadController.show,
);

// ==================== POST ====================
router.post(
  '/ciudades',
  requireRol('admin'),
  requirePermiso('ciudades.store'),
  validarCrearCiudad,
  validarRequest,
  CiudadController.store,
);

router.post(
  '/ciudades/bulk-delete',
  requireRol('admin'),
  requirePermiso('ciudades.destroy'),
  validarEliminarCiudadesMultiples,
  validarRequest,
  CiudadController.destroyMany,
);

// ==================== PUT ====================
router.put(
  '/ciudades/:id',
  requireRol('admin'),
  requirePermiso('ciudades.update'),
  validarActualizarCiudad,
  validarRequest,
  CiudadController.update,
);

// ==================== DELETE ====================
router.delete(
  '/ciudades/:id',
  requireRol('admin'),
  requirePermiso('ciudades.destroy'),
  validarIdCiudad,
  validarRequest,
  CiudadController.destroy,
);

module.exports = router;
