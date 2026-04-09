const dotenv = require('dotenv');
const prisma = require('../src/shared/db/prisma');
const { ejecutarRolSeeder } = require('./seeders/usuarios/RolSeeder');
const { ejecutarPermisoSeeder } = require('./seeders/usuarios/PermisoSeeder');
const { ejecutarRolPermisoSeeder } = require('./seeders/usuarios/RolPermisoSeeder');
const { ejecutarUserSeeder } = require('./seeders/usuarios/UserSeeder');
const { ejecutarProductoSeeder } = require('./seeders/productos/ProductoSeeder');

dotenv.config();

async function ejecutarSeeders() {
  await prisma.$connect();

  await ejecutarRolSeeder();
  await ejecutarPermisoSeeder();
  await ejecutarRolPermisoSeeder();
  await ejecutarUserSeeder();
  await ejecutarProductoSeeder();

  await prisma.$disconnect();
}

ejecutarSeeders()
  .then(() => {
    console.log('Seed finalizado');
  })
  .catch(async (error) => {
    console.error('Error al ejecutar seed:', error);
    await prisma.$disconnect();
    process.exit(1);
  });
