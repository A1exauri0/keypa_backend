const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const prisma = require('./src/shared/db/prisma');
const routes = require('./src/routes');

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 3000);

const allowedOrigins = (process.env.FRONTEND_ORIGIN || 'http://localhost:5173')
	.split(',')
	.map((item) => item.trim())
	.filter(Boolean);

app.set('trust proxy', 1);
app.use(
	helmet({
		crossOriginResourcePolicy: { policy: 'cross-origin' },
	}),
);
app.use(
	cors({
		origin: allowedOrigins,
	}),
);
app.use(express.json({ limit: '1mb' }));

const storagePublicPath = path.join(__dirname, 'storage', 'app', 'public');
fs.mkdirSync(storagePublicPath, { recursive: true });

const staticOptions = {
	setHeaders: (res) => {
		res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
		res.setHeader('Access-Control-Allow-Origin', '*');
	},
};

app.use('/storage', express.static(storagePublicPath, staticOptions));

app.use(
	rateLimit({
		windowMs: 15 * 60 * 1000,
		max: 500,
		standardHeaders: true,
		legacyHeaders: false,
	}),
);

app.use(routes);

app.use((error, _req, res, _next) => {
	console.error(error);
	const status = Number(error.status || error.statusCode || 500);
	const message = error.message || 'Error interno del servidor';

	res.status(status).json({ message });
});

function esperar(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

async function conectarBaseConReintentos() {
	const maxIntentos = Number(process.env.DB_CONNECT_RETRIES || 15);
	const esperaMs = Number(process.env.DB_CONNECT_RETRY_DELAY_MS || 2000);

	for (let intento = 1; intento <= maxIntentos; intento += 1) {
		try {
			await prisma.$connect();
			console.log('Conexion a base de datos establecida');
			return;
		} catch (error) {
			if (intento === maxIntentos) {
				throw error;
			}

			console.warn(
				`Intento ${intento}/${maxIntentos} de conexion a BD fallido. Reintentando en ${esperaMs}ms...`,
			);
			await esperar(esperaMs);
		}
	}
}

async function start() {
	if (!process.env.JWT_SECRET) {
		throw new Error('Falta JWT_SECRET en el archivo .env');
	}

	await conectarBaseConReintentos();

	app.listen(port, () => {
		console.log(`API running on http://localhost:${port}`);
	});
}

start().catch((error) => {
	console.error('Failed to start server:', error);
	prisma.$disconnect().catch(() => null);
	process.exit(1);
});
