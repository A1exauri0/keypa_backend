const prisma = require('../../../src/shared/db/prisma');

const clientesBase = [
  {
    nombre: 'Cliente',
    apellidos: 'General',
    email: 'cliente.general@keypa.local',
    telefono: '9610000000',
    fechaNacimiento: '1990-01-01',
    genero: 'Masculino',
    direccion: 'Sin direccion',
    numeroExterior: 'S/N',
    numeroInterior: null,
    referencias: 'Cliente de venta mostrador',
    ciudad: 'Tuxtla Gutierrez',
    colonia: 'Centro',
  },
  {
    nombre: 'Jose',
    apellidos: 'Hernandez Ruiz',
    email: 'jose.hernandez@demo.mx',
    telefono: '9611001001',
    fechaNacimiento: '1989-02-14',
    genero: 'Masculino',
    direccion: 'Av Central Oriente',
    numeroExterior: '102',
    numeroInterior: null,
    referencias: 'Casa color crema frente a farmacia',
    ciudad: 'Tuxtla Gutierrez',
    colonia: 'Centro',
  },
  {
    nombre: 'Maria',
    apellidos: 'Lopez Gomez',
    email: 'maria.lopez@demo.mx',
    telefono: '9611001002',
    fechaNacimiento: '1992-06-21',
    genero: 'Femenino',
    direccion: 'Calle 5a Norte Poniente',
    numeroExterior: '45',
    numeroInterior: '2B',
    referencias: 'A un costado de papeleria',
    ciudad: 'Tuxtla Gutierrez',
    colonia: 'Las Arboledas',
  },
  {
    nombre: 'Juan',
    apellidos: 'Perez Sanchez',
    email: 'juan.perez@demo.mx',
    telefono: '9622002001',
    fechaNacimiento: '1986-11-03',
    genero: 'Masculino',
    direccion: 'Av 4a Sur',
    numeroExterior: '780',
    numeroInterior: null,
    referencias: 'Porton negro',
    ciudad: 'Tapachula',
    colonia: 'Centro',
  },
  {
    nombre: 'Guadalupe',
    apellidos: 'Martinez Morales',
    email: 'guadalupe.martinez@demo.mx',
    telefono: '9622002002',
    fechaNacimiento: '1995-09-09',
    genero: 'Femenino',
    direccion: 'Calle Los Laureles',
    numeroExterior: '15',
    numeroInterior: null,
    referencias: 'Frente a parque pequeno',
    ciudad: 'Tapachula',
    colonia: 'Los Laureles',
  },
  {
    nombre: 'Carlos',
    apellidos: 'Ramirez Diaz',
    email: 'carlos.ramirez@demo.mx',
    telefono: '9673003001',
    fechaNacimiento: '1990-01-27',
    genero: 'Masculino',
    direccion: 'Barrio de Guadalupe',
    numeroExterior: '221',
    numeroInterior: null,
    referencias: 'Casa con techo rojo',
    ciudad: 'San Cristobal de las Casas',
    colonia: 'Barrio de Guadalupe',
  },
  {
    nombre: 'Ana',
    apellidos: 'Castro Velazquez',
    email: 'ana.castro@demo.mx',
    telefono: '9673003002',
    fechaNacimiento: '1998-04-12',
    genero: 'Femenino',
    direccion: 'Calle Santa Lucia',
    numeroExterior: '90',
    numeroInterior: '1',
    referencias: 'Edificio de 3 pisos',
    ciudad: 'San Cristobal de las Casas',
    colonia: 'Santa Lucia',
  },
  {
    nombre: 'Miguel',
    apellidos: 'Dominguez Cruz',
    email: 'miguel.dominguez@demo.mx',
    telefono: '9634004001',
    fechaNacimiento: '1984-08-18',
    genero: 'Masculino',
    direccion: 'Calle Norte',
    numeroExterior: '33',
    numeroInterior: null,
    referencias: 'Cerca del mercado',
    ciudad: 'Comitan de Dominguez',
    colonia: 'Centro',
  },
  {
    nombre: 'Fernanda',
    apellidos: 'Nunez Aguilar',
    email: 'fernanda.nunez@demo.mx',
    telefono: '9634004002',
    fechaNacimiento: '1997-12-01',
    genero: 'Femenino',
    direccion: 'Colonia Guadalupe',
    numeroExterior: '55',
    numeroInterior: null,
    referencias: 'Porta macetas en entrada',
    ciudad: 'Comitan de Dominguez',
    colonia: 'Guadalupe',
  },
  {
    nombre: 'Ricardo',
    apellidos: 'Torres Mendez',
    email: 'ricardo.torres@demo.mx',
    telefono: '9165005001',
    fechaNacimiento: '1991-03-30',
    genero: 'Masculino',
    direccion: 'Av Pakal-Na',
    numeroExterior: '12',
    numeroInterior: null,
    referencias: 'Puerta azul',
    ciudad: 'Palenque',
    colonia: 'Pakal-Na',
  },
  {
    nombre: 'Daniela',
    apellidos: 'Flores Jimenez',
    email: 'daniela.flores@demo.mx',
    telefono: '9165005002',
    fechaNacimiento: '2000-07-25',
    genero: 'Femenino',
    direccion: 'Colonia Magisterial',
    numeroExterior: '8',
    numeroInterior: 'A',
    referencias: 'Frente a tienda de abarrotes',
    ciudad: 'Palenque',
    colonia: 'Magisterial',
  },
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

async function ejecutarClienteSeeder() {
  const emailsObjetivo = [];

  for (const cliente of clientesBase) {
    const ubicacion = await obtenerUbicacion(cliente.ciudad, cliente.colonia);

    emailsObjetivo.push(cliente.email);

    await prisma.cliente.upsert({
      where: { email: cliente.email },
      update: {
        nombre: cliente.nombre,
        apellidos: cliente.apellidos,
        telefono: cliente.telefono,
        fechaNacimiento: new Date(cliente.fechaNacimiento),
        genero: cliente.genero,
        direccion: cliente.direccion,
        numeroExterior: cliente.numeroExterior,
        numeroInterior: cliente.numeroInterior,
        referencias: cliente.referencias,
        codigoPostal: ubicacion.codigoPostal,
        idCiudad: ubicacion.idCiudad,
        idColonia: ubicacion.idColonia,
        activo: true,
      },
      create: {
        nombre: cliente.nombre,
        apellidos: cliente.apellidos,
        email: cliente.email,
        telefono: cliente.telefono,
        fechaNacimiento: new Date(cliente.fechaNacimiento),
        genero: cliente.genero,
        direccion: cliente.direccion,
        numeroExterior: cliente.numeroExterior,
        numeroInterior: cliente.numeroInterior,
        referencias: cliente.referencias,
        codigoPostal: ubicacion.codigoPostal,
        idCiudad: ubicacion.idCiudad,
        idColonia: ubicacion.idColonia,
        activo: true,
      },
    });
  }

  await prisma.cliente.deleteMany({
    where: {
      email: {
        notIn: emailsObjetivo,
      },
    },
  });

  console.log('ClienteSeeder ejecutado correctamente');
}

module.exports = {
  ejecutarClienteSeeder,
};
