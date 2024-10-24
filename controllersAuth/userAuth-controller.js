require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')
const {User} = require('../models/user.js') 
const RefreshT = require('../models/token.js'); 


let refreshTokens = []
for (let i = 0; i < refreshTokens; i++) {
   console.log(refreshTokens[i])
   console.log(refreshTokens.length)
}

// logando usuário
const logUser = async (req, res) => {
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
    console.log(req.body)
    await refreshToDB(user, refreshToken)
    res.status(200).json({accessToken: accessToken,
                          refreshToken: refreshToken,
                          user
                         });
    } catch (error){ 
       res.status(500).json({message: error.message});
    }
 }
 
//populando refreshTokens na DB
const refreshToDB = async (user, refreshToken, next) => {
   try {
      const refreshT = await RefreshT.create({
         userId: user._id,
         token: refreshToken,
         expireDate: new Date(Date.now() + 0 * 0 * 1 * 0 * 0)
      });
      return refreshT
      next()
   } catch (error) {
     console.log(error)
     throw new Error ('Error storing refresh token')
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
      - função quebrando no erro por algum motico o servidor não envia a resposta de erro
      - automatizar preenchimento de userId, token e expireDate
2 - Excluir do banco de dados os refreshtokens ao fazer logout
3 - criar rotas de autenticação para criar e deletear exames
*/

 module.exports = {
   logUser, 
   refresh,
   logout
 }