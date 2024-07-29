const express = require('express');
const mysql = require('mysql2');
require('dotenv').config()

const db = mysql.createPool({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_ROOT,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

const router = express.Router();

router.showGameById = function(req, res) {
    const {id} = req.params;
    db.query('SELECT * FROM game WHERE game_id = ?', [id], (error, results) => {
        if (error) throw error;
        res.render('games/game', {
            title: 'game',
            game: results[0],
            isLoggedIn: req.session.isLoggedIn,
            user_id: req.session.userId
        });
    })
}

router.showAllGames = function(req, res) {
    db.query('SELECT * FROM game ', (error, results) => {
        if (error) throw error;
        res.render('games/all-games', {
            title: 'games',
            games: results,
            isLoggedIn: req.session.isLoggedIn,
            user_id: req.session.userId
        });
    })
}

module.exports = router;