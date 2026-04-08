const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const prisma = require('./config/prisma');
const routes = require('./routes/routes');

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 3000);

const allowedOrigins = (process.env.FRONTEND_ORIGIN || 'http://localhost:5173')
	.split(',')
	.map((item) => item.trim())
	.filter(Boolean);

app.set('trust proxy', 1);
app.use(helmet());
app.use(
	cors({
		origin: allowedOrigins,
	}),
);
app.use(express.json({ limit: '1mb' }));
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
	res.status(500).json({ message: 'Error interno del servidor' });
});

async function start() {
	if (!process.env.JWT_SECRET) {
		throw new Error('Falta JWT_SECRET en el archivo .env');
	}

	await prisma.$connect();

	app.listen(port, () => {
		console.log(`API running on http://localhost:${port}`);
	});
}

start().catch((error) => {
	console.error('Failed to start server:', error);
	prisma.$disconnect().catch(() => null);
	process.exit(1);
});
