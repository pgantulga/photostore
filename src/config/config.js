//this file will hold all configuration settings for the project

//require dotenv package
require('dotenv').config();

//export configuration settings
module.exports = {
    PORT: process.env.PORT,
    //database settings
    db: {
        DB_NAME: process.env.DB_NAME,
        DB_USER: process.env.DB_USER,
        DB_PASS: process.env.DB_PASS,
        options: {
            host: process.env.HOST || 'localhost',
            dialect: process.env.DIALECT || 'mysql2',
            // storage: './data/photostoreDB.sqlite'
            port: process.env.DB_PORT || 3306
        }
    },
    //authentication settings
    auth: {
        jwtSecret: process.env.JWT_SECRET
    }

}


// config/secrets.js
// db/mysql.js
// import mysql from "mysql2/promise";
// import { getSecrets } from "../config/secrets.js";

// let connection;

// export async function initDB() {
//   const secrets = await getSecrets();

//   connection = await mysql.createConnection({
//     host: secrets.host,
//     user: secrets.username,
//     password: secrets.password,
//     database: secrets.database,
//     port: secrets.port,
//   });

//   console.log("✅ MySQL connected");
//   return connection;
// }