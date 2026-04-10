const { body, param } = require('express-validator');

const validarIdCiudad = [
  param('id').isInt({ min: 1 }).withMessage('ID de ciudad invalido'),
];

const validarCrearCiudad = [
  body('nombre')
    .isString()
    .trim()
    .isLength({ min: 2, max: 140 })
    .withMessage('Nombre de ciudad invalido'),
  body('estado')
    .optional()
    .isString()
    .trim()
    .isLength({ min: 2, max: 80 })
    .withMessage('Estado invalido'),
  body('activo').optional().isBoolean().withMessage('activo debe ser booleano'),
];

const validarActualizarCiudad = [
  ...validarIdCiudad,
  body('nombre')
    .optional()
    .isString()
    .trim()
    .isLength({ min: 2, max: 140 })
    .withMessage('Nombre de ciudad invalido'),
  body('estado')
    .optional()
    .isString()
    .trim()
    .isLength({ min: 2, max: 80 })
    .withMessage('Estado invalido'),
  body('activo').optional().isBoolean().withMessage('activo debe ser booleano'),
];

const validarEliminarCiudadesMultiples = [
  body('ids').isArray({ min: 1 }).withMessage('Debes enviar al menos un ID de ciudad'),
  body('ids.*').isInt({ min: 1 }).withMessage('Cada ID de ciudad debe ser valido'),
];

module.exports = {
  validarIdCiudad,
  validarCrearCiudad,
  validarActualizarCiudad,
  validarEliminarCiudadesMultiples,
};
