    const express = require('express')
    const mongoose = require('mongoose')
    const app = express()
    const User = require('./model-user')


    app.use(express.json())

    app.listen(3000, ()=> {
        console.log('server listening to port :3000')
    })

    app.get('/', (req,res) => {
        console.log("foi")
        console.log(req.body)
        res.send('Server Alive')
    })

    app.post('/api', (req,res)=>{
        console.log(req.body)
        res.send(req.body)
    })
app.post('/api/user', async (req,res)=>{
        try{
            const user = await User.create(req.body)
            res.status(200).json(user)
            res.send(req.body)
        } catch (error) {
            res.status(500).json({meessage: error.message})
        }
})

mongoose.connect(
    "mongodb+srv://gabrielmtg2:t2TnTvqDih29eY0b@nodedb.2a6h5ag.mongodb.net/Node-API?retryWrites=true&w=majority&appName=NODEDB"
    ).then(
        console.log("mongo-client connection sucessful")
    ).catch(()=>{
        console.log('mongo-client connection Error')
    })
