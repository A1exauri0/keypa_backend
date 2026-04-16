const { body, param } = require('express-validator');

const validarIdCompra = [
  param('id').isInt({ min: 1 }).withMessage('ID de compra invalido'),
];

const validarCrearCompra = [
  body('idProveedor').isInt({ min: 1 }).withMessage('El proveedor es obligatorio'),
  body('idAlmacen').isInt({ min: 1 }).withMessage('El almacen es obligatorio'),
  body('observaciones')
    .optional({ nullable: true })
    .isString()
    .trim()
    .isLength({ min: 2, max: 255 })
    .withMessage('Observaciones invalidas'),
  body('detalles').isArray({ min: 1 }).withMessage('Debes enviar al menos un producto en la compra'),
  body('detalles.*.idProducto').isInt({ min: 1 }).withMessage('ID de producto invalido'),
  body('detalles.*.cantidad').isInt({ min: 1 }).withMessage('Cantidad invalida'),
];

const validarActualizarEstadoCompra = [
  ...validarIdCompra,
  body('estado')
    .isString()
    .trim()
    .toLowerCase()
    .isIn(['completada', 'cancelada'])
    .withMessage('Estado invalido. Usa completada o cancelada'),
];

module.exports = {
  validarIdCompra,
  validarCrearCompra,
  validarActualizarEstadoCompra,
};
