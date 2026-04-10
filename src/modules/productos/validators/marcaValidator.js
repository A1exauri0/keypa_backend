const { body, param } = require('express-validator');

const validarIdMarca = [
  param('id').isInt({ min: 1 }).withMessage('ID de marca invalido'),
];

const validarCrearMarca = [
  body('nombre')
    .isString()
    .trim()
    .isLength({ min: 2, max: 120 })
    .withMessage('Nombre de marca invalido'),
  body('slug')
    .isString()
    .trim()
    .isLength({ min: 2, max: 140 })
    .withMessage('Slug de marca invalido'),
  body('descripcion')
    .optional({ nullable: true })
    .isString()
    .trim()
    .isLength({ min: 2, max: 255 })
    .withMessage('Descripcion de marca invalida'),
  body('activo').optional().isBoolean().withMessage('activo debe ser booleano'),
];

const validarActualizarMarca = [
  ...validarIdMarca,
  body('nombre')
    .optional()
    .isString()
    .trim()
    .isLength({ min: 2, max: 120 })
    .withMessage('Nombre de marca invalido'),
  body('slug')
    .optional()
    .isString()
    .trim()
    .isLength({ min: 2, max: 140 })
    .withMessage('Slug de marca invalido'),
  body('descripcion')
    .optional({ nullable: true })
    .isString()
    .trim()
    .isLength({ min: 2, max: 255 })
    .withMessage('Descripcion de marca invalida'),
  body('activo').optional().isBoolean().withMessage('activo debe ser booleano'),
];

const validarEliminarMarcasMultiples = [
  body('ids').isArray({ min: 1 }).withMessage('Debes enviar al menos un ID de marca'),
  body('ids.*').isInt({ min: 1 }).withMessage('Cada ID de marca debe ser valido'),
];

module.exports = {
  validarIdMarca,
  validarCrearMarca,
  validarActualizarMarca,
  validarEliminarMarcasMultiples,
};
