const { body, param } = require('express-validator');

const validarIdCategoria = [
  param('id').isInt({ min: 1 }).withMessage('ID de categoria invalido'),
];

const validarCrearCategoria = [
  body('nombre')
    .isString()
    .trim()
    .isLength({ min: 2, max: 120 })
    .withMessage('Nombre de categoria invalido'),
  body('slug')
    .isString()
    .trim()
    .isLength({ min: 2, max: 140 })
    .withMessage('Slug de categoria invalido'),
  body('descripcion')
    .optional({ nullable: true })
    .isString()
    .trim()
    .isLength({ min: 2, max: 255 })
    .withMessage('Descripcion de categoria invalida'),
  body('activo').optional().isBoolean().withMessage('activo debe ser booleano'),
];

const validarActualizarCategoria = [
  ...validarIdCategoria,
  body('nombre')
    .optional()
    .isString()
    .trim()
    .isLength({ min: 2, max: 120 })
    .withMessage('Nombre de categoria invalido'),
  body('slug')
    .optional()
    .isString()
    .trim()
    .isLength({ min: 2, max: 140 })
    .withMessage('Slug de categoria invalido'),
  body('descripcion')
    .optional({ nullable: true })
    .isString()
    .trim()
    .isLength({ min: 2, max: 255 })
    .withMessage('Descripcion de categoria invalida'),
  body('activo').optional().isBoolean().withMessage('activo debe ser booleano'),
];

const validarEliminarCategoriasMultiples = [
  body('ids').isArray({ min: 1 }).withMessage('Debes enviar al menos un ID de categoria'),
  body('ids.*').isInt({ min: 1 }).withMessage('Cada ID de categoria debe ser valido'),
];

module.exports = {
  validarIdCategoria,
  validarCrearCategoria,
  validarActualizarCategoria,
  validarEliminarCategoriasMultiples,
};
