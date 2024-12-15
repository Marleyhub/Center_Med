require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const axios = require('axios');
const {User, validateUser} = require('../models/user.js') ;
const saltRounds = 10


   
// log user
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
      const {userId} = req.body
      const id = {id: userId};
      const {accessToken, refreshToken} = generateTokens(id)
      res.status(200).cookie('refreshToken', 'Bearer ' + refreshToken)
                     .cookie('accessToken', accessToken)
                     .json('logged in')
      return
      } catch (error){ 
         res.status(500).json({message: error.message});
      }
   }

// getting all users
   const getUsers = async (req, res) => {
      try {
         const users = await User.find({})
         res.status(200).json(users)
      } catch (error) {
         res.status(500).json({message: error.message}) 
      }
   }

// getting one user
   const getUser = async (req,res) => {
      const {id} = req.body
      try {
         const user = await User.findById(id)
         res.status(200).json(user)
      } catch (error) {
         res.status(500).json({message: error.message})
      }
   }
// creating user 
const createUser = async (req, res) => {
   try{
      const {error, value} = validateUser(req.body)
      if(error) {
         return res.status(400).json({error: error.details.map(d => d.message)})
      }
      //hashing password
      const salt = await bcrypt.genSalt(saltRounds)
      const hashedPassword = await bcrypt.hash(req.body.password, salt)
   
      const user = User.create({
         name: value.name,
         age: value.age,
         password: hashedPassword,
         healthcare: value.healthcare,
         address: value.address
      })
      res.status(200).json(value)
   }catch (error){
      res.status(500).json({message: error.message})
   }
}

// jwt function 
   function generateTokens(id) {
      const accessToken = generateAccessToken(id)
      const refreshToken = jwt.sign(id, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '240s'});
      tokenAutoRefresh(2 * 60, refreshToken)
      return ({accessToken, refreshToken})
   }

// generating access token
   function generateAccessToken(id) {
      return jwt.sign(id, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '120s'});
   }

// timer to reset token 
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

// authenticanting user token
   function authenticateToken(req, res, next) {
      const authHeader = req.headers['authorization'];
      const token = authHeader && authHeader.split(' ')[1]
      if(token == null) return res.sendStatus(401)
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
         if (err) return res.sendStatus(403)
         next()
      })
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
  
// Schedualing a exam
const schedual = async (req, res) => {
   const token = req.cookies['accessToken']
   const {examId} = req.body 
   
   jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if(!user) console.log('Error in the exam schedual')
         const userId = user.id

      User.findByIdAndUpdate(userId,
         { $addToSet: { examId: examId } },
         { new: true }
         )
         .then(updatedUser => console.log("Updated user:", updatedUser))
         .catch(err => console.error("Error updating user:", err));
   }
   )
}
 
 module.exports = {
   logUser, 
   refresh,
   logout,
   getUsers,
   getUser,
   createUser,
   authenticateToken,
   schedual
 }