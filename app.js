require('dotenv').config();
require('express-async-errors');
const express = require('express');
const app = express();
//connect to database
const connectDB = require('./db/connect');
//routes
const authRoutes = require('./routes/auth');
const jonsRoutes = require('./routes/jobs');

// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

// extra packages
const cookieParser = require('cookie-parser');

app.use(cookieParser());
app.use(express.json());

// routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/jobs', jonsRoutes);

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

