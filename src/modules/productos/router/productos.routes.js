const express = require('express');
const { requireAuth, requirePermiso, requireRol } = require('../../../shared/middlewares/auth.middleware');
const validarRequest = require('../../../shared/middlewares/validar-request.middleware');
const ProductoController = require('../controllers/producto.controller');
const {
  validarIdProducto,
  validarCrearProducto,
  validarActualizarProducto,
  validarFiltrosProductos,
  validarEliminarProductosMultiples,
} = require('../validators/productoValidator');
const { crearImageUpload } = require('../../../shared/middlewares/upload-image.middleware');

const router = express.Router();
const uploadProductoImage = crearImageUpload({ folder: 'productos', prefix: 'producto', maxSizeMb: 5 });

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
