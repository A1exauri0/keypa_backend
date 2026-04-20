const prisma = require('../../../shared/db/prisma');

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
			permisosDirectos: {
				include: {
					permiso: true,
				},
			},
		},
	});
}

async function buscarPorId(id) {
	return prisma.user.findUnique({
		where: { idUsuario: id },
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
			permisosDirectos: {
				include: {
					permiso: true,
				},
			},
		},
	});
}

async function contarUsuarios() {
	return prisma.user.count();
}

async function crearUsuarioConHash({ nombre, email, passwordHash, idRoles = [], idPermisos = [] }) {
	return prisma.user.create({
		data: {
			nombre,
			email,
			passwordHash,
			activo: true,
			roles: {
				create: idRoles.map((idRol) => ({
					rol: {
						connect: { idRol },
					},
				})),
			},
			permisosDirectos: {
				create: idPermisos.map((idPermiso) => ({
					permiso: {
						connect: { idPermiso },
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
			permisosDirectos: {
				include: {
					permiso: true,
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
			permisosDirectos: {
				include: {
					permiso: true,
				},
			},
		},
	});
}

async function obtenerUsuarioPorId(idUsuario) {
	return buscarPorId(idUsuario);
}

async function actualizarUsuario({ idUsuario, nombre, email, activo }) {
	const usuarioExistente = await prisma.user.findUnique({
		where: { idUsuario },
		select: { idUsuario: true },
	});

	if (!usuarioExistente) {
		return null;
	}

	return prisma.user.update({
		where: { idUsuario },
		data: {
			...(nombre !== undefined ? { nombre } : {}),
			...(email !== undefined ? { email } : {}),
			...(activo !== undefined ? { activo } : {}),
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
			permisosDirectos: {
				include: {
					permiso: true,
				},
			},
		},
	});
}

async function eliminarUsuario(idUsuario) {
	const usuarioExistente = await prisma.user.findUnique({
		where: { idUsuario },
		select: { idUsuario: true },
	});

	if (!usuarioExistente) {
		return null;
	}

	await prisma.user.delete({
		where: { idUsuario },
	});

	return true;
}

async function actualizarRolesUsuario({ idUsuario, idRoles = [] }) {
	await prisma.usuarioRol.deleteMany({ where: { idUsuario } });

	await prisma.usuarioRol.createMany({
		data: idRoles.map((idRol) => ({ idUsuario, idRol })),
		skipDuplicates: true,
	});
}

async function actualizarPermisosUsuario({ idUsuario, idPermisos = [] }) {
	await prisma.usuarioPermiso.deleteMany({ where: { idUsuario } });

	await prisma.usuarioPermiso.createMany({
		data: idPermisos.map((idPermiso) => ({ idUsuario, idPermiso })),
		skipDuplicates: true,
	});
}

async function existeUsuarioConEmail(email) {
	const usuario = await prisma.user.findUnique({
		where: { email },
		select: { idUsuario: true },
	});

	return Boolean(usuario);
}

/**
 * Guarda token hash y expiracion para recuperacion de contrasena.
 */
async function guardarTokenRecuperacion({ idUsuario, tokenHash, expiresAt }) {
	return prisma.user.update({
		where: { idUsuario },
		data: {
			resetPasswordTokenHash: tokenHash,
			resetPasswordExpiresAt: expiresAt,
		},
		select: {
			idUsuario: true,
			email: true,
		},
	});
}

/**
 * Busca un usuario con token de recuperacion vigente.
 */
async function buscarPorTokenRecuperacion({ email, tokenHash }) {
	return prisma.user.findFirst({
		where: {
			email,
			activo: true,
			resetPasswordTokenHash: tokenHash,
			resetPasswordExpiresAt: {
				gt: new Date(),
			},
		},
		select: {
			idUsuario: true,
			email: true,
		},
	});
}

/**
 * Actualiza contrasena y limpia token de recuperacion utilizado.
 */
async function actualizarPasswordConRecuperacion({ idUsuario, passwordHash }) {
	return prisma.user.update({
		where: { idUsuario },
		data: {
			passwordHash,
			resetPasswordTokenHash: null,
			resetPasswordExpiresAt: null,
		},
		select: {
			idUsuario: true,
			email: true,
		},
	});
}

module.exports = {
	buscarPorEmail,
	buscarPorId,
	contarUsuarios,
	crearUsuarioConHash,
	listarUsuarios,
	obtenerUsuarioPorId,
	actualizarUsuario,
	eliminarUsuario,
	actualizarRolesUsuario,
	actualizarPermisosUsuario,
	existeUsuarioConEmail,
	guardarTokenRecuperacion,
	buscarPorTokenRecuperacion,
	actualizarPasswordConRecuperacion,
};
