const express = require('express');
const app = express();
const router = express.Router();
const {booking, getAppointments, printExam} = require('../controllers/appointment-controllers');


router.get('/getAppointments', getAppointments);

router.post('/booking', booking);

router.get('/print', printExam);

module.exports = router;