const express = require('express');
const { requireAuth, requirePermiso, requireRol } = require('../../../shared/middlewares/auth');
const validarRequest = require('../../../shared/middlewares/validarRequest');
const ProductoController = require('../controllers/ProductoController');
const {
  validarIdProducto,
  validarCrearProducto,
  validarActualizarProducto,
  validarFiltrosProductos,
  validarEliminarProductosMultiples,
} = require('../validators/productoValidator');
const { uploadProductoImage } = require('../middlewares/uploadProductoImage');

const router = express.Router();

router.use('/productos', requireAuth);

// ==================== GET ====================
router.get(
  '/productos',
  requirePermiso('productos.index'),
  validarFiltrosProductos,
  validarRequest,
  ProductoController.index,
);
router.get(
  '/productos/:id',
  requirePermiso('productos.show'),
  validarIdProducto,
  validarRequest,
  ProductoController.show,
);

// ==================== POST ====================
router.post(
  '/productos/upload-image',
  requireRol('admin'),
  requirePermiso('productos.store'),
  uploadProductoImage.single('image'),
  ProductoController.uploadImage,
);

router.post(
  '/productos',
  requireRol('admin'),
  requirePermiso('productos.store'),
  validarCrearProducto,
  validarRequest,
  ProductoController.store,
);

router.post(
  '/productos/bulk-delete',
  requireRol('admin'),
  requirePermiso('productos.destroy'),
  validarEliminarProductosMultiples,
  validarRequest,
  ProductoController.destroyMany,
);

// ==================== PUT ====================
router.put(
  '/productos/:id',
  requireRol('admin'),
  requirePermiso('productos.update'),
  validarActualizarProducto,
  validarRequest,
  ProductoController.update,
);

// ==================== DELETE ====================
router.delete(
  '/productos/:id',
  requireRol('admin'),
  requirePermiso('productos.destroy'),
  validarIdProducto,
  validarRequest,
  ProductoController.destroy,
);

module.exports = router;
