const express = require('express');
const app = express();
const router = express.Router();
const Exam = require('../models/exam');
const {scheduleDelete, scheduleExam, getExam, createExam, deleteExam} = require('../controllers/exam-controllers')


router.get('/', getExam);

router.post('/create', createExam);

router.delete('/delete/:id', deleteExam);

router.post('/schedule/:id', scheduleExam);

router.put('/schedule/delete', scheduleDelete)

module.exports = router;