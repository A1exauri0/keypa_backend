const dotenv = require('dotenv');
const prisma = require('../src/shared/db/prisma');
const { ejecutarRolSeeder } = require('./seeders/usuarios/RolSeeder');
const { ejecutarPermisoSeeder } = require('./seeders/usuarios/PermisoSeeder');
const { ejecutarRolPermisoSeeder } = require('./seeders/usuarios/RolPermisoSeeder');
const { ejecutarUserSeeder } = require('./seeders/usuarios/UserSeeder');
const { ejecutarMarcaSeeder } = require('./seeders/productos/MarcaSeeder');
const { ejecutarCategoriaSeeder } = require('./seeders/productos/CategoriaSeeder');
const { ejecutarProductoSeeder } = require('./seeders/productos/ProductoSeeder');
const { ejecutarCiudadSeeder } = require('./seeders/ubicaciones/CiudadSeeder');
const { ejecutarColoniaSeeder } = require('./seeders/ubicaciones/ColoniaSeeder');

dotenv.config();

async function ejecutarSeeders() {
  await prisma.$connect();

  await ejecutarRolSeeder();
  await ejecutarPermisoSeeder();
  await ejecutarRolPermisoSeeder();
  await ejecutarUserSeeder();
  await ejecutarMarcaSeeder();
  await ejecutarCategoriaSeeder();
  await ejecutarProductoSeeder();
  await ejecutarCiudadSeeder();
  await ejecutarColoniaSeeder();

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
