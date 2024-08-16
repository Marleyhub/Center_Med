const express = require('express');
const app = express();
const router = express.Router();
const Exam = require('../models/exam');
const {scheduleExam, getExam, createExam, deleteExam} = require('../controllers/exam-controllers')


router.get('/', getExam);

router.post('/create', createExam);

router.delete('/delete/:id', deleteExam);

router.post('/schedule/:id', scheduleExam);

module.exports = router;