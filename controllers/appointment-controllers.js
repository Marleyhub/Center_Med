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
            
            if(!booked || booked == null) {
                const bookedExam = await Appointment.create({exam, payment, user});
                res.status(200).json({message: 'Appointment created successfully'});
            } else {
                res.status(400).json({message: 'Exam Already booked'})
            }
        } catch (err) {
            res.status(500).json({message: err.message})
        }
    }
   
// getting all Exams
    const getAppointments = async (req, res) => {
        try{
            const appointmentList = await Appointment.find()
            res.status(200).json(appointmentList)
        } catch (err) {
            res.status(500).json({message: err.message})
        }
    }
    
    module.exports = 
    {
    booking,
    getAppointments
    }