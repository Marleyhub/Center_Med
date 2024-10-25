    const express = require('express');
    const router = express.Router();
    const User = require('../models/user');
    const {getUsers, getUser, createUser, updateUser, deleteUser} = require('../controllers/users-controllers.js');

    // rotas
    router.get ('/', getUsers);

    router.get('/:id', getUser);

    router.post('/create', createUser);

    router.put('/update/:id', updateUser );

    router.delete('/delete/:id', deleteUser);

    

   
    module.exports = router;