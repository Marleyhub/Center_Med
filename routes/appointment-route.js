const express = require('express');
const app = express();
const router = express.Router();
const {booking, getAppointments} = require('../controllers/appointment-controllers');

router.get('/getAppointments', getAppointments)

router.post('/booking', booking);

module.exports = router;