const { body, param } = require("express-validator");

const validarIdRol = [
  param("id").isInt({ min: 1 }).withMessage("ID de rol invalido"),
];

const validarCrearRol = [
  body("nombre")
    .isString()
    .trim()
    .isLength({ min: 2 })
    .withMessage("Nombre de rol invalido"),
  body("descripcion")
    .optional()
    .isString()
    .trim()
    .isLength({ min: 2 })
    .withMessage("Descripcion invalida"),
  body("permisos")
    .optional()
    .isArray()
    .withMessage("permisos debe ser un arreglo"),
  body("permisos.*")
    .optional()
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Cada permiso debe ser texto valido"),
];

const validarActualizarRol = [
  param("id").isInt({ min: 1 }).withMessage("ID de rol invalido"),
  body("nombre")
    .optional()
    .isString()
    .trim()
    .isLength({ min: 2 })
    .withMessage("Nombre de rol invalido"),
  body("descripcion")
    .optional()
    .isString()
    .trim()
    .isLength({ min: 2 })
    .withMessage("Descripcion invalida"),
];

const validarAsignarPermisosRol = [
  param("id").isInt({ min: 1 }).withMessage("ID de rol invalido"),
  body("permisos")
    .isArray({ min: 1 })
    .withMessage("Debes enviar al menos un permiso"),
  body("permisos.*")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Cada permiso debe ser texto valido"),
];

module.exports = {
  validarIdRol,
  validarCrearRol,
  validarActualizarRol,
  validarAsignarPermisosRol,
};
