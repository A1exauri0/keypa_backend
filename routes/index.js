const express = require("express");
const authRoutes = require("./auth.routes");
const usuariosRoutes = require("./usuarios.routes");
const rolesRoutes = require("./roles.routes");
const permisosRoutes = require("./permisos.routes");

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
