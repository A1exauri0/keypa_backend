const { body, param, query } = require('express-validator');

const ESTADOS_VENTA = ['pendiente', 'pagado', 'cancelado'];
const TIPOS_PAGO = ['efectivo', 'transferencia'];

const validarIdVenta = [
  param('id').isInt({ min: 1 }).withMessage('ID de venta invalido'),
];

const validarCrearVenta = [
  body('idCliente').isInt({ min: 1 }).withMessage('ID de cliente invalido'),
  body('idAlmacen').isInt({ min: 1 }).withMessage('ID de almacen invalido'),
  body('tipoPago')
    .isIn(TIPOS_PAGO)
    .withMessage('tipoPago debe ser efectivo o transferencia'),
  body('montoPagado')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('montoPagado debe ser un numero mayor o igual a 0'),
  body('detalles').isArray({ min: 1 }).withMessage('Debes enviar al menos un detalle de venta'),
  body('detalles.*.idProducto').isInt({ min: 1 }).withMessage('ID de producto invalido en detalle'),
  body('detalles.*.cantidad').isInt({ min: 1 }).withMessage('Cantidad invalida en detalle'),
];

const validarActualizarEstadoVenta = [
  ...validarIdVenta,
  body('estado')
    .isIn(ESTADOS_VENTA)
    .withMessage('estado debe ser pendiente, pagado o cancelado'),
];

const validarCatalogoInventarioVenta = [
  query('idAlmacen')
    .optional()
    .isInt({ min: 1 })
    .withMessage('idAlmacen debe ser un entero positivo'),
];

module.exports = {
  validarIdVenta,
  validarCrearVenta,
  validarActualizarEstadoVenta,
  validarCatalogoInventarioVenta,
};
