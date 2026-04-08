const { validationResult } = require('express-validator');

function validarRequest(req, res, next) {
  const errores = validationResult(req);

  if (!errores.isEmpty()) {
    return res.status(422).json({
      message: 'Datos invalidos',
      codigo: 'VALIDACION_ERROR',
      endpoint: req.originalUrl,
      metodo: req.method,
      errores: errores.array(),
    });
  }

  return next();
}

module.exports = validarRequest;
