const { body, param } = require('express-validator');

const validarIdSucursal = [
  param('id').isInt({ min: 1 }).withMessage('ID de sucursal invalido'),
];

const validarCrearSucursal = [
  body('nombre')
    .isString()
    .trim()
    .isLength({ min: 2, max: 140 })
    .withMessage('Nombre de sucursal invalido'),
  body('telefono')
    .isString()
    .trim()
    .isLength({ min: 8, max: 20 })
    .withMessage('Telefono invalido'),
  body('email')
    .optional({ nullable: true })
    .isEmail()
    .withMessage('Email invalido')
    .normalizeEmail(),
  body('encargado')
    .optional({ nullable: true })
    .isString()
    .trim()
    .isLength({ min: 2, max: 140 })
    .withMessage('Encargado invalido'),
  body('direccion')
    .isString()
    .trim()
    .isLength({ min: 2, max: 255 })
    .withMessage('Direccion invalida'),
  body('numeroExterior')
    .optional({ nullable: true })
    .isString()
    .trim()
    .isLength({ min: 1, max: 20 })
    .withMessage('Numero exterior invalido'),
  body('numeroInterior')
    .optional({ nullable: true })
    .isString()
    .trim()
    .isLength({ min: 1, max: 20 })
    .withMessage('Numero interior invalido'),
  body('referencias')
    .optional({ nullable: true })
    .isString()
    .trim()
    .isLength({ min: 2, max: 255 })
    .withMessage('Referencias invalidas'),
  body('codigoPostal')
    .optional({ nullable: true })
    .isString()
    .trim()
    .matches(/^\d{5}$/)
    .withMessage('Codigo postal invalido'),
  body('idCiudad')
    .optional({ nullable: true })
    .isInt({ min: 1 })
    .withMessage('ID de ciudad invalido'),
  body('idColonia')
    .optional({ nullable: true })
    .isInt({ min: 1 })
    .withMessage('ID de colonia invalido'),
  body('activo').optional().isBoolean().withMessage('activo debe ser booleano'),
];

const validarActualizarSucursal = [
  ...validarIdSucursal,
  body('nombre')
    .optional()
    .isString()
    .trim()
    .isLength({ min: 2, max: 140 })
    .withMessage('Nombre de sucursal invalido'),
  body('telefono')
    .optional()
    .isString()
    .trim()
    .isLength({ min: 8, max: 20 })
    .withMessage('Telefono invalido'),
  body('email')
    .optional({ nullable: true })
    .isEmail()
    .withMessage('Email invalido')
    .normalizeEmail(),
  body('encargado')
    .optional({ nullable: true })
    .isString()
    .trim()
    .isLength({ min: 2, max: 140 })
    .withMessage('Encargado invalido'),
  body('direccion')
    .optional()
    .isString()
    .trim()
    .isLength({ min: 2, max: 255 })
    .withMessage('Direccion invalida'),
  body('numeroExterior')
    .optional({ nullable: true })
    .isString()
    .trim()
    .isLength({ min: 1, max: 20 })
    .withMessage('Numero exterior invalido'),
  body('numeroInterior')
    .optional({ nullable: true })
    .isString()
    .trim()
    .isLength({ min: 1, max: 20 })
    .withMessage('Numero interior invalido'),
  body('referencias')
    .optional({ nullable: true })
    .isString()
    .trim()
    .isLength({ min: 2, max: 255 })
    .withMessage('Referencias invalidas'),
  body('codigoPostal')
    .optional({ nullable: true })
    .isString()
    .trim()
    .matches(/^\d{5}$/)
    .withMessage('Codigo postal invalido'),
  body('idCiudad')
    .optional({ nullable: true })
    .isInt({ min: 1 })
    .withMessage('ID de ciudad invalido'),
  body('idColonia')
    .optional({ nullable: true })
    .isInt({ min: 1 })
    .withMessage('ID de colonia invalido'),
  body('activo').optional().isBoolean().withMessage('activo debe ser booleano'),
];

const validarEliminarSucursalesMultiples = [
  body('ids').isArray({ min: 1 }).withMessage('Debes enviar al menos un ID de sucursal'),
  body('ids.*').isInt({ min: 1 }).withMessage('Cada ID de sucursal debe ser valido'),
];

module.exports = {
  validarIdSucursal,
  validarCrearSucursal,
  validarActualizarSucursal,
  validarEliminarSucursalesMultiples,
};
