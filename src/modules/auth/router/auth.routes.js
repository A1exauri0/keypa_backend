const express = require("express");
const UsuarioController = require("../../usuarios/controllers/UsuarioController");
const { requireAuth, requirePermiso } = require("../../../shared/middlewares/auth");
const validarRequest = require("../../../shared/middlewares/validarRequest");
const {
  validarLogin,
  validarRegistroInicial,
  validarForgotPassword,
  validarResetPassword,
} = require("../validators/authValidator");

const router = express.Router();

// ==================== GET ====================
// Sirve para obtener los datos del usuario autenticado.
router.get("/auth/me", requireAuth, UsuarioController.me);

// Sirve para validar sesión activa y cargar informacion inicial del panel.
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
// Sirve para iniciar sesión y generar token JWT.
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

// Sirve para solicitar enlace de recuperacion de contrasena por correo.
router.post(
  '/auth/forgot-password',
  validarForgotPassword,
  validarRequest,
  UsuarioController.forgotPassword,
);

// Sirve para restablecer la contrasena con token valido.
router.post(
  '/auth/reset-password',
  validarResetPassword,
  validarRequest,
  UsuarioController.resetPassword,
);

// Sirve para cerrar sesión del usuario autenticado.
router.post("/auth/logout", requireAuth, UsuarioController.logout);

// ==================== PUT ====================

// ==================== DELETE ====================

module.exports = router;
