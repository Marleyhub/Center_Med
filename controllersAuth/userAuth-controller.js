require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const axios = require('axios');
const {User, validateUser} = require('../models/user.js');
const Exam = require('../models/exam.js')
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
      const {userId, name} = req.body
      const payload = {id: userId, name: name};
      const {accessToken, refreshToken} = generateTokens(payload)
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
   function generateTokens(payload) {
      const accessToken = generateAccessToken(payload)
      const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '1d'});
      tokenAutoRefresh(2 * 60, refreshToken)
      return ({accessToken, refreshToken})
   }

// generating access token
   function generateAccessToken(payload) {
      return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '120s'});
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
   
// Scheduling a exam
const schedule = async (req, res) => {
   try {
      const token = req.cookies['accessToken'];
      const { examId, appointmentDate } = req.body; // do something with appointmentDate
      const user = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET); 
      const userId = user.id;
   
      if (!token || !user) {
         return res.status(400).json({ message: 'Access token is missing' });
      }

      const updatedUser = await User.findByIdAndUpdate(userId,
         { $addToSet: { examId: examId } },
         { new: true }
      );

      if (!updatedUser) {
         return res.status(404).json({ message: 'User not found' });
      }

      res.status(200).json({ message: 'Exam scheduled successfully', user: updatedUser });
   } catch (error) {
      console.error('Error scheduling exam:', error);
      res.status(500).json({ message: error.message });
   }
};

// uncheck exam
   const uncheckExam = async (req, res) => {
      try {
         const token = req.cookies['accessToken']
         const {examId} = req.body
         const user = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
         const userId = user.id

         if(!user || !examId) {
            res.status(401).json({message: "User not found"})
         }

         const updatedUser = await User.findByIdAndUpdate(userId, 
            {$pull: {examId: examId}},
            {new: true}
         )
         
         res.status(200).json(updatedUser)
      } catch (error) {
         res.status(500).json({message: error.message})
      }
   }

// update exam 
   const updateExam = async (req, res) => {
   const token = req.cookies['accessToken'];
   const { payment, appointmentDate, examId } = req.body;

   try {
      if (!token) {
         return res.status(401).json({ message: 'No access token provided' });
      }

      const user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      if (!user) {
         return res.status(403).json({ message: 'Invalid token' });
      }

      const updatedExam = await Exam.findByIdAndUpdate(
         examId,
         { payment, appointmentDate, user: user.id },
         { new: true } // Return the updated document
      );

      if (!updatedExam) {
         return res.status(404).json({ message: 'Exam not found' });
      }

      res.status(200).json({ message: 'Exam updated', updatedExam });
   } catch (error) {
      res.status(500).json({ message: error.message });
   }
};

// print exam
   const printExam = async (req, res) => {
      try {
         const token = req.cookies['accessToken']
         const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
         if(!payload){
            return res.status(401).json({message: 'invalid token'})
         }
         const userId = payload.id
         const exams = await User.findExams(userId)
         if (!exams || exams.length === 0) {
            return res.status(404).json({ message: 'No exams found for this user' });
       }
         return res.status(200).json({exams})
      } catch (err) {
         res.status(500).json({message: error.message})
      } 
   } 
      

 
 module.exports = {
   logUser, 
   refresh,
   logout,
   getUsers,
   getUser,
   createUser,
   authenticateToken,
   schedule,
   uncheckExam,
   updateExam,
   printExam
 }