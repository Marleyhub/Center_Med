//const { string } = require('joi');
const mongoose = require('mongoose');

const examSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    about: {
        type: String,
        Required: true
    },

    appointmentDate: {
        type: Date,
        required: true
    },

    payment: {
        type: String,
        required: true
    },
    
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});


const Exam = mongoose.model('Exam', examSchema);
module.exports = Exam;