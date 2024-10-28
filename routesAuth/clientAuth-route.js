    const express = require('express');
    const router = express.Router();
    const Client = require('../models/client.js');
    const {getClients, getClient, createClient, updateClient, deleteClient} = require('../controllers/client-controllers.js');

// rotas user
    router.get ('/', getClients);

    router.get('/:id', getClient);

    router.put('/update/:id', updateClient );

    router.delete('/delete/:id', deleteClient);

    router.post('/create', createClient);

   
    module.exports = router;