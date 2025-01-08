const express = require('express');
const app = express();
const router = express.Router();
const booking = require('../controllers/appointment-controllers');


router.post('/booking', booking);

module.exports = router;