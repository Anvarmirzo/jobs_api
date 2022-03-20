const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'Please enter your name'],
		minlength: [3, 'Name must be at least 3 characters long'],
		maxlength: [50, 'Name must be less than 50 characters long']
	},
	email: {
		type: String,
		required: [true, 'Please enter your email'],
		unique: true,
		match: [/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Please enter a valid email'],
		minlength: [3, 'Email must be at least 3 characters long'],
		maxlength: [50, 'Email must be less than 50 characters long']

	},
	password: {
		type: String, required: true, minlength: [6, 'Password must be at least 6 characters long']
	},
	date: {
		type: Date, default: Date.now
	}
});

UserSchema.pre('save', async function () {
	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.createJWT = function () {
	return jwt.sign({userId: this._id, name: this.name}, process.env.JWT_SECRET, {expiresIn: '1d'});
};

UserSchema.methods.comparePassword = async function (password) {
	return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', UserSchema);