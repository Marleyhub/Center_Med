   require('dotenv').config()

   const {User, validateUSer} = require('../models/user.js');
   const bcrypt = require('bcrypt');
   //const { application } = require('express');
   const jwt = require('jsonwebtoken')

   const saltRounds = 10

   // Listar usuários
   const getUsers =  async (req,res) => {
         try{
            const users = await User.find({});
            res.status(200).json(users);
         } catch(error) {
               res.status(500).json({message: error.message});
         }
      }
   
   // Listar usuário
   const getUser = async (req,res) => {  

      try{
         const {id} = req.params;
         const user = await User.findById(id);
         res.status(200).json(user);
      }  catch (error) {
            res.status(500).json({message: error.message});
      }
   }

   // Criar usuário
   const createUser = async (req,res) => {
      try{
         //validação
         const {error, value} = validateUSer(req.body);
         if (error) {
            return res.status(400).json({error: error.details.map(d => d.message)}) 
         }
         //hash de senha
         const salt = await bcrypt.genSalt(saltRounds)
         const hashedPassword = await bcrypt.hash(req.body.password, salt)
   
         const user = await User.create({
            name: value.name,
            address: value.address,
            healthcare: value.healthcare,
            age: value.age,
            password: hashedPassword
      });
      res.status(200).json(user);
      } catch (error) {
      res.status(500).json({message: error.message});
      }
   }

   //Editar usuário
   const updateUser = async (req,res) => {
      try{
         const updateUserData = req.body
         if(!updateUserData || Object.keys(updateUserData).length == 0) {
            return res.status(400).json({message: 'No data Provided to update'});    
         }

         const {id} = req.params;
         const {name, address, healthcare, age} = req.body
         const user =  await User.findByIdAndUpdate(id, 
            {
               name: name, 
               address: address, 
               healthcare: healthcare, 
               age: age
            },
            {new: true});

         if (!user) {
            return res.status(404).json({message: "Product not Found"})
         }

         res.status(200).json(user);
      } catch (error) {
         res.status(500).json({message: error.message});
      }
   }

   //Deletar usuário
   const deleteUser = async (req,res) => {
      try{
         const {id} = req.params;
         const deletedData = await User.findByIdAndDelete(id)
         if(!deletedData) {
            return res.status(400).json({message:'No data provided to delete'})
      }
         res.status(200).json(deletedData)
      }catch (error) {
         res.status(500).json({message: error.message});
      }
   }

   
   //Autenticando token de usuário 
   function authenticateToken(req, res, next) {
      const authHeader = req.headers['authorization'];
      const token = authHeader && authHeader.split(' ')[1]
      if(token == null) return res.sendStatus(401)

      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, jwtName) => {
         if (err) return res.sendStatus(403)
         //req.user = user
         next()
      })
      }

   module.exports = {
      getUsers,
      getUser,
      createUser,
      updateUser,
      deleteUser,
      authenticateToken
   }
