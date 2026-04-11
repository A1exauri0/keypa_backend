const { body, param } = require('express-validator');

const validarIdInventario = [
  param('id').isInt({ min: 1 }).withMessage('ID de inventario invalido'),
];

const validarCrearInventario = [
  body('idAlmacen').isInt({ min: 1 }).withMessage('ID de almacen invalido'),
  body('idProducto').isInt({ min: 1 }).withMessage('ID de producto invalido'),
  body('stockActual').isInt({ min: 0 }).withMessage('stockActual debe ser un entero >= 0'),
];

const validarActualizarInventario = [
  ...validarIdInventario,
  body('idAlmacen').optional().isInt({ min: 1 }).withMessage('ID de almacen invalido'),
  body('idProducto').optional().isInt({ min: 1 }).withMessage('ID de producto invalido'),
  body('stockActual').optional().isInt({ min: 0 }).withMessage('stockActual debe ser un entero >= 0'),
];

const validarEliminarInventariosMultiples = [
  body('ids').isArray({ min: 1 }).withMessage('Debes enviar al menos un ID de inventario'),
  body('ids.*').isInt({ min: 1 }).withMessage('Cada ID de inventario debe ser valido'),
];

module.exports = {
  validarIdInventario,
  validarCrearInventario,
  validarActualizarInventario,
  validarEliminarInventariosMultiples,
};
