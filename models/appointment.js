const mongoose = require('mongoose');

const appointmentSchema = mongoose.Schema({
    exam: {
        type: String,
        ref: 'Exam',
        required: true
    },

    date: {
        type: Date,
        default: Date.now
    },

    payment: {
        type: String,
        required: true
    },
    
    user: {
        type: String,
        ref: 'User',
        required: true
    }
});


const Appointment = mongoose.model('Appointment', appointmentSchema);
module.exports = Appointment;