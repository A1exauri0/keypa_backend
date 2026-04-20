const fs = require('fs');
const path = require('path');
const multer = require('multer');

const allowedImageMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

// Normaliza un segmento de ruta para evitar caracteres invalidos.
function sanitizarSegmento(value, fallback) {
  const segment = String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-_]/g, '-');

  return segment || fallback;
}

// Crea un middleware de upload de imagen reutilizable para cualquier modulo.
function crearImageUpload({ folder = 'general', prefix = 'image', maxSizeMb = 5 } = {}) {
  const safeFolder = sanitizarSegmento(folder, 'general');
  const safePrefix = sanitizarSegmento(prefix, 'image');
  const uploadDir = path.join(process.cwd(), 'storage', 'app', 'public', safeFolder);

  fs.mkdirSync(uploadDir, { recursive: true });

  const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
      cb(null, uploadDir);
    },
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname || '').toLowerCase();
      const safeName = `${safePrefix}-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
      cb(null, safeName);
    },
  });

  const fileFilter = (_req, file, cb) => {
    if (allowedImageMimeTypes.includes(file.mimetype)) {
      cb(null, true);
      return;
    }

    const error = new Error('Solo se permiten imagenes JPG, PNG, WEBP o GIF');
    error.status = 400;
    cb(error, false);
  };

  return multer({
    storage,
    fileFilter,
    limits: {
      fileSize: maxSizeMb * 1024 * 1024,
    },
  });
}

module.exports = {
  crearImageUpload,
};
