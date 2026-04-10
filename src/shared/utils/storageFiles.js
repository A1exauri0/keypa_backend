const fs = require('fs/promises');
const path = require('path');

// Convierte una URL publica de archivo a ruta relativa dentro de storage publico.
function obtenerPathRelativoStorageDesdeUrl(url) {
  if (!url || typeof url !== 'string') {
    return null;
  }

  let normalized = url;

  if (normalized.startsWith('http://') || normalized.startsWith('https://')) {
    try {
      normalized = new URL(normalized).pathname;
    } catch (_error) {
      return null;
    }
  }

  if (normalized.startsWith('/storage/')) {
    return normalized.replace('/storage/', '');
  }

  if (normalized.startsWith('/uploads/')) {
    return normalized.replace('/uploads/', '');
  }

  return null;
}

// Elimina archivos fisicos locales asociados a una lista de URLs publicas.
async function eliminarArchivosLocalesPorUrl(urls = []) {
  if (!Array.isArray(urls) || urls.length < 1) {
    return;
  }

  const baseStorage = path.join(process.cwd(), 'storage', 'app', 'public');

  await Promise.all(
    urls.map(async (url) => {
      const relativePath = obtenerPathRelativoStorageDesdeUrl(url);
      if (!relativePath) {
        return;
      }

      const absolutePath = path.join(baseStorage, relativePath);

      try {
        await fs.unlink(absolutePath);
      } catch (error) {
        if (error.code !== 'ENOENT') {
          throw error;
        }
      }
    }),
  );
}

module.exports = {
  obtenerPathRelativoStorageDesdeUrl,
  eliminarArchivosLocalesPorUrl,
};
