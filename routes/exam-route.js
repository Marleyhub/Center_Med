const express = require('express');
const app = express();
const router = express.Router();
const Exam = require('../models/exam');
const {getExam, createExam, deleteExam} = require('../controllers/exam-controllers')


router.get('/', getExam);

router.post('/create', createExam);

router.delete('/delete/:id', deleteExam);

module.exports = router;