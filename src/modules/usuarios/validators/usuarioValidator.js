const { body, param } = require("express-validator");

const validarCrearUsuario = [
  body("nombre")
    .isString()
    .trim()
    .isLength({ min: 2 })
    .withMessage("Nombre invalido"),
  body("email").isEmail().withMessage("Correo invalido").normalizeEmail(),
  body("password")
    .isString()
    .isLength({ min: 8 })
    .withMessage("La contrasena debe tener al menos 8 caracteres"),
  body("roles").isArray({ min: 1 }).withMessage("Debes enviar al menos un rol"),
  body("roles.*")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Cada rol debe ser texto valido"),
  body("permisosAdicionales")
    .optional()
    .isArray()
    .withMessage("permisosAdicionales debe ser un arreglo"),
  body("permisosAdicionales.*")
    .optional()
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Cada permiso adicional debe ser texto valido"),
];

const validarAsignarRoles = [
  param("id").isInt({ min: 1 }).withMessage("ID de usuario invalido"),
  body("roles").isArray({ min: 1 }).withMessage("Debes enviar al menos un rol"),
  body("roles.*")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Cada rol debe ser texto valido"),
];

const validarActualizarUsuario = [
  param("id").isInt({ min: 1 }).withMessage("ID de usuario invalido"),
  body("nombre")
    .optional()
    .isString()
    .trim()
    .isLength({ min: 2 })
    .withMessage("Nombre invalido"),
  body("email")
    .optional()
    .isEmail()
    .withMessage("Correo invalido")
    .normalizeEmail(),
  body("activo").optional().isBoolean().withMessage("activo debe ser booleano"),
];

const validarIdUsuario = [
  param("id").isInt({ min: 1 }).withMessage("ID de usuario invalido"),
];

const validarAsignarPermisosUsuario = [
  param("id").isInt({ min: 1 }).withMessage("ID de usuario invalido"),
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
  validarCrearUsuario,
  validarAsignarRoles,
  validarActualizarUsuario,
  validarIdUsuario,
  validarAsignarPermisosUsuario,
};
