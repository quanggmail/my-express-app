const express = require('express');
const router = express.Router();
const db = require('../models');
const authenticateToken = require('../middleware/authenticateToken');

router.post('/', authenticateToken, async (req, res) => {
    const Product = db.Product;
    const {name, description, price} = req.body;
    try {
        const newProduct = await Product.create({name, description, price});
        res.status(201).json({message : 'OK', product : newProduct});

    } catch(e) {

    }

});
module.exports = router; 