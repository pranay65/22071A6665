const exp = require('express');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userApp = exp.Router();
const expressAsyncHandler = require('express-async-handler');

const getAllUsers = expressAsyncHandler(async (req, res)=>{
    const usersCollection = req.app.get('usersCollection');
    const users = await usersCollection.find().toArray();
    if(users.length === 0){
        return res.send('No users available');
    }else{
        res.send({payload: users});
    }
});

const createNewUser = expressAsyncHandler(async (req, res)=>{
    const usersCollection = req.app.get('usersCollection');
    let newUser = req.body;
    if(!newUser.username || !newUser.password){
        return res.send({status: 400, message: 'Incomplete Details'});
    }
    let tempUser = await usersCollection.findOne({username: newUser.username});
    if(tempUser){
        return res.send({status: 409, message:"User already exists"});
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
    const token = jwt.sign({id: userID}, "secret");
    return res.send({token, dbUsername, message:"Login Successful!"});
})

userApp.get('/all-users', getAllUsers);
userApp.post('/register', createNewUser);
userApp.post('/login', loginUser);


module.exports = userApp;