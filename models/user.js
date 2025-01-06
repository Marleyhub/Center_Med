const mongoose = require('mongoose');
const Joi = require('joi');
const Exam = require('./exam');
const Schema = mongoose.Schema

// validation
   const userSchemaValidation = Joi.object({
      name: Joi.string()
               .pattern(new RegExp('^[a-zA-Z0-9 ]{3,30}$'))
               .required(),

      password: Joi.string()
                   .pattern(new RegExp('^[a-zA-Z0-9$./]{0,8}$')),

      age: Joi.number()
              .integer()
              .min(0)
              .max(150)
              .required(),

      address: Joi.string()
                  .min(10)
                  .max(150)
                  .required(),

      healthcare: Joi.boolean()
                     .default(null),
   }) 

// user model
   const userSchema = mongoose.Schema({
         name: {
            type: String,
            required: true,
         },

         age: {
            type: Number,
            required: true
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
         },

         examId: [{
            type: Schema.Types.ObjectId,
            ref: 'Exam',
            default: null
         }]
   },
   
   {
      timestamp: true,
   }
        );

   userSchema.statics.findExams = async function (userId) {
      try {
         const user = await this.findById(userId)
         if (!user) {
            throw new Error('user not found')
         }
         return user.examId
      }  catch (error) {
            throw new Error (error)
      }
   }

   const User = mongoose.model('User', userSchema);
   const validateUser = (userData) => {
      return userSchemaValidation.validate(userData, {abortEarly: false});
   }

   module.exports = {
      User,
      validateUser
   }

