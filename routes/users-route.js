    const express = require('express');
    const app = express();
    const router = express.Router();
    const User = require('../models/user');
    const {logUser, getUsers, getUser, createUser, updateUser, deleteUser, authenticateToken} = require('../controlers/users-controllers.js');


    // rotas
    router.get ('/', authenticateToken, getUsers);

    router.get('/:id', getUser);

    router.post('/create', createUser);

    router.put('/update/:id', updateUser );

    router.delete('/delete/:id', deleteUser);

    router.post('/login', logUser)

    module.exports = router;