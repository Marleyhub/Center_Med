const Exam = require('../models/exam.js');
const {User} = require('../models/user.js');

//criando exame
const createExam = async (req, res) => {
   try{

    const exam = await Exam.create({
        name: req.body.name,
        duration: req.body.duration,
        about: req.body.about
    });

    return res.status(200).json(exam)
   
   } catch (error) {
    return res.status(404).json({message: error.message})
   }
}

// listando todos os exames
const getExam = async (req, res) => {
    try{

     const exam = await Exam.find();
     return res.status(200).json(exam)
    
    } catch (error) {
     return res.status(404).json({message: error.message})
    }
 }

// deletando exame
 const deleteExam = async (req, res) => {
    try {
        const {id} = req.params
        console.log(id)
        const deletedExam = await Exam.findByIdAndDelete(id)
        return res.status(200).json(deleteExam)
    } catch (error) {
        return res.status(404).json({message: error.message})
    }
 }

  // Marcando consulta
  async function scheduleExam (req, res) {
    try{
       const {id} = req.params
       const {examId} = req.body

       const schedule = await User.findByIdAndUpdate(id, 
          {
             $push: {examId: examId}
          },
       );
      
       return res.status(200).json(schedule)
    } catch (error) {
       return res.status(404).json({message: error.message})
    }
 }
module.exports = {
    createExam,
    getExam,
    deleteExam,
    scheduleExam
}