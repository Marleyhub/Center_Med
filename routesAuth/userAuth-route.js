const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
const {logUser, refresh, logout} = require('../controllersAuth/userAuth-controller.js')

router.post('/login', logUser);

router.post('/refresh', refresh);

router.delete('/logout', logout);

module.exports = router;
