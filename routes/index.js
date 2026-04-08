const express = require("express");
const authRoutes = require("./auth.router");
const usuariosRoutes = require("./usuarios.router");
const rolesRoutes = require("./roles.router");
const permisosRoutes = require("./permisos.router");

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
