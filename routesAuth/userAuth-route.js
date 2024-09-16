const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
const {logUser, refresh} = require('../controllersAuth/userAuth-controller.js')

router.post('/login', logUser);

router.post('/token', refresh)

module.exports = router;