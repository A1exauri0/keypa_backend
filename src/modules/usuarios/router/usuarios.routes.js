const express = require("express");
const UsuarioController = require("../controllers/usuario.controller");
const { requireAuth, requirePermiso, requireRol } = require("../../../shared/middlewares/auth.middleware");
const validarRequest = require("../../../shared/middlewares/validar-request.middleware");
const {
  validarCrearUsuario,
  validarAsignarRoles,
  validarActualizarUsuario,
  validarIdUsuario,
  validarAsignarPermisosUsuario,
} = require("../validators/usuarioValidator");

const router = express.Router();

router.use(requireAuth);

// ==================== GET ====================
// Sirve para listar todos los usuarios del sistema.
router.get(
  "/usuarios",
  requirePermiso("usuarios.index"),
  UsuarioController.index,
);

// Sirve para consultar el detalle de un usuario por su ID.
router.get(
  "/usuarios/:id",
  requirePermiso("usuarios.show"),
  validarIdUsuario,
  validarRequest,
  UsuarioController.show,
);

// ==================== POST ====================
// Sirve para crear un nuevo usuario con roles y permisos adicionales opcionales.
router.post(
  "/usuarios",
  requireRol("admin"),
  requirePermiso("usuarios.store"),
  validarCrearUsuario,
  validarRequest,
  UsuarioController.store,
);

// ==================== PUT ====================
// Sirve para actualizar datos basicos del usuario (nombre, correo, activo).
router.put(
  "/usuarios/:id",
  requireRol("admin"),
  requirePermiso("usuarios.update"),
  validarActualizarUsuario,
  validarRequest,
  UsuarioController.update,
);

// Sirve para reemplazar los roles asignados a un usuario.
router.put(
  "/usuarios/:id/roles",
  requireRol("admin"),
  requirePermiso("usuarios.asignar_roles"),
  validarAsignarRoles,
  validarRequest,
  UsuarioController.asignarRoles,
);

// Sirve para reemplazar los permisos directos de un usuario.
router.put(
  "/usuarios/:id/permisos",
  requireRol("admin"),
  requirePermiso("usuarios.asignar_permisos"),
  validarAsignarPermisosUsuario,
  validarRequest,
  UsuarioController.asignarPermisos,
);

// ==================== DELETE ====================
// Sirve para eliminar un usuario del sistema.
router.delete(
  "/usuarios/:id",
  requireRol("admin"),
  requirePermiso("usuarios.destroy"),
  validarIdUsuario,
  validarRequest,
  UsuarioController.destroy,
);

module.exports = router;
