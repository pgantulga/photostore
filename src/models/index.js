//this file will contain our database models and associations
const { Sequelize, DataTypes } = require('sequelize');
//bring config
const config = require('../config/config');
//bring in JWT and bcrypt for user authentication
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// creating database variable
let db = {};

//creating new sequelize instance and passing in configuration settings
const sequelize = new Sequelize(
    config.db.DB_NAME,
    config.db.DB_USER,
    config.db.DB_PASS,
    config.db.options
);

// Product model

const Product = sequelize.define('Product', {
    prodId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    desc: {
        type: DataTypes.TEXT
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    image: {
        type: DataTypes.STRING
    },
    stock: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
})

//customer model

const Customer = sequelize.define('Customer', {
    custId: {  
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.STRING,
        defaultValue: 'customer'
    }
})

//staff model

const Staff = sequelize.define('Staff', {
    staffId: {  
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.STRING,
        defaultValue: 'staff'
    }
})
//Order model
const Order = sequelize.define('Order', {
    orderId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    custId: {
        type: DataTypes.INTEGER,
        references: {
            model: Customer,
            key: 'custId'
        }
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: 'pending'
    },
    total: {
        type: DataTypes.DECIMAL(10, 2),
    }
})

Customer.prototype.signToken = function(payload) {
    const token = jwt.sign(payload, config.auth.jwtSecret, { expiresIn: '7d', algorithm: 'HS512' });
    console.log("Generated token:", token);
    return token;
};

Customer.prototype.hashPassword = async function(password) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
}   

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;