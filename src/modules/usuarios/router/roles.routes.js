const express = require("express");
const RolController = require("../controllers/rol.controller");
const { requireAuth, requirePermiso, requireRol } = require("../../../shared/middlewares/auth");
const validarRequest = require("../../../shared/middlewares/validarRequest");
const {
  validarIdRol,
  validarCrearRol,
  validarActualizarRol,
  validarAsignarPermisosRol,
} = require("../validators/rolValidator");

const router = express.Router();

router.use(requireAuth);

// ==================== GET ====================
// Sirve para listar todos los roles con sus permisos.
router.get("/roles", requirePermiso("roles.index"), RolController.index);

// Sirve para consultar un rol por su ID.
router.get(
  "/roles/:id",
  requirePermiso("roles.show"),
  validarIdRol,
  validarRequest,
  RolController.show,
);

// ==================== POST ====================
// Sirve para crear un nuevo rol y opcionalmente asignarle permisos.
router.post(
  "/roles",
  requireRol("admin"),
  requirePermiso("roles.store"),
  validarCrearRol,
  validarRequest,
  RolController.store,
);

// ==================== PUT ====================
// Sirve para actualizar nombre y descripcion de un rol.
router.put(
  "/roles/:id",
  requireRol("admin"),
  requirePermiso("roles.update"),
  validarActualizarRol,
  validarRequest,
  RolController.update,
);

// Sirve para reemplazar permisos asignados al rol.
router.put(
  "/roles/:id/permisos",
  requireRol("admin"),
  requirePermiso("roles.asignar_permisos"),
  validarAsignarPermisosRol,
  validarRequest,
  RolController.asignarPermisos,
);

// ==================== DELETE ====================
// Sirve para eliminar un rol del sistema.
router.delete(
  "/roles/:id",
  requireRol("admin"),
  requirePermiso("roles.destroy"),
  validarIdRol,
  validarRequest,
  RolController.destroy,
);

module.exports = router;
