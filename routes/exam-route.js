const express = require('express');
const app = express();
const router = express.Router();
const Exam = require('../models/exam');
const {scheduleDelete, scheduleCreate, getExam, createExam, deleteExam} = require('../controllers/exam-controllers')


router.get('/', getExam);

router.post('/create', createExam);

router.delete('/delete/:id', deleteExam);

router.post('/schedule/create', scheduleCreate);

router.delete('/schedule/delete', scheduleDelete);

module.exports = router;