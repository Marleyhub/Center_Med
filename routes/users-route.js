    const express = require('express');
    const router = express.Router();
    const User = require('../models/user');
    const {getUsers, getUser, createUser, updateUser, deleteUser, authenticateToken} = require('../controllers/users-controllers.js');

    // rotas
    router.get ('/', authenticateToken, getUsers);

    router.get('/:id', getUser);

    router.put('/update/:id', updateUser );

    router.delete('/delete/:id', deleteUser);

    router.post('/create', createUser);

   
    module.exports = router;