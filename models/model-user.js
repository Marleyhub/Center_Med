const { Timestamp } = require('mongodb')
const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
         name: {
            typeof: String,
            required: true,
            
         },

         age: {
            typeof: Number,
            required: true,
            default: 0
         },

         adress: {
            typeof: String,
            required: true,

         },

         healthcare: {
            typeof: Boolean,
            default: null
         },
},
    {
        Timestamp: true,
    }
        );

        const User = mongoose.Schema('User', userSchema)
        module.exports = User

