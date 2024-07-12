    const express = require('express');
    const mongoose = require('mongoose');
    const app = express();
    const userRoute = require('./routes/user-route.js')
    const User = require('./models/user.js');

    const port = 3000;

    //middleware 
    app.use(express.json());
    app.use(express.urlencoded({extended: false}));

    app.listen(port, ()=> {
        console.log(`server listening to port ${port}`)
    });

    //rotas

    app.use('/api/user', userRoute);

    //home
    app.get('/', (req,res) => {
       res.send('Server Alive') 
    });   


    //deletando usuário
    app.delete('/api/user/delete/:id', async (req,res) => {
       
        const {id} = req.params;
        const userDeleteData = await User.findByIdAndDelete(id);

        if(!userDeleteData) {
            return res.status(400).json({message:'No data provided to delete'})
        }
        res.status(200).json(userDeleteData)
    })

    
//conectando no banco de dados
mongoose.connect(
    "mongodb+srv://gabrielmtg2:t2TnTvqDih29eY0b@nodedb.2a6h5ag.mongodb.net/Node-API?retryWrites=true&w=majority&appName=NODEDB"
    ).then(
        console.log("mongo-client connection sucessful")
    ).catch(()=>{
        console.log('mongo-client connection Error')
    })
