const User = require('../models/user.js');



const getUsers =  async (req,res) => {
        try{
          const users = await User.find({});
          res.status(200).json(users);
        } catch (error) {
           res.status(500).json({message: error.message});
        }
   }

const createUser = async (req,res) => {
   try{
      const user = await User.create({
         name:"Novo Novo Cleriston",
         address: "Rua do subterranea mais profunda",
         healthcare: true,
         age: 9634
     });

     res.status(200).json(user);

   } catch (error) {
     res.status(500).json({message: error.message});

   }
}

const updateUser = async (req,res) => {
   try{
      const updateUserData = req.body
      if(!updateUserData || Object.keys(updateUserData).length == 0) {
          return res.status(400).json({message: 'No data Provided to update'});    
      }

      const {id} = req.params;
      const user =  await User.findByIdAndUpdate(id, {name: 'SR. Abelardo', address: 'Pastelaria', healthcare: true, age: 5566}, {new: true});

      if (!user) {
          return res.status(404).json({message: "Product not Found"})
      }

      res.status(200).json(user);
   } catch (error) {
      res.status(500).json({message: error.message});
   }
}

const deleteUser = async (req,res) => {
   try{
      const {id} = req.params;
      const deletedData = await User.findByIdAndDelete(id)
      if(!deletedData) {
         return res.status(400).json({message:'No data provided to delete'})
     }
      res.status(200).json(deletedData)
   }catch (error) {
      res.status(500).json({message: error.message});
   }
}


module.exports = {
    getUsers,
    createUser,
    updateUser,
    deleteUser
}
