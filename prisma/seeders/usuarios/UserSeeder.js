const bcrypt = require('bcryptjs');
const prisma = require('../../../src/shared/db/prisma');

const usuariosBase = [
  {
    nombre: 'Admin',
    email: 'admin@example.com',
    password: 'password',
    rol: 'admin',
  },
  {
    nombre: 'Vendedor',
    email: 'vendedor@example.com',
    password: 'password',
    rol: 'vendedor',
  },
];

async function ejecutarUserSeeder() {
  for (const usuario of usuariosBase) {
    const passwordHash = await bcrypt.hash(usuario.password, 12);

    const usuarioGuardado = await prisma.user.upsert({
      where: { email: usuario.email },
      update: {
        nombre: usuario.nombre,
        passwordHash,
        activo: true,
      },
      create: {
        nombre: usuario.nombre,
        email: usuario.email,
        passwordHash,
        activo: true,
      },
    });

    const rol = await prisma.rol.findUnique({
      where: { nombre: usuario.rol },
      select: { idRol: true },
    });

    if (!rol) {
      continue;
    }

    await prisma.usuarioRol.upsert({
      where: {
        idUsuario_idRol: {
          idUsuario: usuarioGuardado.idUsuario,
          idRol: rol.idRol,
        },
      },
      update: {},
      create: {
        idUsuario: usuarioGuardado.idUsuario,
        idRol: rol.idRol,
      },
    });
  }

  console.log('UserSeeder ejecutado correctamente');
}

module.exports = {
  ejecutarUserSeeder,
};
