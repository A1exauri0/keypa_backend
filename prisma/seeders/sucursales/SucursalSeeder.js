const prisma = require('../../../src/shared/db/prisma');

const sucursalesBase = [
  {
    nombre: 'Sucursal Tuxtla Gutierrez',
    telefono: '9611010101',
    email: 'tuxtla.gutierrez@keypa.mx',
    encargado: 'Marcia Vazquez',
    direccion: 'Av Central Poniente',
    numeroExterior: '320',
    numeroInterior: null,
    referencias: 'Frente al parque central',
    ciudad: 'Tuxtla Gutierrez',
    colonia: 'Centro',
  }
];

async function obtenerUbicacion(ciudadNombre, coloniaNombre) {
  const ciudad = await prisma.ciudad.findUnique({
    where: { nombre: ciudadNombre },
    select: { idCiudad: true },
  });

  if (!ciudad) {
    return { idCiudad: null, idColonia: null, codigoPostal: null };
  }

  const colonia = await prisma.colonia.findFirst({
    where: {
      idCiudad: ciudad.idCiudad,
      nombre: coloniaNombre,
    },
    select: { idColonia: true, codigoPostal: true },
  });

  return {
    idCiudad: ciudad.idCiudad,
    idColonia: colonia?.idColonia ?? null,
    codigoPostal: colonia?.codigoPostal ?? null,
  };
}

async function ejecutarSucursalSeeder() {
  for (const sucursal of sucursalesBase) {
    const ubicacion = await obtenerUbicacion(sucursal.ciudad, sucursal.colonia);

    await prisma.sucursal.upsert({
      where: { nombre: sucursal.nombre },
      update: {
        telefono: sucursal.telefono,
        email: sucursal.email,
        encargado: sucursal.encargado,
        direccion: sucursal.direccion,
        numeroExterior: sucursal.numeroExterior,
        numeroInterior: sucursal.numeroInterior,
        referencias: sucursal.referencias,
        codigoPostal: ubicacion.codigoPostal,
        idCiudad: ubicacion.idCiudad,
        idColonia: ubicacion.idColonia,
        activo: true,
      },
      create: {
        nombre: sucursal.nombre,
        telefono: sucursal.telefono,
        email: sucursal.email,
        encargado: sucursal.encargado,
        direccion: sucursal.direccion,
        numeroExterior: sucursal.numeroExterior,
        numeroInterior: sucursal.numeroInterior,
        referencias: sucursal.referencias,
        codigoPostal: ubicacion.codigoPostal,
        idCiudad: ubicacion.idCiudad,
        idColonia: ubicacion.idColonia,
        activo: true,
      },
    });
  }

  console.log('SucursalSeeder ejecutado correctamente');
}

module.exports = {
  ejecutarSucursalSeeder,
};
