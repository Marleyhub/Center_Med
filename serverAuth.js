    const express = require('express');
    const mongoose = require('mongoose');
    const app = express();
    const userAuthRoute = require('./routesAuth/userAuth-route.js');
    const User = require('./models/user.js');
    const cookieParser = require('cookie-parser')

    const port = 4080;

    require('dotenv').config()
    const dbURL = process.env.DATABASE_URL

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
    mongoose.connect(dbURL)
    .then(console.log("mongo-client connection sucessful"))
    .catch(()=>{console.log('mongo-client connection Error')})
