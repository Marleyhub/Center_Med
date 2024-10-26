const express = require('express');
const router = express.Router();
const User = require('../models/client.js');
const {logUser, refresh, logout} = require('../controllersAuth/clientAuth-controller.js')

router.post('/login', logUser);

router.post('/refresh', refresh);

router.delete('/logout', logout);


module.exports = router;
