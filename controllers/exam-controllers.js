const Exam = require('../models/exam');


const createExam = async (req, res) => {
   try{

    const exam = await Exam.create({
        name: req.body.name,
        duration: req.body.duration,
        about: req.body.about
    });
    console.log(exam)
   } catch (error) {
    return res.status(404).json({message: error.message})
   }
}

module.exports = {
    createExam
}