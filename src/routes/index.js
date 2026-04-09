const express = require("express");
const authRoutes = require("../modules/auth/router/auth.routes");
const usuariosRoutes = require("../modules/usuarios/router/usuarios.routes");
const rolesRoutes = require("../modules/usuarios/router/roles.routes");
const permisosRoutes = require("../modules/usuarios/router/permisos.routes");

const router = express.Router();

// ==================== GET ====================
// Sirve para validar que el servicio API este en linea.
router.get("/health", (_req, res) => {
  res.json({ ok: true, service: "keypa_backend" });
});

// ==================== POST ====================

// ==================== PUT ====================

// ==================== DELETE ====================

router.use(authRoutes);
router.use(usuariosRoutes);
router.use(rolesRoutes);
router.use(permisosRoutes);

module.exports = router;
