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
   async function scheduleCreate (req, res) {
      try{
         const {userId} = req.body
         const {examId} = req.body
         const user = await User.findById(userId)

         if (!userId || !examId) {
            return res.status(404).json({message: "Inserir Useário e Exame"})
         }
         if (examId == user.examId) {
            return res.status(404).json({message: "Exame já marcado"})
         }

         const userToUpdate = await User.findByIdAndUpdate(userId, 
            { $push: {examId: examId}}
         )

         return res.status(200).json({userToUpdate, message: 'Exame marcado para este usuário'})
         
        } catch (error) {
         return res.status(404).json({message: error.message})
        }

        
   }

   //Desmarcando consulta
   async function scheduleDelete(req, res) {

      const {userId} = req.body
      const {examId} = req.body
      const user = await User.findById(userId)
      
      try {
         if (examId == user.examId){
            const userToDelete = await User.findByIdAndUpdate(userId,
               { $pull: { examId: examId} }
             );
             return res.status(200).json({userToDelete, message: 'Exame desmarcado para este usuário'})
         } else {
            return res.status(404).json({message: 'Exame não encotrado'})
         }
      } catch (error) {
          return res.status(404).json({message: error})
      }
  }
   module.exports = {
      createExam,
      getExam,
      deleteExam,
      scheduleCreate,
      scheduleDelete
   }
