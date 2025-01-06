    const express = require('express');
    const mongoose = require('mongoose');
    const app = express();
    const userAuthRoute = require('./routesAuth/userAuth-route.js');
    const User = require('./models/user.js');
    const cookieParser = require('cookie-parser')


    const port = 4080;

// middleware 
    app.use(express.json());
    app.use(express.urlencoded({extended: false}));
    app.use(cookieParser());

    app.listen(port, ()=> {
        console.log(`serverAuth listening to port ${port}`)
    });

// rotas
    app.use('/api/user/auth', userAuthRoute);
    app.get('/', (req,res) => {res.send('Server Alive')});   


// Conecting to database
    mongoose.connect(
    "mongodb+srv://gabrielmtg2:t2TnTvqDih29eY0b@nodedb.2a6h5ag.mongodb.net/Node-API?retryWrites=true&w=majority&appName=NODEDB"
    ).then(
        console.log("mongo-client connection sucessful")
    ).catch(()=>{
        console.log('mongo-client connection Error')
    })

  /* 
   5 - make a pdf file of the consult 
   8 - study and adjust HTTP methods this fiz code tags
   9 - **Visualização de Consultas:** Permita que os usuários vejam informações detalhadas sobre suas consultas, a rota deve ser criptografada com um link de acesso único.
  */