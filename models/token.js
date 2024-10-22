const mongoose = require('mongoose');
//const bcrypt = require('bcrypt');

const refreshTokenSchema = new mongoose.Schema ({
    
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },

    token: {
        type: String,
        required: true
    },
    
    expireDate: {
        type: Date,
        required: true
    }
})

const RefreshT = mongoose.model('RefreshT', refreshTokenSchema);
module.exports = RefreshT;