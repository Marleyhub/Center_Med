const express = require('express');
const app = express();
const router = express.Router();
const User = require('../models/user');
const {getUsers, createUser, updateUser, deleteUser} = require('../controlers/users-controllers.js');

router.get ('/', getUsers);

router.post('/create', createUser);

router.put('/update/:id', updateUser );

router.delete('/delete/:id', deleteUser);


module.exports = router;