require('dotenv').config();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Appointment = require('../models/appointment');
const { object } = require('joi');


// booking Exam
    const booking = async (req, res) => {
        try {
            const token = req.cookies['accessToken'];
            const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            const user = payload.name;
            const {exam, payment} = req.body  

            if(!token) {
                return res.status(402).json({message: 'Error with token verification'});
            }
            if(!payload || !exam) {
                return res.status(400).json({message: 'You are lacking of critical information'});  
            }

            const booked = await Appointment.findOne({user, exam});
            
            if(isValidated !== true){
                return res.status(400).json('Exam already booked')
            }
            const bookedExam = await Appointment.create({examId, payment, user});

            res.status(201).json({status: 'Appointment created successfully'});

        } catch (err) {
            res.status(500).json({message: err.message})
        }
    }

    const bookingValidation = (user, examId, apList) => {
        try{ 
            for (let i = 0; i < apList.length; i++) {

                let apStringList = apList[i].user.toString();
                let examIdStringlist = apList[i].examId.toString();

                if (apStringList == user && examIdStringlist == examId ){
                    return false
                }
            }
            return true
        } catch (err) {
            return err.message
        }
    }
    
    module.exports = booking