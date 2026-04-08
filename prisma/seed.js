const dotenv = require('dotenv');
const prisma = require('../config/prisma');
const { ejecutarUserSeeder } = require('./seeders/UserSeeder');

dotenv.config();

async function ejecutarSeeders() {
  await prisma.$connect();

  await ejecutarUserSeeder();

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
