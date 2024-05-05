const exp = require('express');
const path = require('path');
const app = exp();
const cors = require('cors');
const homeApp = require('./APIs/home');
const userApp = require('./APIs/users');
const recipesApp = require('./APIs/recipes');
const mongoClient = require('mongodb').MongoClient;
require('dotenv').config();
const port = process.env.PORT;
app.use(exp.json());
app.use(cors());

mongoClient.connect(process.env.DB_URI)
.then((client)=>{
    const dbObj = client.db('testDB');
    const usersCollection = dbObj.collection('users');
    const recipesCollection = dbObj.collection('recipes');
    app.set('usersCollection', usersCollection);
    app.set('recipesCollection', recipesCollection);
    console.log("DB Connected Successfully.");
})
.catch((error)=>{
    console.log(error);
})


app.use('/', exp.static(path.join(__dirname, 'public')));

app.use('/', homeApp);
app.use('/users', userApp);
app.use('/recipes', recipesApp);

app.all('*', (req, res)=>{
    res.send({status: 404, message:"Path Not found"});
});

app.use((err, req, res, next) => {
    res.send({status: "error", message: err.message});
});

app.listen(port, ()=>{console.log(`Server running on ${port}`)});