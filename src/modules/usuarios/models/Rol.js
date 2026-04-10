const prisma = require('../../../shared/db/prisma');

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

async function crearRolConPermisosIds({ nombre, descripcion = null, idPermisos = [] }) {
  return prisma.rol.create({
    data: {
      nombre,
      descripcion,
      permisos: {
        create: idPermisos.map((idPermiso) => ({
          permiso: {
            connect: { idPermiso },
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

async function actualizarPermisosRol({ idRol, idPermisos = [] }) {
  await prisma.rolPermiso.deleteMany({ where: { idRol } });

  await prisma.rolPermiso.createMany({
    data: idPermisos.map((idPermiso) => ({
      idRol,
      idPermiso,
    })),
    skipDuplicates: true,
  });
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
  crearRolConPermisosIds,
  actualizarRol,
  eliminarRol,
  actualizarPermisosRol,
  buscarRolesPorNombre,
};
