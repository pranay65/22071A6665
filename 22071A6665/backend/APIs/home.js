const exp = require('express');
const path = require('path');
homeApp = exp.Router();

homeApp.get('/', (req, res)=>{
    res.send({message: "Home Page"});
});

module.exports = homeApp;