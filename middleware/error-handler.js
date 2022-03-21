const {StatusCodes} = require('http-status-codes');
const errorHandlerMiddleware = (err, req, res, next) => {
	let customError = {
		statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
		message: err.message || 'Internal server error'
	};

	if (err.name === 'ValidationError') {
		customError.statusCode = StatusCodes.BAD_REQUEST;
		customError.message = err.message;
		customError.errors = err.errors;
	}


	if (err.code && err.code === 11000) {
		customError.message = `Duplicate value for ${Object.keys(err.keyValue)} field, please use another value`;
		customError.statusCode = StatusCodes.BAD_REQUEST;
	}

	if (err.name === 'CastError') {
		customError.message = `Invalid ${err.path} value: ${err.value}`;
		customError.statusCode = StatusCodes.BAD_REQUEST;
	}

	return res.status(customError.statusCode).json({message: customError.message});
};

module.exports = errorHandlerMiddleware;
