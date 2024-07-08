    const express = require('express')
    const mongoose = require('mongoose')
    const app = express()
    const User = require('./models/user.js')


    app.use(express.json())

    app.listen(3000, ()=> {
        console.log('server listening to port :3000')
    })

    app.get('/', (req,res) => {
       
        res.send('Server Alive')
    })


    app.post('/api/user/create', async (req,res)=>{
        try{
            const user = await User.create({
                name:"Gabriel",
                address: "Rua de casa",
                healthcare: true
            })
            res.status(200).json(user)
            console.log(req)
        } catch (error) {
            res.status(500).json({message: error.message})
        }
})

 app.put('/api/user/update/:id', async (req,res) => {

    try{

        const {id} = req.params;
        const user =  await User.findByIdAndUpdate(id, req.body, {new: true});

        if (!user) {
            return res.status(404).json({message: "Product not Found"})
        }

    } catch(error) {

    res.status(500).json({message: error.message})
    }
 })

mongoose.connect(
    "mongodb+srv://gabrielmtg2:t2TnTvqDih29eY0b@nodedb.2a6h5ag.mongodb.net/Node-API?retryWrites=true&w=majority&appName=NODEDB"
    ).then(
        console.log("mongo-client connection sucessful")
    ).catch(()=>{
        console.log('mongo-client connection Error')
    })
