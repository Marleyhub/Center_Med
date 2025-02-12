const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
const {logUser,logout,getUsers,getUser,createUser} = require('../controllersAuth/userAuth-controller.js');
const {refresh} = require('../controllersAuth/jwtAuth-controller.js');

router.post('/create', createUser)

router.post('/login', logUser);

router.post('/refresh', refresh)

router.post('/logout', logout);

router.get('/users', getUsers);

router.get('/user', getUser);



module.exports = router;
