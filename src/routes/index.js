const express = require("express");
const authRoutes = require("../modules/auth/router/auth.routes");
const usuariosRoutes = require("../modules/usuarios/router/usuarios.routes");
const rolesRoutes = require("../modules/usuarios/router/roles.routes");
const permisosRoutes = require("../modules/usuarios/router/permisos.routes");
const marcasRoutes = require("../modules/productos/router/marcas.routes");
const categoriasRoutes = require("../modules/productos/router/categorias.routes");
const productosRoutes = require("../modules/productos/router/productos.routes");
const ciudadesRoutes = require('../modules/ubicaciones/router/ciudades.routes');
const coloniasRoutes = require('../modules/ubicaciones/router/colonias.routes');
const clientesRoutes = require('../modules/clientes/router/clientes.routes');
const sucursalesRoutes = require('../modules/sucursales/router/sucursales.routes');
const almacenesRoutes = require('../modules/almacenes/router/almacenes.routes');

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
router.use(marcasRoutes);
router.use(categoriasRoutes);
router.use(productosRoutes);
router.use(ciudadesRoutes);
router.use(coloniasRoutes);
router.use(clientesRoutes);
router.use(sucursalesRoutes);
router.use(almacenesRoutes);

module.exports = router;
