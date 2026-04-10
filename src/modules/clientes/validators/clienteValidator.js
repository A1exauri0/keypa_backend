const { body, param } = require('express-validator');

const validarIdCliente = [
  param('id').isInt({ min: 1 }).withMessage('ID de cliente invalido'),
];

const validarGenero = body('genero')
  .optional({ nullable: true })
  .isIn(['Masculino', 'Femenino'])
  .withMessage('Genero invalido');

const validarCrearCliente = [
  body('nombre')
    .isString()
    .trim()
    .isLength({ min: 2, max: 120 })
    .withMessage('Nombre de cliente invalido'),
  body('apellidos')
    .isString()
    .trim()
    .isLength({ min: 2, max: 180 })
    .withMessage('Apellidos de cliente invalidos'),
  body('email')
    .optional({ nullable: true })
    .isEmail()
    .withMessage('Email invalido')
    .normalizeEmail(),
  body('telefono')
    .isString()
    .trim()
    .isLength({ min: 8, max: 20 })
    .withMessage('Telefono invalido'),
  body('fechaNacimiento')
    .optional({ nullable: true })
    .isISO8601()
    .withMessage('Fecha de nacimiento invalida'),
  validarGenero,
  body('direccion')
    .optional({ nullable: true })
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

const validarActualizarCliente = [
  ...validarIdCliente,
  body('nombre')
    .optional()
    .isString()
    .trim()
    .isLength({ min: 2, max: 120 })
    .withMessage('Nombre de cliente invalido'),
  body('apellidos')
    .optional()
    .isString()
    .trim()
    .isLength({ min: 2, max: 180 })
    .withMessage('Apellidos de cliente invalidos'),
  body('email')
    .optional({ nullable: true })
    .isEmail()
    .withMessage('Email invalido')
    .normalizeEmail(),
  body('telefono')
    .optional()
    .isString()
    .trim()
    .isLength({ min: 8, max: 20 })
    .withMessage('Telefono invalido'),
  body('fechaNacimiento')
    .optional({ nullable: true })
    .isISO8601()
    .withMessage('Fecha de nacimiento invalida'),
  validarGenero,
  body('direccion')
    .optional({ nullable: true })
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

const validarEliminarClientesMultiples = [
  body('ids').isArray({ min: 1 }).withMessage('Debes enviar al menos un ID de cliente'),
  body('ids.*').isInt({ min: 1 }).withMessage('Cada ID de cliente debe ser valido'),
];

module.exports = {
  validarIdCliente,
  validarCrearCliente,
  validarActualizarCliente,
  validarEliminarClientesMultiples,
};
