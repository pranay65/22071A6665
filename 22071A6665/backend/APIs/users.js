const exp = require('express');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userApp = exp.Router();
const expressAsyncHandler = require('express-async-handler');
require('dotenv').config();
const tkn = process.env.TOKEN;

const createNewUser = expressAsyncHandler(async (req, res)=>{
    const usersCollection = req.app.get('usersCollection');
    let newUser = req.body;
    if(!newUser.username || !newUser.password){
        return res.send({status: 400, message: 'Incomplete Details'});
    }
    let tempUser = await usersCollection.findOne({username: newUser.username});
    if(tempUser){
        return res.send({status: 409, message:"Username already taken!"});
    }
    const hashedPassword = await bcryptjs.hash(newUser.password, 7);
    newUser.password = hashedPassword;
    await usersCollection.insertOne(newUser);
    res.send({status: 200, message:"User Created Sucessfully."});
});

const loginUser = expressAsyncHandler(async (req, res) => {
    const usersCollection = req.app.get('usersCollection');
    let user = req.body;
    const dbUser = await usersCollection.findOne({username: user.username});
    if(!dbUser){
        return res.send({status: 404, message:"User not found"});
    }
    const validPass = await bcryptjs.compare(user.password, dbUser.password);
    if (!validPass){
        return res.send({status: 400, message:"Incorrect Password"});
    }
    const userID = dbUser._id;
    const dbUsername = dbUser.username;
    const token = jwt.sign({id: userID}, tkn);
    return res.send({token, dbUsername, message:"Login Successful!"});
})

userApp.post('/register', createNewUser);
userApp.post('/login', loginUser);


module.exports = userApp;