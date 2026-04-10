const { body, param, query } = require('express-validator');

const validarIdColonia = [
  param('id').isInt({ min: 1 }).withMessage('ID de colonia invalido'),
];

const validarFiltroColonias = [
  query('idCiudad')
    .optional()
    .isInt({ min: 1 })
    .withMessage('idCiudad en query debe ser un entero valido'),
];

const validarCrearColonia = [
  body('nombre')
    .isString()
    .trim()
    .isLength({ min: 2, max: 160 })
    .withMessage('Nombre de colonia invalido'),
  body('codigoPostal')
    .isString()
    .trim()
    .matches(/^\d{5}$/)
    .withMessage('Codigo postal invalido'),
  body('idCiudad').isInt({ min: 1 }).withMessage('ID de ciudad invalido'),
  body('activo').optional().isBoolean().withMessage('activo debe ser booleano'),
];

const validarActualizarColonia = [
  ...validarIdColonia,
  body('nombre')
    .optional()
    .isString()
    .trim()
    .isLength({ min: 2, max: 160 })
    .withMessage('Nombre de colonia invalido'),
  body('codigoPostal')
    .optional()
    .isString()
    .trim()
    .matches(/^\d{5}$/)
    .withMessage('Codigo postal invalido'),
  body('idCiudad').optional().isInt({ min: 1 }).withMessage('ID de ciudad invalido'),
  body('activo').optional().isBoolean().withMessage('activo debe ser booleano'),
];

const validarEliminarColoniasMultiples = [
  body('ids').isArray({ min: 1 }).withMessage('Debes enviar al menos un ID de colonia'),
  body('ids.*').isInt({ min: 1 }).withMessage('Cada ID de colonia debe ser valido'),
];

module.exports = {
  validarIdColonia,
  validarFiltroColonias,
  validarCrearColonia,
  validarActualizarColonia,
  validarEliminarColoniasMultiples,
};
