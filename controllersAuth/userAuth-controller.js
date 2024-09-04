require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')
const {User} = require('../models/user.js')

// logando usuário
const logUser = async (req,res) => {
      
    const user = await User.findOne({name: req.body.name, });
    if (user == null || !user || user == false) {
       return res.status(400).send('Cannot find')
    }

    try {
       const isMatch = await bcrypt.compare( req.body.password, user.password)
       if(!isMatch) {
          return res.status(400).send('Keys or username incorrect')
       }

    //jwt auth
    const userName = req.body.name;
    const jwtName = {name: userName}

    accessToken = generateAccessToken(jwtName)
    res.status(200).send('Allowed');
       console.log(accessToken)
    } catch (error){ 
       res.status(500).json({message: error.message});
    }
 }

function generateAccessToken(jwtName) {
    return jwt.sign(jwtName, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '15s'})
}

 module.exports = {
   logUser
 }