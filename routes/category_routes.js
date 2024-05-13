const express = require('express');
const mysql = require('mysql2');
// const profileController = require('../controllers/profileController');
require('dotenv').config()

const db = mysql.createPool({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_ROOT,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

const router = express.Router();

router.showAllCategories = function(req, res) {
    db.query('SELECT * FROM category', (err, results) => {
        if (err) throw err;
        res.render('categories/categories', {
            title: 'categories',
            categories: results,
            isLoggedIn: req.session.isLoggedIn,
            user_id: req.session.userId
        });
    })
}

module.exports = router;