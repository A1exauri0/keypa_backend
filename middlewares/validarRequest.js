const { validationResult } = require('express-validator');

function validarRequest(req, res, next) {
  const errores = validationResult(req);

  if (!errores.isEmpty()) {
    return res.status(422).json({
      message: 'Datos invalidos',
      errores: errores.array(),
    });
  }

  return next();
}

module.exports = validarRequest;
