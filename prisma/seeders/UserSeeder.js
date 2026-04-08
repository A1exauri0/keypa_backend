const bcrypt = require('bcryptjs');
const prisma = require('../../config/prisma');

const usuariosBase = [
  {
    nombre: 'Admin',
    email: 'admin@example.com',
    password: 'password',
  },
  {
    nombre: 'Vendedor',
    email: 'vendedor@example.com',
    password: 'password',
  },
];

async function ejecutarUserSeeder() {
  for (const usuario of usuariosBase) {
    const passwordHash = await bcrypt.hash(usuario.password, 12);

    await prisma.user.upsert({
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
  }

  console.log('UserSeeder ejecutado correctamente');
}

module.exports = {
  ejecutarUserSeeder,
};