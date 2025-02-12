const jwt = require('jsonwebtoken');
const axios = require('axios');
require('dotenv').config();


// Creating tokens
function generateTokens(payload) {
    const accessToken = generateAccessToken(payload)
    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '1d'});
    tokenAutoRefresh(2 * 60, refreshToken)
    return ({accessToken, refreshToken})
 }

function generateAccessToken(payload) {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '120s'});
}


// timer to reset token 
 const tokenAutoRefresh = async (expireTimeSeconds, refreshToken) => {
    const refreshTime = (expireTimeSeconds - 1 * 60) * 1000
    setTimeout(async () => {

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
            tokenAutoRefresh(2 * 60, refreshToken);
            console.log('New access token received:', newAccessToken);
            return
         } else {
            throw new Error ('Faild to refresh Token')
         }
       } catch (error) {
          return console.log('Erro no timer',error)
       }
    }, refreshTime)

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
          return res.status(200).json({accessToken: accessToken})
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

    module.exports = {
        generateTokens,
        refresh
    }