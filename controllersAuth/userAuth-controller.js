require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')
const {User} = require('../models/user.js')
const {RefreshT} = require('../models/token.js');


let refreshTokens = []
for (let i = 0; i < refreshTokens; i++) {
   console.log(refreshTokens[i])
   console.log(refreshTokens.length)
}

// logando usuário
const logUser = async (req,res) => {
    const user = await User.findOne({name: req.body.name});
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
    const accessToken = generateAccessToken(jwtName)
    const refreshToken = jwt.sign(jwtName, process.env.REFRESH_TOKEN_SECRET)
    refreshToDB()
    console.log(req.body)
    res.status(200).json({accessToken: accessToken,
                          refreshToken: refreshToken,
                          user
                         });
    } catch (error){ 
       res.status(500).json({message: error.message});
    }
 }
 
//populando refreshTokens na DB
const refreshToDB = async (req, res) => {
   try {
      const refreshT = await RefreshT.create({
         userId: req.body.userId,
         token: req.body.token,
         expireDate: req.body.expireDate
      });
      return res.status(200).json(refreshT)
   } catch (error) {
      res.status(500).json({message: error})
   }
}

//gerando access token
function generateAccessToken(jwtName) {
    return jwt.sign(jwtName, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '30s'})
}

// Reiniciando Token
const refresh = async (req, res) => {
   const refreshToken = req.body.token

   if(refreshToken == null) return res.status(401).json('access denied - null ')
   if(!refreshTokens.includes(refreshToken)) return res.status(403).json('access denied - !')

      jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
         if(err) return res.sendStatus(403)
         const accessToken = generateAccessToken({name: user.name})
         return res.status(200).json({accessToken: accessToken})
      })
}

// logout

const logout = (req, res) => {
   refreshTokens = refreshTokens.filter(token => token ==! req.body.token)
   return res.status(204).json({message: 'logout'})
}
/*
1 - Armazenar em banco de dados os refreshTokens (pesquisar)
2 - Excluir do banco de dados os refreshtokens ao fazer logout
3 - criar rotas de autenticação para criar exames deletear
*/

 module.exports = {
   logUser, 
   refresh,
   logout
 }