    const express = require('express');
    const mongoose = require('mongoose');
    const app = express();
    const User = require('./models/user.js');

    const port = 3000;

    //middleware 
    app.use(express.json());
    app.use(express.urlencoded({extended: false}));

    app.listen(port, ()=> {
        console.log(`server listening to port ${port}`)
    });

//rotas

    //home
    app.get('/', (req,res) => {
       res.send('Server Alive') 
    });

    // criando o usuário
    app.post('/api/user/create', async (req,res)=>{
        try{
            const user = await User.create({
                name:"Cleriston",
                address: "Rua do lado",
                healthcare: true,
                age: 34
            });

            res.status(200).json(user);

        } catch (error) {
            res.status(500).json({message: error.message});
        }
});

    //editando usuario
    app.put('/api/user/update/:id', async (req,res) => {

    try{
        const updateUserData = req.body
        if(!updateUserData || Object.keys(updateUserData).length == 0) {
            return res.status(400).json({message: 'No data Provided to update'});    
        }

        const {id} = req.params;
        const user =  await User.findByIdAndUpdate(id, {name: 'Pedro Qualy', address: 'rua da feira', healthcare: true, age: 65}, {new: true});

        if (!user) {
            return res.status(404).json({message: "Product not Found"})
        }

        res.status(200).json(user);

    } catch(error) {
    res.status(500).json({message: error.message});
    }

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
