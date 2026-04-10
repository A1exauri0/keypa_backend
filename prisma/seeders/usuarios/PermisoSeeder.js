const prisma = require('../../../src/shared/db/prisma');

const permisosBase = [
  {
    nombre: 'panel.ver',
    descripcion: 'Puede acceder al panel principal',
  },
  {
    nombre: 'usuarios.index',
    descripcion: 'Puede listar usuarios',
  },
  {
    nombre: 'usuarios.show',
    descripcion: 'Puede ver detalle de usuario',
  },
  {
    nombre: 'usuarios.store',
    descripcion: 'Puede crear usuarios',
  },
  {
    nombre: 'usuarios.update',
    descripcion: 'Puede actualizar usuarios',
  },
  {
    nombre: 'usuarios.destroy',
    descripcion: 'Puede eliminar usuarios',
  },
  {
    nombre: 'usuarios.asignar_roles',
    descripcion: 'Puede asignar roles a usuarios',
  },
  {
    nombre: 'usuarios.asignar_permisos',
    descripcion: 'Puede asignar permisos directos a usuarios',
  },
  {
    nombre: 'roles.index',
    descripcion: 'Puede listar roles',
  },
  {
    nombre: 'roles.show',
    descripcion: 'Puede ver detalle de rol',
  },
  {
    nombre: 'roles.store',
    descripcion: 'Puede crear roles',
  },
  {
    nombre: 'roles.update',
    descripcion: 'Puede actualizar roles',
  },
  {
    nombre: 'roles.destroy',
    descripcion: 'Puede eliminar roles',
  },
  {
    nombre: 'roles.asignar_permisos',
    descripcion: 'Puede asignar permisos a roles',
  },
  {
    nombre: 'permisos.index',
    descripcion: 'Puede listar permisos',
  },
  {
    nombre: 'permisos.show',
    descripcion: 'Puede ver detalle de permiso',
  },
  {
    nombre: 'permisos.store',
    descripcion: 'Puede crear permisos',
  },
  {
    nombre: 'permisos.update',
    descripcion: 'Puede actualizar permisos',
  },
  {
    nombre: 'permisos.destroy',
    descripcion: 'Puede eliminar permisos',
  },
  {
    nombre: 'marcas.index',
    descripcion: 'Puede listar marcas',
  },
  {
    nombre: 'marcas.show',
    descripcion: 'Puede ver detalle de marca',
  },
  {
    nombre: 'marcas.store',
    descripcion: 'Puede crear marcas',
  },
  {
    nombre: 'marcas.update',
    descripcion: 'Puede actualizar marcas',
  },
  {
    nombre: 'marcas.destroy',
    descripcion: 'Puede eliminar marcas',
  },
  {
    nombre: 'categorias.index',
    descripcion: 'Puede listar categorias',
  },
  {
    nombre: 'categorias.show',
    descripcion: 'Puede ver detalle de categoria',
  },
  {
    nombre: 'categorias.store',
    descripcion: 'Puede crear categorias',
  },
  {
    nombre: 'categorias.update',
    descripcion: 'Puede actualizar categorias',
  },
  {
    nombre: 'categorias.destroy',
    descripcion: 'Puede eliminar categorias',
  },
  {
    nombre: 'productos.index',
    descripcion: 'Puede listar productos',
  },
  {
    nombre: 'productos.show',
    descripcion: 'Puede ver detalle de producto',
  },
  {
    nombre: 'productos.store',
    descripcion: 'Puede crear productos',
  },
  {
    nombre: 'productos.update',
    descripcion: 'Puede actualizar productos',
  },
  {
    nombre: 'productos.destroy',
    descripcion: 'Puede eliminar productos',
  },
  {
    nombre: 'ciudades.index',
    descripcion: 'Puede listar ciudades',
  },
  {
    nombre: 'ciudades.show',
    descripcion: 'Puede ver detalle de ciudad',
  },
  {
    nombre: 'ciudades.store',
    descripcion: 'Puede crear ciudades',
  },
  {
    nombre: 'ciudades.update',
    descripcion: 'Puede actualizar ciudades',
  },
  {
    nombre: 'ciudades.destroy',
    descripcion: 'Puede eliminar ciudades',
  },
  {
    nombre: 'colonias.index',
    descripcion: 'Puede listar colonias',
  },
  {
    nombre: 'colonias.show',
    descripcion: 'Puede ver detalle de colonia',
  },
  {
    nombre: 'colonias.store',
    descripcion: 'Puede crear colonias',
  },
  {
    nombre: 'colonias.update',
    descripcion: 'Puede actualizar colonias',
  },
  {
    nombre: 'colonias.destroy',
    descripcion: 'Puede eliminar colonias',
  },
  {
    nombre: 'clientes.index',
    descripcion: 'Puede listar clientes',
  },
  {
    nombre: 'clientes.show',
    descripcion: 'Puede ver detalle de cliente',
  },
  {
    nombre: 'clientes.store',
    descripcion: 'Puede crear clientes',
  },
  {
    nombre: 'clientes.update',
    descripcion: 'Puede actualizar clientes',
  },
  {
    nombre: 'clientes.destroy',
    descripcion: 'Puede eliminar clientes',
  },
  {
    nombre: 'sucursales.index',
    descripcion: 'Puede listar sucursales',
  },
  {
    nombre: 'sucursales.show',
    descripcion: 'Puede ver detalle de sucursal',
  },
  {
    nombre: 'sucursales.store',
    descripcion: 'Puede crear sucursales',
  },
  {
    nombre: 'sucursales.update',
    descripcion: 'Puede actualizar sucursales',
  },
  {
    nombre: 'sucursales.destroy',
    descripcion: 'Puede eliminar sucursales',
  },
  {
    nombre: 'almacenes.index',
    descripcion: 'Puede listar almacenes',
  },
  {
    nombre: 'almacenes.show',
    descripcion: 'Puede ver detalle de almacen',
  },
  {
    nombre: 'almacenes.store',
    descripcion: 'Puede crear almacenes',
  },
  {
    nombre: 'almacenes.update',
    descripcion: 'Puede actualizar almacenes',
  },
  {
    nombre: 'almacenes.destroy',
    descripcion: 'Puede eliminar almacenes',
  },
  {
    nombre: 'inventarios.index',
    descripcion: 'Puede listar inventarios',
  },
  {
    nombre: 'inventarios.show',
    descripcion: 'Puede ver detalle de inventario',
  },
  {
    nombre: 'inventarios.store',
    descripcion: 'Puede crear inventarios',
  },
  {
    nombre: 'inventarios.update',
    descripcion: 'Puede actualizar inventarios',
  },
  {
    nombre: 'inventarios.destroy',
    descripcion: 'Puede eliminar inventarios',
  },
];

async function ejecutarPermisoSeeder() {
  for (const permiso of permisosBase) {
    await prisma.permiso.upsert({
      where: { nombre: permiso.nombre },
      update: {
        descripcion: permiso.descripcion,
      },
      create: {
        nombre: permiso.nombre,
        descripcion: permiso.descripcion,
      },
    });
  }

  await prisma.permiso.deleteMany({
    where: {
      nombre: {
        notIn: permisosBase.map((permiso) => permiso.nombre),
      },
    },
  });

  console.log('PermisoSeeder ejecutado correctamente');
}

module.exports = {
  ejecutarPermisoSeeder,
};
