   require('dotenv').config()
   const {Client, validateClient} = require('../models/client.js');
   const bcrypt = require('bcrypt');
   const jwt = require('jsonwebtoken')

   const saltRounds = 10 


                                            // ESSA CONTINUA IGUAL SERÃO AS AÇOES QUE O ADM_USER ATRAVES DA ROTA DELE 

                                            
// Listar usuários user
   const getClients =  async (req,res) => {
         try{
            const clients = await Client.find({});
            res.status(200).json(clients);
         } catch(error) {
               res.status(500).json({message: error.message});
         }
      }
   
// Listar usuário
   const getClient = async (req,res) => {  

      try{
         const {id} = req.params;
         const client = await Client.findById(id);
         res.status(200).json(client);
      } catch (error) {
         res.status(500).json({message: error.message});
      }
   }

// Criar usuário
   const createClient = async (req,res) => {
      try{
      //validação
         const {error, value} = validateClient(req.body);
         if (error) {
            return res.status(400).json({error: error.details.map(d => d.message)}) 
         }
      //hash de senha
         const salt = await bcrypt.genSalt(saltRounds)
         const hashedPassword = await bcrypt.hash(req.body.password, salt)
   
         const client = await Client.create({
            name: value.name,
            address: value.address,
            healthcare: value.healthcare,
            age: value.age,
            password: hashedPassword
      });
      res.status(200).json(client);
      } catch (error) {
      res.status(500).json({message: error.message});
      }
   }

//Editar usuário
   const updateClient = async (req,res) => {
      try{
         const clientData = req.body
         if(!clientData || Object.keys(clientData).length == 0) {
            return res.status(400).json({message: 'No data Provided to update'});    
         }

         const {id} = req.params;
         const {name, address, healthcare, age} = req.body
         const client =  await Client.findByIdAndUpdate(id, 
            {
               name: name, 
               address: address, 
               healthcare: healthcare, 
               age: age
            },
            {new: true});

         if (!client) {
            return res.status(404).json({message: "Product not Found"})
         }

         res.status(200).json(client);
      } catch (error) {
         res.status(500).json({message: error.message});
      }
   }

//Deletar usuário
   const deleteClient = async (req,res) => {
      try{
         const {id} = req.params;
         const deletedData = await Client.findByIdAndDelete(id)
         if(!deletedData) {
            return res.status(400).json({message:'No data provided to delete'})
      }
         res.status(200).json(deletedData)
      }catch (error) {
         res.status(500).json({message: error.message});
      }
   }


   module.exports = {
      getClient,
      getClients,
      createClient,
      updateClient,
      deleteClient
   }
