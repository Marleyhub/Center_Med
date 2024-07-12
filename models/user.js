const { Timestamp } = require('mongodb')
const mongoose = require('mongoose')

   const userSchema = mongoose.Schema({
         name: {
            type: String,
            required: true,
            
         },

         age: {
            type: Number,
            required: true,
            default: 0
         },

         address: {
            type: String,
            required: true,

         },

         healthcare: {
            type: Boolean,
            default: null
         },
   },
   
    {
        timestamp: true,
    }
        );

        const User = mongoose.model('User', userSchema)
        module.exports = User

