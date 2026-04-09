const prisma = require('../../../shared/db/prisma');
const { buscarPermisosPorNombre } = require('./Permiso');

async function listarRoles() {
  return prisma.rol.findMany({
    orderBy: { nombre: 'asc' },
    include: {
      permisos: {
        include: { permiso: true },
      },
    },
  });
}

async function obtenerRolPorId(idRol) {
  return prisma.rol.findUnique({
    where: { idRol },
    include: {
      permisos: {
        include: { permiso: true },
      },
    },
  });
}

async function crearRol({ nombre, descripcion = null, permisos = [] }) {
  const permisosDb = await buscarPermisosPorNombre(permisos);

  return prisma.rol.create({
    data: {
      nombre,
      descripcion,
      permisos: {
        create: permisosDb.map((permiso) => ({
          permiso: {
            connect: { idPermiso: permiso.idPermiso },
          },
        })),
      },
    },
    include: {
      permisos: {
        include: { permiso: true },
      },
    },
  });
}

async function actualizarRol({ idRol, nombre, descripcion }) {
  const rolExistente = await prisma.rol.findUnique({
    where: { idRol },
    select: { idRol: true },
  });

  if (!rolExistente) {
    return null;
  }

  return prisma.rol.update({
    where: { idRol },
    data: {
      ...(nombre !== undefined ? { nombre } : {}),
      ...(descripcion !== undefined ? { descripcion } : {}),
    },
    include: {
      permisos: {
        include: { permiso: true },
      },
    },
  });
}

async function eliminarRol(idRol) {
  const rolExistente = await prisma.rol.findUnique({
    where: { idRol },
    select: { idRol: true },
  });

  if (!rolExistente) {
    return null;
  }

  await prisma.rol.delete({ where: { idRol } });
  return true;
}

async function asignarPermisosARol({ idRol, permisos }) {
  const permisosDb = await buscarPermisosPorNombre(permisos);

  if (permisosDb.length === 0) {
    throw new Error('No se encontraron permisos validos para asignar al rol');
  }

  await prisma.rolPermiso.deleteMany({ where: { idRol } });

  await prisma.rolPermiso.createMany({
    data: permisosDb.map((permiso) => ({
      idRol,
      idPermiso: permiso.idPermiso,
    })),
    skipDuplicates: true,
  });

  return obtenerRolPorId(idRol);
}

async function buscarRolesPorNombre(nombres) {
  if (!Array.isArray(nombres) || nombres.length === 0) {
    return [];
  }

  return prisma.rol.findMany({
    where: {
      nombre: { in: nombres },
    },
  });
}

module.exports = {
  listarRoles,
  obtenerRolPorId,
  crearRol,
  actualizarRol,
  eliminarRol,
  asignarPermisosARol,
  buscarRolesPorNombre,
};
