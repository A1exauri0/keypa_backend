const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const {
  buscarPorEmail,
  contarUsuarios,
  listarUsuarios,
  obtenerUsuarioPorId,
  actualizarUsuario,
  eliminarUsuario,
  crearUsuario,
  asignarRolesAUsuario,
  asignarPermisosAUsuario,
  existeUsuarioConEmail,
  guardarTokenRecuperacion,
  buscarPorTokenRecuperacion,
  actualizarPasswordConRecuperacion,
  mapearUsuarioAuth,
} = require('../services/usuario.service');
const { enviarCorreoRecuperacion } = require('../../../shared/services/emailService');

function esDepuracionAuth() {
  return process.env.DEBUG_AUTH_RESPONSES === 'true' || process.env.NODE_ENV === 'development';
}

function crearToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      roles: user.roles,
      permisos: user.permisos,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '1d' },
  );
}

/**
 * Genera hash SHA-256 para persistir tokens sin guardar el valor plano.
 */
function crearHashToken(tokenPlano) {
  return crypto.createHash('sha256').update(tokenPlano).digest('hex');
}

/**
 * Construye URL publica de restablecimiento con token y correo.
 */
function construirEnlaceReset({ email, tokenPlano }) {
  const fallback = (process.env.FRONTEND_ORIGIN || 'http://localhost:5173')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)[0];

  const baseUrl = process.env.PASSWORD_RESET_URL || `${fallback}/reset-password`;
  const url = new URL(baseUrl);
  url.searchParams.set('token', tokenPlano);
  url.searchParams.set('email', email);
  return url.toString();
}

async function login(req, res) {
  const { email, password } = req.body;
  try {
    const user = await buscarPorEmail(email);

    if (!user) {
      return res.status(401).json({
        message: 'Credenciales invalidas',
        codigo: 'USUARIO_NO_ENCONTRADO',
        diagnostico: esDepuracionAuth()
          ? {
              email,
              existeUsuario: false,
            }
          : undefined,
      });
    }

    if (!user.activo) {
      return res.status(401).json({
        message: 'Usuario inactivo',
        codigo: 'USUARIO_INACTIVO',
        diagnostico: esDepuracionAuth()
          ? {
              email,
              existeUsuario: true,
              activo: user.activo,
            }
          : undefined,
      });
    }

    const passwordCorrecta = await bcrypt.compare(password, user.passwordHash);
    if (!passwordCorrecta) {
      return res.status(401).json({
        message: 'Credenciales invalidas',
        codigo: 'PASSWORD_INVALIDA',
        diagnostico: esDepuracionAuth()
          ? {
              email,
              existeUsuario: true,
              activo: user.activo,
            }
          : undefined,
      });
    }

    const authUser = mapearUsuarioAuth(user);
    const token = crearToken(authUser);

    return res.json({
      message: 'Inicio de sesión exitoso',
      token,
      user: authUser,
    });
  } catch (error) {
    console.error('Error en login:', error);

    return res.status(500).json({
      message: 'Error al intentar iniciar sesión',
      codigo: 'LOGIN_ERROR',
      diagnostico: esDepuracionAuth()
        ? {
            email,
            detalle: error.message,
          }
        : undefined,
    });
  }
}

async function registerInicial(req, res) {
  const { nombre, email, password } = req.body;

  const existente = await existeUsuarioConEmail(email);
  if (existente) {
    return res.status(409).json({ message: 'El correo ya esta registrado' });
  }

  const totalUsuarios = await contarUsuarios();
  if (totalUsuarios > 0) {
    return res.status(403).json({
      message: 'Registro deshabilitado. Crea usuarios desde el panel.',
    });
  }

  const user = await crearUsuario({
    nombre,
    email,
    password,
    roles: ['admin'],
  });

  const authUser = mapearUsuarioAuth(user);
  const token = crearToken(authUser);

  return res.status(201).json({
    message: 'Primer usuario creado correctamente',
    token,
    user: authUser,
  });
}

async function me(req, res) {
  return res.json({ user: req.user });
}

async function logout(_req, res) {
  return res.json({ message: 'Sesion cerrada correctamente' });
}

/**
 * Genera y envia enlace de recuperacion, sin revelar si el correo existe.
 */
