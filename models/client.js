const mongoose = require('mongoose');
const Joi = require('joi');
const Exam = require('./exam')
const Schema = mongoose.Schema

                                 // ESSE PRECISA TRANFORMAR EM MODEL DE CLIENTS QUE AINDA NÃO ACESSAM O SITE
   //validação
   const clientSchemaValidation = Joi.object({
      name: Joi.string()
               .pattern(new RegExp('^[a-zA-Z0-9 ]{3,30}$'))
               .required(),
               
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

   //model de client
   const clientSchema = mongoose.Schema({
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
      timestamps: true,
   }
        );

   const Client = mongoose.model('Client', clientSchema);
   const validateClient = (clientData) => {
      return clientSchemaValidation.validate(clientData, {abortEarly: false});
   }

   module.exports = {
      Client,
      validateClient
   }

