require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const axios = require('axios');
const {User} = require('../models/client.js') ;
const RefreshT = require('../models/token.js'); 


//logando usuário user
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
   //jwt auth
      const userName = req.body.name;
      const jwtName = {name: userName};
      const accessToken = generateAccessToken(jwtName);
      const refreshToken = jwt.sign(jwtName, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '1d'});
      tokenAutoRefresh(2 * 60, refreshToken);
      res.status(200).json({accessToken: accessToken,
                           refreshToken: refreshToken,
                           user: user
                           });
      } catch (error){ 
         res.status(500).json({message: error.message});
      }
   }

// gerando access token
   function generateAccessToken(jwtName) {
      return jwt.sign(jwtName, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '120s'});
   }

// timer para reinciar o token 
   const tokenAutoRefresh = (expireTimeSeconds, refreshToken) => {
      const refreshTime = (expireTimeSeconds - 1 * 60) * 1000

      setTimeout(async () => {
         console.log('Attempting to refresh access token');
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

// calling refresh endpoin
   const callRefreshEndPoint = async (refreshToken) => {
      try {
         if(!refreshToken || refreshToken == null) {
            throw new Error ({message: Error.message});
         }
         // http request to endpoint
         const response = await axios.post('http://localhost:4080/api/users/auth/refresh', {
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

// Refresh token endpoint function
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
      } catch (error) {
         console.log('erro catch refresh')
         res.status(500).json({ message: error.message });
      }
         
   }

// logout
   const logout = async (req, res) => {
      try{
         const result = await RefreshT.deleteOne({userId: req.body._id})

         if(result.deletedCount === 0) {
            return res.status(404).json({message: 'User not logged'})
         }
         return res.status(200).json({message: 'refresh Token deleted successufuly'})
      } catch (error) {
         return res.status(500).json({message: error.message})
      }
   } 

/*
1 - criar rotas de autenticação para criar e deletear exames
*/

 module.exports = {
   logUser, 
   refresh,
   logout
 }