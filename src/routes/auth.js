// Authentication routes
const express = require('express');
const db = require('../models');
const bcrypt = require('bcrypt');
const logger = require('../logger');
const router = express.Router();

const { Customer } = db.sequelize.models;
const { Staff } = db.sequelize.models;
//Customer routes
//Login

router.post('/customer/login', async (req, res) => {
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
        logger.info(`Customer ${customer.email} logged in.`);
    } catch (error) {
        logger.error("Error logging in:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/customer/register', async (req, res) => {
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
        res.status(201).json({ token });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

//staff login and registration

router.post('/staff/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const staff = await Staff.findOne({ where: { email: email } });
        if (!staff) {
            return res.status(401).json({errors: [{ message: 'Invalid email or password' }]});
        }

        const isMatch = await bcrypt.compare(password, staff.password);
        if (!isMatch) {
            return res.status(401).json({errors: [{ message: 'Invalid email or password' }]});
        }
        const payload = {
            user: {
                custId: null,
                staffId: staff.staffId,
                email: staff.email,
                name: staff.name,
                role: staff.role
            }
        }
        // Generate JWT token
        const token = await Staff.prototype.signToken(payload);

        res.status(200).json({ token });
        logger.info(`Staff ${staff.email} logged in.`);
    } catch (error) {
        logger.error("Error logging in:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/staff/register', async (req, res) => {
    const { email, password, name } = req.body;

    try {
        let staff = await Staff.findOne({ where: { email: email } });
        if (staff) {
            return res.status(400).json({ errors: [{ message: 'User already exists' }] });
        }

        //Hash password
        const hashedPassword = await Staff.prototype.hashPassword(password);
        const newStaff = { email, name, password: hashedPassword };
        //Create new user
        const staffRes = await Staff.create({
            email: newStaff.email,
            name: newStaff.name,
            password: newStaff.password
        });
        const payload = {
            user: {
                staffId: staffRes.staffId,
                email: staffRes.email,
                name: staffRes.name,
                role: staffRes.role
            }
        }
        // Generate JWT token
        const token = await Staff.prototype.signToken(payload);
        res.status(201).json({ token });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

module.exports = router;