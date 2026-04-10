const nodemailer = require('nodemailer');

let transporterCache = null;

/**
 * Construye o reutiliza el transporter SMTP segun variables de entorno.
 */
function obtenerTransporter() {
  if (transporterCache) {
    return transporterCache;
  }

  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    return null;
  }

  const port = Number(process.env.SMTP_PORT || 587);
  const secure = String(process.env.SMTP_SECURE || 'false') === 'true';

  transporterCache = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
  });

  return transporterCache;
}

/**
 * Envia un correo de recuperacion de contrasena o imprime el enlace en consola como fallback.
 */
async function enviarCorreoRecuperacion({ to, nombre, link }) {
  const transporter = obtenerTransporter();
  const from = process.env.SMTP_FROM || 'Keypa Outlet <no-reply@keypa.local>';
  const saludo = nombre ? `Hola ${nombre},` : 'Hola,';

  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111827;max-width:640px;margin:auto;">
      <h2 style="margin-bottom:12px;">Recuperacion de contrasena</h2>
      <p>${saludo}</p>
      <p>Recibimos una solicitud para restablecer tu contrasena.</p>
      <p>
        <a href="${link}" style="display:inline-block;padding:10px 16px;border-radius:10px;background:#7c3aed;color:#ffffff;text-decoration:none;font-weight:700;">
          Restablecer contrasena
        </a>
      </p>
      <p>Si no solicitaste este cambio, puedes ignorar este correo.</p>
      <p style="font-size:12px;color:#6b7280;">Este enlace expira en 60 minutos.</p>
    </div>
  `;

  const text = `${saludo}\n\nRecibimos una solicitud para restablecer tu contrasena.\n\nUsa este enlace:\n${link}\n\nSi no solicitaste este cambio, ignora este mensaje.`;

  if (!transporter) {
    console.info(`[password-reset] SMTP no configurado. Enlace para ${to}: ${link}`);
    return { mode: 'console' };
  }

  try {
    await transporter.sendMail({
      from,
      to,
      subject: 'Recuperacion de contrasena - Keypa Outlet',
      html,
      text,
    });

    return { mode: 'smtp' };
  } catch (error) {
    console.error('[password-reset] Error SMTP. Se usara fallback por consola.', {
      code: error.code,
      responseCode: error.responseCode,
      command: error.command,
    });
    console.info(`[password-reset] Enlace fallback para ${to}: ${link}`);
    return { mode: 'console' };
  }
}

module.exports = {
  enviarCorreoRecuperacion,
};
