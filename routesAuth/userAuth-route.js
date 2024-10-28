const express = require('express');
const router = express.Router();
const User = require('../models/client.js');
const {logUser, refresh, logout, getUser, authenticateToken} = require('../controllersAuth/userAuth-controller.js')

router.post('/login', logUser);

router.post('/refresh', refresh);

router.delete('/logout', logout);

router.get('/users', getUser)


module.exports = router;
