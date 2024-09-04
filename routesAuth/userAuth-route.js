const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
const {logUser} = require('../controllersAuth/userAuth-controller.js')

router.post('/login', logUser);

module.exports = router;