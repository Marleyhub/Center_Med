    const express = require('express');
    const mongoose = require('mongoose');
    const app = express();
    const examsRoute = require('./routes/exam-route.js');
    const appointmentRoute = require('./routes/appointment-route.js')
//  const User = require('./models/user.js');
    const Exam = require('./models/exam.js');
    const Appointment = require('./models/appointment.js');
    const cookieParser = require('cookie-parser');
    const port = 3080;

    //console.log(process.cwd());
    
    //middleware 
    app.use(express.json());
    app.use(express.urlencoded({extended: false}));  
    app.use(cookieParser());

    app.listen(port, ()=> {
        console.log(`server listening to port ${port}`)
    });

    //rotas
    app.use('/api/appointment/', appointmentRoute)
    app.use('/api/exams/', examsRoute);
    //home
    app.get('/', (req,res) => {
       res.send('Server Alive') 
    });   


    //conectando no banco de dados
    mongoose.connect(
    "mongodb+srv://gabrielmtg2:t2TnTvqDih29eY0b@nodedb.2a6h5ag.mongodb.net/Node-API?retryWrites=true&w=majority&appName=NODEDB"
    ).then(
        console.log("mongo-client connection sucessful")
    ).catch(()=>{
        console.log('mongo-client connection Error')
    })




    