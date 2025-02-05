require('dotenv').config();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Appointment = require('../models/appointment');
const fs = require('fs');
const PDFDocument = require('pdfkit')
const path = require('path')


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

// printing exam to PDF
    const printExam = async (req, res) => {
        try {
            const token = req.cookies['accessToken'];
            const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            const userName = payload.name

            const userAppointment = await Appointment.find({user: userName});

            createPdf(userAppointment);
            res.status(200).json({message: 'PDF Printed'})
        } catch (err) {
            res.status(500).json({message: err.message})
        }

    }

// creating pdf
    const createPdf = (userAppointment) => {
        const doc = new PDFDocument();

        const filePath = path.join(__dirname,`appointment_${userAppointment[0].user}.pdf`)

        doc.pipe(fs.createWriteStream(filePath));

        doc.fontSize(20).text('Appointment Details', { align: 'center' });
        doc.moveDown();
    

        for (let i = 0; i < userAppointment.length; i ++) {

            // Content
            doc.fontSize(12);
            doc.text(`Appointment ID: ${userAppointment[i]._id}`);
            doc.text(`Patient Name: ${userAppointment[i].user}`);
            doc.text(`Patient Exam: ${userAppointment[i].exam}`);
            doc.text(`Payment Method: ${userAppointment[i].payment}`);
            doc.text(`Date: ${userAppointment[i].date}`);
            doc.moveDown();
          
        }    
        // Footer
        doc.text('Thank you for choosing our service!', { align: 'center' });
      
        doc.end();
      
        console.log(`PDF created: ${filePath}`);
    }

    module.exports = 
    {
    booking,
    getAppointments,
    printExam
    }