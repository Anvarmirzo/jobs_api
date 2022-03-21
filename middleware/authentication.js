const User = require('../models/User');
const jwt = require('jsonwebtoken');
const {UnauthenticatedError} = require('../errors');

const auth = (req, res, next) => {
	const token = req.cookies.Authorization;
	if (!token) throw new UnauthenticatedError('No token provided');
	try {
		const payload = jwt.verify(token, process.env.JWT_SECRET);
		req.user = {userId: payload.userId, name: payload.name};
		next();
	} catch (err) {
		throw new UnauthenticatedError('Invalid token');
	}
};

module.exports = auth;