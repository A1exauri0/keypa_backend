const bcrypt = require('bcryptjs');
const prisma = require('../config/prisma');
const { buscarRolesPorNombre } = require('./Rol');

function mapearUsuarioAuth(user) {
  const roles = (user.roles || []).map((item) => item.rol?.nombre).filter(Boolean);

  const permisosSet = new Set();
  (user.roles || []).forEach((item) => {
    (item.rol?.permisos || []).forEach((rp) => {
      if (rp.permiso?.nombre) {
        permisosSet.add(rp.permiso.nombre);
      }
    });
  });

  return {
    id: user.id,
    nombre: user.nombre,
    email: user.email,
    activo: user.activo,
    roles,
    permisos: Array.from(permisosSet),
  };
}

async function buscarPorEmail(email) {
  return prisma.user.findUnique({
    where: { email },
    include: {
      roles: {
        include: {
          rol: {
            include: {
              permisos: {
                include: { permiso: true },
              },
            },
          },
        },
      },
    },
  });
}

async function buscarPorId(id) {
  return prisma.user.findUnique({
    where: { id },
    include: {
      roles: {
        include: {
          rol: {
            include: {
              permisos: {
                include: { permiso: true },
              },
            },
          },
        },
      },
    },
  });
}

async function contarUsuarios() {
  return prisma.user.count();
}

async function crearUsuario({ nombre, email, password, roles = ['editor'] }) {
  const passwordHash = await bcrypt.hash(password, 12);
  const rolesDb = await buscarRolesPorNombre(roles);

  if (rolesDb.length === 0) {
    throw new Error('No se encontraron roles validos para el usuario');
  }

  return prisma.user.create({
    data: {
      nombre,
      email,
      passwordHash,
      activo: true,
      roles: {
        create: rolesDb.map((rol) => ({
          rol: {
            connect: { id: rol.id },
          },
        })),
      },
    },
    include: {
      roles: {
        include: {
          rol: {
            include: {
              permisos: {
                include: { permiso: true },
              },
            },
          },
        },
      },
    },
  });
}

async function listarUsuarios() {
  return prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      roles: {
        include: {
          rol: {
            include: {
              permisos: {
                include: { permiso: true },
              },
            },
          },
        },
      },
    },
  });
}

async function asignarRolesAUsuario({ userId, roles }) {
  const rolesDb = await buscarRolesPorNombre(roles);

  if (rolesDb.length === 0) {
    throw new Error('No se encontraron roles validos para asignar');
  }

  await prisma.usuarioRol.deleteMany({ where: { userId } });

  await prisma.usuarioRol.createMany({
    data: rolesDb.map((rol) => ({ userId, rolId: rol.id })),
    skipDuplicates: true,
  });

  return buscarPorId(userId);
}

async function existeUsuarioConEmail(email) {
  const usuario = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });

  return Boolean(usuario);
}

module.exports = {
  buscarPorEmail,
  buscarPorId,
  contarUsuarios,
  crearUsuario,
  listarUsuarios,
  asignarRolesAUsuario,
  existeUsuarioConEmail,
  mapearUsuarioAuth,
};
