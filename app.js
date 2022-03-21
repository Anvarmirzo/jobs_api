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

// extra packages
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');


app.set('trust proxy', 1);
app.use(rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100 // limit each IP to 100 requests per windowMs
}));
app.use(cookieParser());
app.use(express.json());
app.use(morgan('combined'));
app.use(helmet());
app.use(cors());
app.use(xss());

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

