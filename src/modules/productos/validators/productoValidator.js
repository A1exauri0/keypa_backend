const { body, param, query } = require('express-validator');

const tiposProducto = ['Ropa', 'Maquillaje', 'Accesorios', 'Otros', 'ROPA', 'MAQUILLAJE', 'HOGAR', 'OTROS'];
const disponibilidadesProducto = [
  'Disponible',
  'Pausado',
  'Descontinuado',
  'PUBLICADO',
  'BORRADOR',
  'DESCONTINUADO',
];

function validarTipoEfectivo(req) {
  const tipo = req.body.tipo ?? req.body.tipoProducto;
  return tiposProducto.includes(tipo);
}

function validarDisponibilidadEfectiva(req) {
  const disponibilidad = req.body.disponibilidad ?? req.body.estado;
  return disponibilidad === undefined || disponibilidadesProducto.includes(disponibilidad);
}

const validarIdProducto = [
  param('id').isInt({ min: 1 }).withMessage('ID de producto invalido'),
];

const validarImagenes = [
  body('imagenes')
    .optional()
    .isArray()
    .withMessage('imagenes debe ser un arreglo'),
  body('imagenes.*.url')
    .optional()
    .isString()
    .trim()
    .isLength({ min: 4, max: 255 })
    .withMessage('URL de imagen invalida'),
  body('imagenes.*.alt')
    .optional({ nullable: true })
    .isString()
    .trim()
    .isLength({ min: 2, max: 180 })
    .withMessage('Texto alternativo invalido'),
  body('imagenes.*.orden')
    .optional()
    .isInt({ min: 0 })
    .withMessage('orden de imagen invalido'),
  body('imagenes.*.principal')
    .optional()
    .isBoolean()
    .withMessage('principal debe ser booleano'),
];

const validarCrearProducto = [
  body('nombre')
    .isString()
    .trim()
    .isLength({ min: 2, max: 180 })
    .withMessage('Nombre de producto invalido'),
  body('slug')
    .isString()
    .trim()
    .isLength({ min: 2, max: 200 })
    .withMessage('Slug de producto invalido'),
  body('sku')
    .isString()
    .trim()
    .isLength({ min: 2, max: 120 })
    .withMessage('SKU invalido'),
  body('descripcion')
    .optional({ nullable: true })
    .isString()
    .trim()
    .withMessage('Descripcion invalida'),
  body('tipo').custom((value, { req }) => validarTipoEfectivo(req)).withMessage('tipo invalido'),
  body('disponibilidad')
    .custom((value, { req }) => validarDisponibilidadEfectiva(req))
    .withMessage('disponibilidad invalida'),
  body('precio')
    .isFloat({ gt: 0 })
    .withMessage('precio debe ser mayor que cero'),
  body('costo')
    .isFloat({ gt: 0 })
    .withMessage('costo debe ser mayor que cero'),
  body('idMarca')
    .isInt({ min: 1 })
    .withMessage('idMarca invalido'),
  body('categorias')
    .isArray({ min: 1 })
    .withMessage('Debes enviar al menos una categoria'),
  body('categorias.*')
    .isInt({ min: 1 })
    .withMessage('Cada categoria debe ser un ID valido'),
  body('activo').optional().isBoolean().withMessage('activo debe ser booleano'),
  body('color').optional({ nullable: true }).isString().trim().isLength({ min: 1, max: 80 }).withMessage('color invalido'),
  body('talla').optional({ nullable: true }).isString().trim().isLength({ min: 1, max: 40 }).withMessage('talla invalida'),
  body('tono').optional({ nullable: true }).isString().trim().isLength({ min: 1, max: 80 }).withMessage('tono invalido'),
  body('material').optional({ nullable: true }).isString().trim().isLength({ min: 1, max: 120 }).withMessage('material invalido'),
  ...validarImagenes,
];

const validarActualizarProducto = [
  ...validarIdProducto,
  body('nombre')
    .optional()
    .isString()
    .trim()
    .isLength({ min: 2, max: 180 })
    .withMessage('Nombre de producto invalido'),
  body('slug')
    .optional()
    .isString()
    .trim()
    .isLength({ min: 2, max: 200 })
    .withMessage('Slug de producto invalido'),
  body('sku')
    .optional()
    .isString()
    .trim()
    .isLength({ min: 2, max: 120 })
    .withMessage('SKU invalido'),
  body('descripcion')
    .optional({ nullable: true })
    .isString()
    .trim()
    .withMessage('Descripcion invalida'),
  body('tipo')
    .optional({ nullable: true })
    .custom((value, { req }) => {
      const tipo = req.body.tipo ?? req.body.tipoProducto;
      return tipo === undefined || tiposProducto.includes(tipo);
    })
    .withMessage('tipo invalido'),
  body('disponibilidad')
    .optional({ nullable: true })
    .custom((value, { req }) => validarDisponibilidadEfectiva(req))
    .withMessage('disponibilidad invalida'),
  body('precio')
    .optional()
    .isFloat({ gt: 0 })
    .withMessage('precio debe ser mayor que cero'),
  body('costo')
    .optional()
    .isFloat({ gt: 0 })
    .withMessage('costo debe ser mayor que cero'),
  body('idMarca')
    .optional()
    .isInt({ min: 1 })
    .withMessage('idMarca invalido'),
  body('categorias')
    .optional()
    .isArray({ min: 1 })
    .withMessage('Debes enviar al menos una categoria'),
  body('categorias.*')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Cada categoria debe ser un ID valido'),
  body('activo').optional().isBoolean().withMessage('activo debe ser booleano'),
  body('color').optional({ nullable: true }).isString().trim().isLength({ min: 1, max: 80 }).withMessage('color invalido'),
  body('talla').optional({ nullable: true }).isString().trim().isLength({ min: 1, max: 40 }).withMessage('talla invalida'),
  body('tono').optional({ nullable: true }).isString().trim().isLength({ min: 1, max: 80 }).withMessage('tono invalido'),
  body('material').optional({ nullable: true }).isString().trim().isLength({ min: 1, max: 120 }).withMessage('material invalido'),
  ...validarImagenes,
];

const validarFiltrosProductos = [
  query('idMarca').optional().isInt({ min: 1 }).withMessage('idMarca invalido'),
  query('idCategoria').optional().isInt({ min: 1 }).withMessage('idCategoria invalido'),
  query('tipo').optional().isIn(tiposProducto).withMessage('tipo invalido'),
  query('tipoProducto').optional().isIn(tiposProducto).withMessage('tipo invalido'),
  query('disponibilidad').optional().isIn(disponibilidadesProducto).withMessage('disponibilidad invalida'),
  query('estado').optional().isIn(disponibilidadesProducto).withMessage('disponibilidad invalida'),
  query('activo').optional().isBoolean().withMessage('activo invalido'),
];

const validarEliminarProductosMultiples = [
  body('ids').isArray({ min: 1 }).withMessage('Debes enviar al menos un ID de producto'),
  body('ids.*').isInt({ min: 1 }).withMessage('Cada ID de producto debe ser valido'),
];

module.exports = {
  validarIdProducto,
  validarCrearProducto,
  validarActualizarProducto,
  validarFiltrosProductos,
  validarEliminarProductosMultiples,
};
