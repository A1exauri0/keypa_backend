const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {
  buscarPorEmail,
  contarUsuarios,
  listarUsuarios,
  crearUsuario,
  asignarRolesAUsuario,
  existeUsuarioConEmail,
  mapearUsuarioAuth,
} = require('../models/User');

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

async function login(req, res) {
  const { email, password } = req.body;
  const user = await buscarPorEmail(email);

  if (!user || !user.activo) {
    return res.status(401).json({ message: 'Credenciales invalidas' });
  }

  const passwordCorrecta = await bcrypt.compare(password, user.passwordHash);
  if (!passwordCorrecta) {
    return res.status(401).json({ message: 'Credenciales invalidas' });
  }

  const authUser = mapearUsuarioAuth(user);
  const token = crearToken(authUser);

  return res.json({
    message: 'Inicio de sesion exitoso',
    token,
    user: authUser,
  });
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
    roles: ['super_admin'],
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

async function index(_req, res) {
  const usuarios = await listarUsuarios();
  return res.json({
    data: usuarios.map((usuario) => mapearUsuarioAuth(usuario)),
  });
}

async function store(req, res) {
  const { nombre, email, password, roles } = req.body;
  const existeEmail = await existeUsuarioConEmail(email);

  if (existeEmail) {
    return res.status(409).json({ message: 'El correo ya esta registrado' });
  }

  const usuario = await crearUsuario({ nombre, email, password, roles });

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

module.exports = {
  login,
  registerInicial,
  me,
  logout,
  index,
  store,
  asignarRoles,
};
