const express = require('express');
const { requireAuth, requirePermiso, requireRol } = require('../../../shared/middlewares/auth');
const validarRequest = require('../../../shared/middlewares/validarRequest');
const CategoriaController = require('../controllers/CategoriaController');
const {
  validarIdCategoria,
  validarCrearCategoria,
  validarActualizarCategoria,
  validarEliminarCategoriasMultiples,
} = require('../validators/categoriaValidator');

const router = express.Router();

router.use('/categorias', requireAuth);

// ==================== GET ====================
router.get('/categorias', requirePermiso('categorias.index'), CategoriaController.index);
router.get(
  '/categorias/:id',
  requirePermiso('categorias.show'),
  validarIdCategoria,
  validarRequest,
  CategoriaController.show,
);

// ==================== POST ====================
router.post(
  '/categorias',
  requireRol('admin'),
  requirePermiso('categorias.store'),
  validarCrearCategoria,
  validarRequest,
  CategoriaController.store,
);

router.post(
  '/categorias/bulk-delete',
  requireRol('admin'),
  requirePermiso('categorias.destroy'),
  validarEliminarCategoriasMultiples,
  validarRequest,
  CategoriaController.destroyMany,
);

// ==================== PUT ====================
router.put(
  '/categorias/:id',
  requireRol('admin'),
  requirePermiso('categorias.update'),
  validarActualizarCategoria,
  validarRequest,
  CategoriaController.update,
);

// ==================== DELETE ====================
router.delete(
  '/categorias/:id',
  requireRol('admin'),
  requirePermiso('categorias.destroy'),
  validarIdCategoria,
  validarRequest,
  CategoriaController.destroy,
);

module.exports = router;
