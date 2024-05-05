const exp = require('express');
const bcryptjs = require('bcryptjs');
const expressAsyncHandler = require('express-async-handler');
const recipesApp = exp.Router();
const verify = require('../Middleware/verify');

const getAllRecipes = expressAsyncHandler(async (req, res) => {
    const recipesCollection = req.app.get('recipesCollection');
    const recipes = await recipesCollection.find().toArray();
    return res.send(recipes)
})

const createRecipe = expressAsyncHandler(async (req, res) => {
    const recipesCollection = req.app.get('recipesCollection');
    const usersCollection = req.app.get('usersCollection');
    let currRecipe = req.body;
    let dbUser = await usersCollection.findOne({username: currRecipe.username});
    let recCount = dbUser.recipeCount;
    currRecipe.recipeID = currRecipe.username + recCount;
    await usersCollection.updateOne({username: dbUser.username}, {$set : {recipeCount: recCount+1}});
    if(!currRecipe.name || !currRecipe.ingredients || !currRecipe.instructions || !currRecipe.imgURL || !currRecipe.time){
        return res.send({status: 400, message: "Incomplete Details!"});
    }
    await recipesCollection.insertOne(currRecipe);
    return res.send({status: 200, message: "Recipe Created Successfully!"});
})

const saveNewRecipe = expressAsyncHandler(async (req, res) => {
    const usersCollection = req.app.get('usersCollection');
    const currReq = req.body;
    
    let dbUser = await usersCollection.findOne({ username: currReq.username });
    if(!dbUser){
        return res.send({status: 400, message:"Not Logged In!"});
    }
    let newArr = dbUser.savedRecipes;
    newArr.push(currReq.recipeID);
    
    await usersCollection.updateOne({username: dbUser.username}, {$set : {savedRecipes: newArr}});
    return res.send({status: 200, message: "Saved Successfully!"});
})

const getSavedRecipes = expressAsyncHandler(async (req, res) => {
    const recipesCollection = req.app.get('recipesCollection');
    const usersCollection = req.app.get('usersCollection');
    const currReq = req.body;
    let result = [];

    let dbUser = await usersCollection.findOne({ username: currReq.username });
    for (let i = 0; i < dbUser.savedRecipes.length; i++) {
        const x = dbUser.savedRecipes[i];
        let tempRecipe = await recipesCollection.findOne({recipeID: x});
        result.push(tempRecipe);
    }
    return res.send(result);
})

recipesApp.get('/', getAllRecipes);
recipesApp.put('/saved', getSavedRecipes);
recipesApp.post('/create', createRecipe);
recipesApp.post('/save', saveNewRecipe);

module.exports = recipesApp;