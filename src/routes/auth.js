// Authentication routes
const express = require('express');
const db = require('../models');
const bcrypt = require('bcrypt');
const router = express.Router();

const { Customer } = db.sequelize.models;

//Customer routes
//Login

router.post('/customer/login', async (req, res) => {
    console.log("POST /api/v1/auth/login");
    const { email, password } = req.body;

    try {
        const customer = await Customer.findOne({ where: { email: email } });
        if (!customer) {
            return res.status(401).json({errors: [{ message: 'Invalid email or password' }]});
        }

        const isMatch = await bcrypt.compare(password, customer.password);
        if (!isMatch) {
            return res.status(401).json({errors: [{ message: 'Invalid email or password' }]});
        }
        const payload = {
            user: {
                custId: customer.custId,
                email: customer.email,
                name: customer.name,
                role: customer.role
            }
        }
        // Generate JWT token
        const token = await Customer.prototype.signToken(payload);

        res.status(200).json({ token });
    } catch (error) {
        console.error("Error logging in:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/customer/register', async (req, res) => {
    console.log("POST /api/v1/auth/register");
    const { email, password, name } = req.body;
    
    try {
        let customer = await Customer.findOne({ where: { email: email } }); 
        if (customer) {
            return res.status(400).json({ errors: [{ message: 'User already exists' }] });
        }

        //Hash password
        const hashedPassword = await Customer.prototype.hashPassword(password);
        const newCustomer = { email, name, password: hashedPassword };
        //Create new user
        const customerRes = await Customer.create({
            email: newCustomer.email,
            name: newCustomer.name,
            password: newCustomer.password
        });
        console.log("New user created:", customerRes);
        const payload = {
            user: {
                custId: customerRes.custId,
                email: customerRes.email,
                name: customerRes.name,
                role: customerRes.role
            }
        }
        // Generate JWT token
        const token = await Customer.prototype.signToken(payload);
        console.log(token);
        res.status(201).json({ token });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});


module.exports = router;