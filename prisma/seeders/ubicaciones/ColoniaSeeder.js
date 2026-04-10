const prisma = require('../../../src/shared/db/prisma');

const coloniasPorCiudad = {
  'Tuxtla Gutierrez': [
    { nombre: 'Centro', codigoPostal: '29000' },
    { nombre: 'Las Arboledas', codigoPostal: '29030' },
    { nombre: 'Los Laguitos', codigoPostal: '29020' },
  ],
  'San Cristobal de las Casas': [
    { nombre: 'Barrio de Guadalupe', codigoPostal: '29230' },
    { nombre: 'Barrio de Mexicanos', codigoPostal: '29240' },
    { nombre: 'Santa Lucia', codigoPostal: '29250' },
  ],
  'Tapachula': [
    { nombre: 'Centro', codigoPostal: '30700' },
    { nombre: 'Los Laureles', codigoPostal: '30780' },
    { nombre: '5 de Febrero', codigoPostal: '30790' },
  ],
  'Comitan de Dominguez': [
    { nombre: 'Centro', codigoPostal: '30000' },
    { nombre: 'Guadalupe', codigoPostal: '30010' },
    { nombre: 'Norte', codigoPostal: '30020' },
  ],
  'Palenque': [
    { nombre: 'Centro', codigoPostal: '29960' },
    { nombre: 'Pakal-Na', codigoPostal: '29963' },
    { nombre: 'Magisterial', codigoPostal: '29964' },
  ],
  'Chiapa de Corzo': [
    { nombre: 'Centro', codigoPostal: '29160' },
    { nombre: 'San Jacinto', codigoPostal: '29163' },
    { nombre: 'El Refugio', codigoPostal: '29165' },
  ],
  'Ocosingo': [
    { nombre: 'Centro', codigoPostal: '29950' },
    { nombre: 'Norte', codigoPostal: '29952' },
    { nombre: 'Sur', codigoPostal: '29953' },
  ],
  'Tonalá': [
    { nombre: 'Centro', codigoPostal: '30500' },
    { nombre: 'Las Flores', codigoPostal: '30510' },
    { nombre: 'San Francisco', codigoPostal: '30520' },
  ],
};

async function ejecutarColoniaSeeder() {
  for (const [nombreCiudad, colonias] of Object.entries(coloniasPorCiudad)) {
    const ciudad = await prisma.ciudad.findUnique({
      where: { nombre: nombreCiudad },
      select: { idCiudad: true },
    });

    if (!ciudad) {
      continue;
    }

    for (const colonia of colonias) {
      await prisma.colonia.upsert({
        where: {
          idCiudad_nombre_codigoPostal: {
            idCiudad: ciudad.idCiudad,
            nombre: colonia.nombre,
            codigoPostal: colonia.codigoPostal,
          },
        },
        update: {
          activo: true,
        },
        create: {
          idCiudad: ciudad.idCiudad,
          nombre: colonia.nombre,
          codigoPostal: colonia.codigoPostal,
          activo: true,
        },
      });
    }
  }

  console.log('ColoniaSeeder ejecutado correctamente');
}

module.exports = {
  ejecutarColoniaSeeder,
};