async function forgotPassword(req, res) {
  const { email } = req.body;
  const mensajeGenerico =
    'Si el correo existe en el sistema, enviaremos un enlace de recuperacion en breve.';

  try {
    const user = await buscarPorEmail(email);

    if (!user || !user.activo) {
      return res.json({ message: mensajeGenerico });
    }

    const tokenPlano = crypto.randomBytes(32).toString('hex');
    const tokenHash = crearHashToken(tokenPlano);
    const ttlMinutes = Number(process.env.PASSWORD_RESET_TOKEN_TTL_MINUTES || 60);
    const expiresAt = new Date(Date.now() + ttlMinutes * 60 * 1000);

    await guardarTokenRecuperacion({
      idUsuario: user.idUsuario,
      tokenHash,
      expiresAt,
    });

    const link = construirEnlaceReset({ email: user.email, tokenPlano });

    await enviarCorreoRecuperacion({
      to: user.email,
      nombre: user.nombre,
      link,
    });

    return res.json({ message: mensajeGenerico });
  } catch (error) {
    console.error('Error en forgotPassword:', error);
    return res.status(500).json({ message: 'No fue posible procesar la solicitud de recuperacion' });
  }
}

/**
 * Valida token vigente y actualiza la contrasena del usuario.
 */
async function resetPassword(req, res) {
  const { email, token, password } = req.body;

  try {
    const tokenHash = crearHashToken(token);
    const user = await buscarPorTokenRecuperacion({ email, tokenHash });

    if (!user) {
      return res.status(400).json({ message: 'El enlace de recuperacion es invalido o ya expiro' });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    await actualizarPasswordConRecuperacion({
      idUsuario: user.idUsuario,
      passwordHash,
    });

    return res.json({ message: 'Contrasena actualizada correctamente' });
  } catch (error) {
    console.error('Error en resetPassword:', error);
    return res.status(500).json({ message: 'No fue posible actualizar la contrasena' });
  }
}

async function index(_req, res) {
  const usuarios = await listarUsuarios();
  return res.json({
    data: usuarios.map((usuario) => mapearUsuarioAuth(usuario)),
  });
}

async function show(req, res) {
  const idUsuario = Number(req.params.id);
  const usuario = await obtenerUsuarioPorId(idUsuario);

  if (!usuario) {
    return res.status(404).json({ message: 'Usuario no encontrado' });
  }

  return res.json({
    data: mapearUsuarioAuth(usuario),
  });
}

async function store(req, res) {
  const { nombre, email, password, roles, permisosAdicionales = [] } = req.body;
  const existeEmail = await existeUsuarioConEmail(email);

  if (existeEmail) {
    return res.status(409).json({ message: 'El correo ya esta registrado' });
  }

  const usuario = await crearUsuario({
    nombre,
    email,
    password,
    roles,
    permisosAdicionales,
  });

  return res.status(201).json({
    message: 'Usuario creado correctamente',
    data: mapearUsuarioAuth(usuario),
  });
}

async function asignarRoles(req, res) {
  const userId = Number(req.params.id);
  if (!Number.isInteger(userId) || userId <= 0) {
    return res.status(422).json({ message: 'ID de usuario invalido' });
  }

  const usuario = await asignarRolesAUsuario({
    userId,
    roles: req.body.roles,
  });

  if (!usuario) {
    return res.status(404).json({ message: 'Usuario no encontrado' });
  }

  return res.json({
    message: 'Roles actualizados correctamente',
    data: mapearUsuarioAuth(usuario),
  });
}

async function asignarPermisos(req, res) {
  const idUsuario = Number(req.params.id);
  if (!Number.isInteger(idUsuario) || idUsuario <= 0) {
    return res.status(422).json({ message: 'ID de usuario invalido' });
  }

  const usuario = await asignarPermisosAUsuario({
    idUsuario,
    permisos: req.body.permisos,
  });

  if (!usuario) {
    return res.status(404).json({ message: 'Usuario no encontrado' });
  }

  return res.json({
    message: 'Permisos directos actualizados correctamente',
    data: mapearUsuarioAuth(usuario),
  });
}

async function update(req, res) {
  const idUsuario = Number(req.params.id);
  if (!Number.isInteger(idUsuario) || idUsuario <= 0) {
    return res.status(422).json({ message: 'ID de usuario invalido' });
  }

  const usuario = await actualizarUsuario({
    idUsuario,
    nombre: req.body.nombre,
    email: req.body.email,
    activo: req.body.activo,
  });

  if (!usuario) {
    return res.status(404).json({ message: 'Usuario no encontrado' });
  }

  return res.json({
    message: 'Usuario actualizado correctamente',
    data: mapearUsuarioAuth(usuario),
  });
}

async function destroy(req, res) {
  const idUsuario = Number(req.params.id);
  if (!Number.isInteger(idUsuario) || idUsuario <= 0) {
    return res.status(422).json({ message: 'ID de usuario invalido' });
  }

  const eliminado = await eliminarUsuario(idUsuario);
  if (!eliminado) {
    return res.status(404).json({ message: 'Usuario no encontrado' });
  }

  return res.json({ message: 'Usuario eliminado correctamente' });
}

module.exports = {
  login,
  registerInicial,
  forgotPassword,
  resetPassword,
  me,
  logout,
  index,
  show,
  store,
  update,
  destroy,
  asignarRoles,
  asignarPermisos,
};
