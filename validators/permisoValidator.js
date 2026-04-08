const { body, param } = require("express-validator");

const validarIdPermiso = [
  param("id").isInt({ min: 1 }).withMessage("ID de permiso invalido"),
];

const validarCrearPermiso = [
  body("nombre")
    .isString()
    .trim()
    .isLength({ min: 3 })
    .withMessage("Nombre de permiso invalido"),
  body("descripcion")
    .optional()
    .isString()
    .trim()
    .isLength({ min: 2 })
    .withMessage("Descripcion invalida"),
];

const validarActualizarPermiso = [
  param("id").isInt({ min: 1 }).withMessage("ID de permiso invalido"),
  body("nombre")
    .optional()
    .isString()
    .trim()
    .isLength({ min: 3 })
    .withMessage("Nombre de permiso invalido"),
  body("descripcion")
    .optional()
    .isString()
    .trim()
    .isLength({ min: 2 })
    .withMessage("Descripcion invalida"),
];

module.exports = {
  validarIdPermiso,
  validarCrearPermiso,
  validarActualizarPermiso,
};
