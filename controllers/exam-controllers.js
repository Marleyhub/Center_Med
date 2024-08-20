   const {mongoose} = require('mongoose');
   const Exam = require('../models/exam.js');
   const {User} = require('../models/user.js');
const { NULL } = require('mysql/lib/protocol/constants/types.js');

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
         const examObjectIds = new mongoose.Types.ObjectId(examId)
         const userExamIdproxy = await User.findById(id).select('examId');
         const userExamIds = userExamIdproxy.toObject().examId;
            // simplificar este trecho de codigo
            // não pegar ID dos parametros 
            // fazer validação de exames já existentes de uma maneira mais simples
         if (userExamIds.some(exam => exam.equals(examObjectId))) {
            return res.status(400).json({ message: 'Exame já marcado' });
        }

         const schedule = await User.findByIdAndUpdate(id, 
            { $push: {examId: examId} },
         );
         return res.status(200).json(schedule)
            
            } catch (error) {
         return res.status(404).json({message: error.message})
      }
   }

   //Desmarcando consulta
   async function scheduleDelete(req, res) {
      const {userId} = req.body
      const {examId} = req.body
      console.log(examId)
      try {
          const user = await User.findByIdAndUpdate(userId,
            { $pull: { examId: examId} }
          );
          return res.status(200).json({user, message: 'Exame desmarcado para este usuário'})
      } catch (error) {
          return res.status(404).json({message: error})
      }
  }
   module.exports = {
      createExam,
      getExam,
      deleteExam,
      scheduleExam,
      scheduleDelete
   }
