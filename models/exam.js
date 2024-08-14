const mongoose = require('mongoose');

const examSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    duration: {
        type: String,
        required: true
    },

    about: {
        type: String,
        Required: true
    }
})

const Exam = mongoose.model('Exam', examSchema);
module.exports = Exam;