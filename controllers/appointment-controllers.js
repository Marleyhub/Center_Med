require('dotenv').config();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Appointment = require('../models/appointment')


// booking Exam
    const booking = async (req, res) => {
        try {
            const token = req.cookies['accessToken'];
            const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            const user = payload.id;
            const {examId} = req.body  // examId and date needs a front-end logic
            const payment = 'Pix'
        
            if(!token) {
                res.status(402).json({message: 'Error with token verification'})
            }
            if(!payload || !examId) {
                res.status(401).json({message: 'You are lacking of critical information'});  
                return  
            }

            const bookedExam = await Appointment.create({examId, payment, user})
            res.status(200).json({status: 'Appointment created successfully'})

        } catch (err) {
            res.status(500).json({message: err.message})
        }
    }
    
    module.exports = booking