//this file will hold all configuration settings for the project

//require dotenv package
require('dotenv').config();

//export configuration settings
module.exports = {
    PORT: process.env.PORT || 3000,
    //database settings
    db: {
        DB_NAME: process.env.DB_NAME,
        DB_USER: process.env.DB_USER,
        DB_PASS: process.env.DB_PASS,
        options: {
            host: process.env.HOST || 'localhost',
            dialect: process.env.DIALECT || 'sqlite',
            storage: './data/photostoreDB.sqlite'
        }
    },
    //authentication settings
    auth: {
        jwtSecret: process.env.JWT_SECRET
    }

}