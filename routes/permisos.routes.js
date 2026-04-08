const express = require("express");
const PermisoController = require("../controllers/PermisoController");
const { requireAuth, requirePermiso, requireRol } = require("../middlewares/auth");
const validarRequest = require("../middlewares/validarRequest");
const {
  validarIdPermiso,
  validarCrearPermiso,
  validarActualizarPermiso,
} = require("../validators/permisoValidator");

const router = express.Router();

router.use(requireAuth);

// ==================== GET ====================
// Sirve para listar todos los permisos disponibles.
router.get("/permisos", requirePermiso("permisos.index"), PermisoController.index);

// Sirve para consultar un permiso por su ID.
router.get(
  "/permisos/:id",
  requirePermiso("permisos.show"),
  validarIdPermiso,
  validarRequest,
  PermisoController.show,
);

// ==================== POST ====================
// Sirve para crear un nuevo permiso en el sistema.
router.post(
  "/permisos",
  requireRol("admin"),
  requirePermiso("permisos.store"),
  validarCrearPermiso,
  validarRequest,
  PermisoController.store,
);

// ==================== PUT ====================
// Sirve para actualizar nombre o descripcion de un permiso.
router.put(
  "/permisos/:id",
  requireRol("admin"),
  requirePermiso("permisos.update"),
  validarActualizarPermiso,
  validarRequest,
  PermisoController.update,
);

// ==================== DELETE ====================
// Sirve para eliminar un permiso del sistema.
router.delete(
  "/permisos/:id",
  requireRol("admin"),
  requirePermiso("permisos.destroy"),
  validarIdPermiso,
  validarRequest,
  PermisoController.destroy,
);

module.exports = router;
