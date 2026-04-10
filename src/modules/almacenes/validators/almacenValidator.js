const { body, param } = require('express-validator');

const validarIdAlmacen = [
  param('id').isInt({ min: 1 }).withMessage('ID de almacen invalido'),
];

const validarCrearAlmacen = [
  body('idSucursal')
    .isInt({ min: 1 })
    .withMessage('ID de sucursal invalido'),
  body('nombre')
    .isString()
    .trim()
    .isLength({ min: 2, max: 140 })
    .withMessage('Nombre de almacen invalido'),
  body('activo').optional().isBoolean().withMessage('activo debe ser booleano'),
];

const validarActualizarAlmacen = [
  ...validarIdAlmacen,
  body('idSucursal')
    .optional()
    .isInt({ min: 1 })
    .withMessage('ID de sucursal invalido'),
  body('nombre')
    .optional()
    .isString()
    .trim()
    .isLength({ min: 2, max: 140 })
    .withMessage('Nombre de almacen invalido'),
  body('activo').optional().isBoolean().withMessage('activo debe ser booleano'),
];

const validarEliminarAlmacenesMultiples = [
  body('ids').isArray({ min: 1 }).withMessage('Debes enviar al menos un ID de almacen'),
  body('ids.*').isInt({ min: 1 }).withMessage('Cada ID de almacen debe ser valido'),
];

module.exports = {
  validarIdAlmacen,
  validarCrearAlmacen,
  validarActualizarAlmacen,
  validarEliminarAlmacenesMultiples,
};
