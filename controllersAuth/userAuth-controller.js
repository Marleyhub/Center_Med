require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')
const {User} = require('../models/user.js')


let refreshTokens = []


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

    const accessToken = generateAccessToken(jwtName)
    const refreshToken = jwt.sign(jwtName, process.env.REFRESH_TOKEN_SECRET)
    refreshTokens.push(refreshToken)
    res.status(200).json({accessToken: accessToken,
                          refreshToken: refreshToken
                         });
       console.log(refreshTokens[0])
    } catch (error){ 
       res.status(500).json({message: error.message});
    }
 }

function generateAccessToken(jwtName) {
    return jwt.sign(jwtName, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '30s'})
}


const refresh = async (req, res) => {
   const refreshToken = req.body.token

   if(refreshToken == null) return res.status(401).json('access denied')
   if(!refreshTokens.includes(refreshToken)) return res.status(403).json('access denied')

      jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
         if(err) return res.sendStatus(403)
         const accessToken = generateAccessToken({name: user.name})
         return res.status(200).json({accessToken: accessToken})
      })
}
/*
1 - Criar sistemas para atualizar tokens
1 - Armazenar em banco de dados os refreshTokens (pesquisar)
2 - criar logout 
3 - Excluir do banco de dados os refreshtokens ao fazer logout
4 - criar rotas de autenticação para criar examese deletear
*/

 module.exports = {
   logUser, 
   refresh
 }