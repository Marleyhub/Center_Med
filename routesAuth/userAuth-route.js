const express = require('express');
const router = express.Router();
const User = require('../models/client.js');
const {logUser, refresh, logout, getUsers, getUser, authenticateToken, createUser} = require('../controllersAuth/userAuth-controller.js')

router.post('/create', createUser)

router.post('/login', logUser);

router.post('/refresh', refresh);

router.post('/logout', logout);

router.get('/users', getUsers);

router.get('/user', getUser);


module.exports = router;
