const { body, param } = require('express-validator');

const validarIdProveedor = [
  param('id').isInt({ min: 1 }).withMessage('ID de proveedor invalido'),
];

const validarCrearProveedor = [
  body('nombre')
    .isString()
    .trim()
    .isLength({ min: 2, max: 160 })
    .withMessage('Nombre de proveedor invalido'),
  body('contactoNombre')
    .optional({ nullable: true })
    .isString()
    .trim()
    .isLength({ min: 2, max: 140 })
    .withMessage('Nombre de contacto invalido'),
  body('telefono')
    .optional({ nullable: true })
    .isString()
    .trim()
    .isLength({ min: 8, max: 20 })
    .withMessage('Telefono invalido'),
  body('email')
    .optional({ nullable: true })
    .isEmail()
    .withMessage('Email invalido')
    .normalizeEmail(),
  body('direccion')
    .optional({ nullable: true })
    .isString()
    .trim()
    .isLength({ min: 2, max: 255 })
    .withMessage('Direccion invalida'),
  body('activo').optional().isBoolean().withMessage('activo debe ser booleano'),
];

const validarActualizarProveedor = [
  ...validarIdProveedor,
  body('nombre')
    .optional()
    .isString()
    .trim()
    .isLength({ min: 2, max: 160 })
    .withMessage('Nombre de proveedor invalido'),
  body('contactoNombre')
    .optional({ nullable: true })
    .isString()
    .trim()
    .isLength({ min: 2, max: 140 })
    .withMessage('Nombre de contacto invalido'),
  body('telefono')
    .optional({ nullable: true })
    .isString()
    .trim()
    .isLength({ min: 8, max: 20 })
    .withMessage('Telefono invalido'),
  body('email')
    .optional({ nullable: true })
    .isEmail()
    .withMessage('Email invalido')
    .normalizeEmail(),
  body('direccion')
    .optional({ nullable: true })
    .isString()
    .trim()
    .isLength({ min: 2, max: 255 })
    .withMessage('Direccion invalida'),
  body('activo').optional().isBoolean().withMessage('activo debe ser booleano'),
];

const validarEliminarProveedoresMultiples = [
  body('ids').isArray({ min: 1 }).withMessage('Debes enviar al menos un ID de proveedor'),
  body('ids.*').isInt({ min: 1 }).withMessage('Cada ID de proveedor debe ser valido'),
];

module.exports = {
  validarIdProveedor,
  validarCrearProveedor,
  validarActualizarProveedor,
  validarEliminarProveedoresMultiples,
};
