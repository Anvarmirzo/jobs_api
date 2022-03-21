const mongoose = require('mongoose');

const JobsSchema = new mongoose.Schema({
	company: {
		type: String,
		required: [true, 'Company name is required'],
		maxlength: [50, 'Company name must be less than 50 characters']
	},
	position: {
		type: String,
		required: [true, 'Position name is required'],
		maxlength: [100, 'Position name must be less than 100 characters']
	},
	status: {
		type: String,
		enum: ['interview', 'declined', 'pending'],
		default: 'pending'
	},
	createdBy: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: [true, 'User is required']
	}
}, {timestamps: true});

module.exports = mongoose.model('Job', JobsSchema);