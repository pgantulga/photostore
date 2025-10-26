const express = require('express');

const db = require('../models');

const router = express.Router();

const { Order } = db.sequelize.models;


//Joi validation schema
const Joi = require('joi');

//get all orders
router.get('/', async (req, res) => {
    console.log("GET /api/v1/orders");
    try {
        const orders = await Order.findAll();
        res.json(orders);
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
//create a new order
router.post('/', async (req, res) => {
    console.log('/api/v1/orders - POST');
    // Validate request body
    const orderSchema = Joi.object({
        custId: Joi.number().integer().required(),
        total: Joi.number().precision(2).required()
    });
    try {
        const value = await orderSchema.validateAsync(req.body);
        const newOrder = await Order.create(value);
        res.status(201).json(newOrder);
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).send(error.message);
    }
});

module.exports = router;