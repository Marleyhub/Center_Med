const express = require('express');
const app = express();
const router = express.Router();
const Exam = require('../models/exam');
const {getExam, createExam} = require('../controlers/exam-controllers')


//router.get('/', getExam);

router.post('/create', createExam);