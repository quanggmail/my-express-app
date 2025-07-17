const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'kljkljasdfkljsfjoi5445312^&*^(*^*(^&(*&*(%$K';

const pool = mysql.createPool(
    {
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'my_express_db',
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit : 0
    }
);

router.post('/login', async(req, res) => {
    const {username, password} = req.body;
    let connection;
    try {
        connection = await pool.getConnection();
        const [rows] = await connection.execute ('select id, username, password from users where username = ?', [username]);
        if (rows.length === 0) {
            return res.status(401).json({message : 'Invalid username or password.'});
        }
        const user = rows[0];
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
        // This block ensures the connection is always released, whether successful or error
        if (connection) {
            connection.release();
            console.log('Database connection released.'); // Optional: for debugging connection releases
        }
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

        // 2. Insert the new user into the database
        // Assuming your 'users' table has 'username' and 'password' columns.
        // You might also have 'email', 'created_at', etc.
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
 
    } finally {
        // This block ensures the connection is always released, whether successful or error
        if (connection) {
            connection.release();
            console.log('Database connection released.'); // Optional: for debugging connection releases
        }
    }
});
module.exports = router;