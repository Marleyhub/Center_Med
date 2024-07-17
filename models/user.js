const { Timestamp } = require('mongodb');
const mongoose = require('mongoose');
const Joi = require('joi');


   const userSchemaValidation = Joi.object({
      name: Joi.string()
               .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
               .required(),

      password: Joi.string()
                   .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),

      age: Joi.number().integer().min(0).max(150).required(),

      address: Joi.string().min(10).max(150).required(),

      healthcare: Joi.boolean().default(null),
      
   }) 


   const userSchema = mongoose.Schema({
         name: {
            type: String,
            required: true,
         },

         age: {
            type: Number,
         },

         address: {
            type: String,
            required: true,

         },
         password: {
            type: String,
            required: true,
         },

         healthcare: {
            type: Boolean,
            default: null
         }
   },
   
   {
      timestamp: true,
   }
        );

   const User = mongoose.model('User', userSchema);
   const validateUSer = (userData) => {
      return userSchemaValidation.validate(userData, {abortEarly: false});
   }

   module.exports = {
      User,
      validateUSer
   }

