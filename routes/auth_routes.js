const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const { promisify } = require('util');
require('dotenv').config()

const db = mysql.createPool({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_ROOT,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

const router = express.Router();
const query = promisify(db.query).bind(db);

router.showForms = function(req, res) {
    res.render('auth');
}

router.processRegister = async(req, res) => {

    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).send("Missing required fields");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const queryResult = await query(
            `INSERT INTO users (username, email, passwd, user_role) VALUES (?, ?, ?, 1)`,
            [username, email, hashedPassword]
        );

        res.redirect('/');
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).send("An error occurred while registering the user");
    }
}

router.processLogin = async(req, res) => {

    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).send("Missing email or password");
        }

        const user = await query("SELECT * FROM users WHERE email = ?", [email]);

        if (user.length === 0) {
            return res.status(401).send("Invalid email or password");
        }

        const isValidPassword = await bcrypt.compare(password, user[0].passwd);

        if (!isValidPassword) {
            return res.status(401).send("Invalid email or password");
        }

        req.session.userId = user[0].user_id;
        req.session.userRoleLevel = user[0].user_role;
        req.session.isLoggedIn = true;

        res.redirect("/");

    } catch (error) {
        console.error("Error logging in:", error);
        res.status(500).send("An error occurred while logging in");
    }
}

router.logout = function(req, res) {
    req.session.destroy(error => {
        if (error) {
            console.error("Error logging out:", error);
            res.status(500).send("An error occurred while logging out");
        } else {
            
            res.redirect("/");
        }
    });
}

module.exports = router;