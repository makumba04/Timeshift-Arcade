const express = require('express');
const mysql = require('mysql2');
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

router.showGameById = function(req, res) {
    const {id} = req.params;
    db.query('SELECT * FROM game WHERE game_id = ?', [id], (err, results) => {
        if (err) throw err;
        res.render('games/game', {
            title: 'game',
            game: results[0],
            isLoggedIn: req.session.isLoggedIn,
            user_id: req.session.userId
        });
    })
}

router.showGamesByCategory = function(req, res) {
    const {id} = req.params;
    db.query('SELECT * FROM game INNER JOIN category ON category.category_id = game.category_type WHERE game.category_type = ?', [id], (err, results) => {
        if (err) throw err;
        res.render('games/games-by-category', {
            title: 'games',
            games: results,
            isLoggedIn: req.session.isLoggedIn,
            user_id: req.session.userId
        });
    })
}

module.exports = router;