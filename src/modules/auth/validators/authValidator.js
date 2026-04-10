const { body } = require("express-validator");

const validarLogin = [
  body("email").isEmail().withMessage("Correo invalido").normalizeEmail(),
  body("password")
    .isString()
    .isLength({ min: 6 })
    .withMessage("La contrasena debe tener al menos 6 caracteres"),
];

const validarRegistroInicial = [
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
];

const validarForgotPassword = [
  body('email').isEmail().withMessage('Correo invalido').normalizeEmail(),
];

const validarResetPassword = [
  body('email').isEmail().withMessage('Correo invalido').normalizeEmail(),
  body('token')
    .isString()
    .trim()
    .notEmpty()
    .withMessage('Token de recuperacion requerido'),
  body('password')
    .isString()
    .isLength({ min: 8 })
    .withMessage('La contrasena debe tener al menos 8 caracteres'),
  body('confirmPassword')
    .isString()
    .custom((value, { req }) => value === req.body.password)
    .withMessage('Las contrasenas no coinciden'),
];

module.exports = {
  validarLogin,
  validarRegistroInicial,
  validarForgotPassword,
  validarResetPassword,
};
