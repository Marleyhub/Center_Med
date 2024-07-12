const express = require('express');
const app = express();
const router = express.Router();
const User = require('../models/user');


router.get ('/', async (req,res) => {
     try{
       const users = await User.find({});
       res.status(200).json(users);
     } catch (error) {
        res.status(500).json({message: error.message});
     }
});


router.post('/create', async (req,res) => {
      try{
         const user = await User.create({
            name:"Novo Cleriston",
            address: "Rua do subterranea",
            healthcare: true,
            age: 755
        });

        res.status(200).json(user);

      } catch (error) {
        res.status(500).json({message: error.message});

      }
})



module.exports = router;