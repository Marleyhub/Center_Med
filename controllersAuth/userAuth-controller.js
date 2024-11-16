require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const axios = require('axios');
const {User, validateUser} = require('../models/user.js') ;


                        // ESSA VAI SERVIR PRA MANIPULAR REQUISIÇÕES DE USUARIO 
// listando usuários 
   const getUsers = async (req, res) => {
      try {
         const users = await User.find({})
         res.status(200).json(users)
      } catch (error) {
         res.status(500).json({message: error.message}) 
      }
   }

// listando usuário
   const getUser = async (req,res) => {
      const {id} = req.body
      try {
         const user = await User.findById(id)
         res.status(200).json(user)
      } catch (error) {
         res.status(500).json({message: error.message})
      }
   }
   
// logando usuário user
   const logUser = async (req, res) => {
      const user = await User.findOne({name: req.body.name});
      if (user == null || !user || user == false) {
         return res.status(400).send('Cannot find')
      }
      try {
         const isMatch = await bcrypt.compare( req.body.password, user.password);
         if(!isMatch) {
            return res.status(400).send('Keys or username incorrect');
         }
   // jwt auth
      const userName = req.body.name;
      const name = {name: userName};
      const {accessToken, refreshToken} = generateTokens(name)
      res.status(200).cookie('refreshToken', 'Bearer ' + refreshToken)
                     .cookie('accessToken', accessToken)
                     .json('loged')
      return
      } catch (error){ 
         res.status(500).json({message: error.message});
      }
   }
//jwt function 
   function generateTokens(name) {
      const accessToken = generateAccessToken(name)
      const refreshToken = jwt.sign(name, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '1d'});
      tokenAutoRefresh(2 * 60, refreshToken)
      return ({accessToken, refreshToken})
   }

// gerando access token
   function generateAccessToken(name) {
      return jwt.sign(name, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '120s'});
   }

// timer para reinciar o token 
   const tokenAutoRefresh = (expireTimeSeconds, refreshToken) => {
      const refreshTime = (expireTimeSeconds - 1 * 60) * 1000
      setTimeout(async () => {
         try {
            const newAccessToken = await callRefreshEndPoint(refreshToken);
            if (newAccessToken) {
               tokenAutoRefresh(2 * 60, refreshToken);
               console.log('New access token received:', newAccessToken);
            }
            return 
         } catch (error) {
            return console.log('Erro no timer',error)
         }
      }, refreshTime)

   }

// calling refresh endpoint
   const callRefreshEndPoint = async (refreshToken) => {
      try {
         if(!refreshToken || refreshToken == null) {
            throw new Error ({message: Error.message});
         }
         // http request to endpoint
         const response = await axios.post('http://localhost:4080/api/user/auth/refresh', {
            token: refreshToken
         });
      
         if(response.status === 200) {
            const newAccessToken = response.data.accessToken
            return newAccessToken;
         } else {
            throw new Error ('Faild to refresh Token')
         }
      } catch (error) {
         console.error(`Error calling endpoint:`, error.message)
      }
   
   }

// Refresh token endpoint 
   const refresh = async (req, res) => {
      try{
         const token = req.body.token
         if(!token || token == null) {
            return res.status(401).json('Access denied');
         }
         jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
            if(err) return console.log('Error to refresh token')
            const accessToken = generateAccessToken({name: user.name})
            return res.status(200).json({accessToken: accessToken});
            }
         )
      console.log('refresh')
      } catch (error) {
         console.log('erro catch refresh')
         res.status(500).json({ message: error.message });
      }
         
   }

// logout
   const logout = async (req, res) => {
    try{
      res.status(200).clearCookie('refreshToken')
                     .clearCookie('accessToken')
                     .json('logged out')
    } catch (error) {
      res.status(500).json({message: error.message})
    }
   } 

//Autenticando token de usuário 
   function authenticateToken(req, res, next) {
      const authHeader = req.headers['authorization'];
      const token = authHeader && authHeader.split(' ')[1]
      if(token == null) return res.sendStatus(401)
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
         if (err) return res.sendStatus(403)
         next()
      })
      }

 module.exports = {
   logUser, 
   refresh,
   logout,
   getUsers,
   getUser,
   authenticateToken
 }