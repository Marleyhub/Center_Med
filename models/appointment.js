const mongoose = require('mongoose');

const appointmentSchema = mongoose.Schema({
    examId: {
        type: mongoose.Schema.Types.ObjectId,
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
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});


const Appointment = mongoose.model('Appointment', appointmentSchema);
module.exports = Appointment;