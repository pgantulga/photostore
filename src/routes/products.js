//start extpres
const express = require('express');
//bring joi for validation
const Joi = require('joi');
//database models
const db = require('../models');
//pull out product model from db
const { Product } = db.sequelize.models;
//express router
const router = express.Router();
//require auth middleware
const auth = require('../middleware/auth');
const staff = require('../middleware/staff');


//path: /api/v1/products
//description: get all products
router.get('/', async (req, res) => {
    console.log("GET /api/v1/products");
    try {
        const products = await Product.findAll();
        res.status(200).send(products);

    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
});
//path: /api/v1/products/:id
//description: get product by id
router.get('/:id', async (req, res) => {
    console.log("GET /api/v1/products/:id");
    try {
        const product = await Product.findByPk(req.params.id);
        if (product) {
            res.status(200).send(product);
        } else {
            res.status(404).send({ message: "Product not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
});

//path: /api/v1/products
//method: POST
//description: create new product
router.post('/', [auth, staff], async (req, res) => {
    console.log("POST /api/v1/products");
    console.log(req.body);
    const productSchema = Joi.object({
        name: Joi.string()
            .regex(/^[a-zA-Z\s]*$/)
            .min(3)
            .max(30)
            .required(),
        desc: Joi.string()
            .regex(/^[a-zA-Z0-9\s]*$/)
            .min(10)
            .max(255),
        image: Joi.string().uri().allow(null),
        price: Joi.number().positive().precision(2),
        stock: Joi.number().integer().positive().allow(null)
    });

    try {
        const value = await productSchema.validateAsync(req.body);
        const product = await Product.create(value);
        return res.status(201).send(product);
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
});

//path: /api/v1/products/:id
//method: PUT
//description: update product by id
router.put('/:id', [auth, staff], async (req, res) => {
    console.log("PUT /api/v1/products/:id");
    try {
        const product = await Product.findByPk(req.params.id);
        if (product) {
            const updatedProduct = await product.update(req.body);
            res.status(200).send(updatedProduct);
        } else {
            res.status(404).send({ message: "Product not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
});

//path: /api/v1/products/:id
//method: DELETE
//description: delete product by id
router.delete('/:id', [auth, staff], async (req, res) => {
    console.log("DELETE /api/v1/products/:id");
    try {
        const product = await Product.findByPk(req.params.id);
        if (product) {
            await product.destroy();
            res.status(200).send({ message: "Product deleted" });
        } else {
            res.status(404).send({ message: "Product not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
});

module.exports = router;