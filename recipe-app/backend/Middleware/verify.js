const jwt = require('jsonwebtoken');
require('dotenv').config();
const tkn = process.env.TOKEN;

const verifyToken = (req, res, next) => {
    const token = req.headers.authorization;
    if(token){
        jwt.verify(token, tkn, (err) => {
            if(err){
                res.sendStatus(403);
                next();
            }
        })
    } else{
        res.sendStatus(401);
    }
}

module.exports = verifyToken;