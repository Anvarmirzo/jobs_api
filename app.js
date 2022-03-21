require('dotenv').config();
require('express-async-errors');
const express = require('express');
const app = express();
//connect to database
const connectDB = require('./db/connect');
//routes
const authRoutes = require('./routes/auth');
const jobsRouter = require('./routes/jobs');
const authMiddleware = require('./middleware/authentication');
// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

// extra secure packages
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');

// Swagger
const swaggerUI = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');
const swaggerOptions = {
	explorer: true,
	validatorUrl: null
};


app.set('trust proxy', 1);
app.use(cookieParser());
app.use(rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false // Disable the `X-RateLimit-*` headers
}));
app.use(express.json());
app.use(morgan('combined'));
app.use(helmet());
app.use(cors());
app.use(xss());

app.get('/', (req, res) => {
	res.send('<h1>Welcome to Job-Board</h1><a href="/api-docs">Documentation</a>');
});
app.use(
	'/api-docs',
	function (req, res, next) {
		swaggerDocument.host = req.get('host');
		req.swaggerDoc = swaggerDocument;
		next();
	},
	swaggerUI.serve,
	swaggerUI.setup(null, swaggerOptions)
);
// routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/jobs', authMiddleware, jobsRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

(async () => {
	try {
		await connectDB();
		app.listen(port, () =>
			console.log(`Server is listening on port ${port}...`)
		);
	} catch (error) {
		console.log(error);
	}
})();

