const express = require('express');
const { requireAuth, requirePermiso, requireRol } = require('../../../shared/middlewares/auth');
const validarRequest = require('../../../shared/middlewares/validarRequest');
const ClienteController = require('../controllers/cliente.controller');
const {
  validarIdCliente,
  validarCrearCliente,
  validarActualizarCliente,
  validarEliminarClientesMultiples,
} = require('../validators/clienteValidator');

const router = express.Router();

router.use('/clientes', requireAuth);

// ==================== GET ====================
router.get('/clientes', requirePermiso('clientes.index'), ClienteController.index);
router.get(
  '/clientes/:id',
  requirePermiso('clientes.show'),
  validarIdCliente,
  validarRequest,
  ClienteController.show,
);

// ==================== POST ====================
router.post(
  '/clientes',
  requireRol('admin'),
  requirePermiso('clientes.store'),
  validarCrearCliente,
  validarRequest,
  ClienteController.store,
);

router.post(
  '/clientes/bulk-delete',
  requireRol('admin'),
  requirePermiso('clientes.destroy'),
  validarEliminarClientesMultiples,
  validarRequest,
  ClienteController.destroyMany,
);

// ==================== PUT ====================
router.put(
  '/clientes/:id',
  requireRol('admin'),
  requirePermiso('clientes.update'),
  validarActualizarCliente,
  validarRequest,
  ClienteController.update,
);

// ==================== DELETE ====================
router.delete(
  '/clientes/:id',
  requireRol('admin'),
  requirePermiso('clientes.destroy'),
  validarIdCliente,
  validarRequest,
  ClienteController.destroy,
);

module.exports = router;
