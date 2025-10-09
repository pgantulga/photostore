//Middleware checks token

const jwt = require('jsonwebtoken');
const config = require('../config/config');

//Middleware function to verify token

module.exports = function(req, res, next) {
    //Get token from header
    const token = req.header('x-auth-token');
    //Check if no token
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }
    try {
        console.log("Verifying token:");
        //Verify token
        const decoded = jwt.verify(token, config.auth.jwtSecret);
        req.user = decoded;
        next();
    } catch (err) {
        console.log(err);
        res.status(401).json({ msg: 'Token is not valid' });
    }
};
