const express = require("express");
const UsuarioController = require("../../usuarios/controllers/UsuarioController");
const { requireAuth, requirePermiso } = require("../../../shared/middlewares/auth");
const validarRequest = require("../../../shared/middlewares/validarRequest");
const {
  validarLogin,
  validarRegistroInicial,
} = require("../validators/authValidator");

const router = express.Router();

// ==================== GET ====================
// Sirve para obtener los datos del usuario autenticado.
router.get("/auth/me", requireAuth, UsuarioController.me);

// Sirve para validar sesion activa y cargar informacion inicial del panel.
router.get(
  "/inicio",
  requireAuth,
  requirePermiso("panel.ver"),
  (req, res) => {
    res.json({
      message: "Logueado correctamente",
      nombre: req.user.nombre,
    });
  },
);

// ==================== POST ====================
// Sirve para iniciar sesion y generar token JWT.
router.post(
  "/auth/login",
  validarLogin,
  validarRequest,
  UsuarioController.login,
);

// Sirve para registrar el primer usuario del sistema.
router.post(
  "/auth/register",
  validarRegistroInicial,
  validarRequest,
  UsuarioController.registerInicial,
);

// Sirve para cerrar sesion del usuario autenticado.
router.post("/auth/logout", requireAuth, UsuarioController.logout);

// ==================== PUT ====================

// ==================== DELETE ====================

module.exports = router;
