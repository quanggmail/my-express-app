const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'kljkljasdfkljsfjoi5445312^&*^(*^*(^&(*&*(%$K';
const db = require('../models');

router.post('/login', async(req, res) => {
    const {username, password} = req.body;
    
    const User = db.User;
    try {
        const user = await User.findOne(
            {
                where : {
                    username:username
                }
            }
        );
        if (!user) {
            return res.status(401).json(
                {
                    message: 'Invalid username or password.'
                }
            );
        }
        const hashedPassword = user.password;
        console.log(password, hashedPassword);
        const isMatch = await bcrypt.compare(password, hashedPassword);
        console.log(isMatch);
        const payload = {
            id : user.id,
            username : user.username
        };
        const token = jwt.sign(payload, JWT_SECRET, {'expiresIn': '1h'});
        if (isMatch) {
            return res.status(200).json({message : 'OK', token : token, user : {payload}});
        } else {
            return res.status(401).json({message : 'Invalid username or password.'});
        }
        

    } catch (error) {
        // --- THIS IS THE CRUCIAL CHANGE ---
        console.error('Login route error:', error); // Log the actual error to your server console
        // Send a 500 Internal Server Error response to the client
        return res.status(500).json({ message: 'Internal server error.' });
    } finally {
        
    }
});

router.post('/register', async(req, res) => {
    const {username,password} = req.body;
    let connection;
    if (!username || !password) {
        res.status(400).json({message : 'Username and password are required!'});
    }
    try {
        connection = await pool.getConnection();
        // 1. Hash the plaintext password
        const saltRounds = 10; // Cost factor for bcrypt. Adjust as needed.
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = await User.create(
            {
                username:username,
                password:hashedPassword
            }
        );
        const [result] = await connection.execute(
            'INSERT INTO users (username, password) VALUES (?, ?)',
            [username, hashedPassword]
        );

        // Check if the insertion was successful
        if (result.affectedRows === 1) {
            return res.status(201).json({ message: 'User registered successfully!', userId: result.insertId, username: username });
        } else {
            // This case is unlikely if no error was thrown, but good for robustness
            return res.status(500).json({ message: 'Failed to register user.' });
        }

    } catch(error) {
 // Check if the error is due to a unique constraint violation (e.g., duplicate username)
        if (error.name === 'SequelizeUniqueConstraintError') {
            console.error('Registration error: Duplicate username:', error.errors[0].message);
            return res.status(409).json({ message: 'Username already exists. Please choose a different one.' });
        } else {
            // Log the actual error to your server console for debugging
            console.error('Registration route error:', error);
            // Send a generic 500 Internal Server Error response to the client
            return res.status(500).json({ message: 'Internal server error during registration.' });
        }
    }
});
module.exports = router;