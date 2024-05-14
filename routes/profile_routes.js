const express = require('express');
const mysql = require('mysql2');
const { promisify } = require('util');
require('dotenv').config()

const router = express.Router();

// -- CONEXIÓN A BD

const db = mysql.createPool({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_ROOT,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});
const query = promisify(db.query).bind(db);

// -- RUTAS (PROFILEa)

router.showUserProfile = function (req, res) {
    const {userId} = req.params;
    db.query('SELECT * FROM users WHERE user_id = ?', [userId], (err, results) => {
        if(err) throw err;
        res.render('profile/profile', {
            title: 'user_data',
            user_data: results[0]
        });
    })
}

router.addEditUserBio = function (req, res) {
    const {userId} = req.params;
    db.query('SELECT * FROM users WHERE user_id = ?', [userId], (err, results) => {
        if(err) throw err;
        res.render('profile/add_edit_bio', {
            title: 'user_data',
            user_data: results[0]
        });
    })
}

router.userLinkedGames = function (req, res) {
    const {userId} = req.params;
    db.query('SELECT game.* FROM game INNER JOIN saves ON game.game_id = saves.game_id INNER JOIN users ON users.user_id = saves.user_id WHERE users.user_id = ?', [userId], (err, results) => {
        if (err) throw err;
        res.json(results);
    })
}

router.uploadPFP = function (req, res) {
    const {userId} = req.params;
    db.query('SELECT * FROM users WHERE user_id = ?', [userId], (err, results) => {
        if(err) throw err;
        res.render('profile/uploadPFP', {
            title: 'user_data',
            user_data: results[0]
        })
    })
}

router.uploadPFP_action = function (req, res) {

    const { userId } = req.params;
    const pfp_image = req.files.pfp_image;

    // If no image submitted, return error
    if (!pfp_image) {
        return res.status(400).send('No image uploaded.');
    }

    // Move the uploaded image to our upload folder
    pfp_image.mv(__dirname + './../public/images/pfp/' + pfp_image.name, function(err) {
        if (err) {
            console.error(err);
            return res.status(500).send(err);
        }
        // File uploaded successfully
        // res.sendStatus(200);
        res.redirect(`/my_profile/${userId}`)
    });
}

router.addEditUserBio_action = async (req, res) => {

    try {
        const { userId } = req.params;
        const { user_bio } = req.body;
        const queryParams = [user_bio, userId];

        var updateQuery = `UPDATE users SET user_bio = ? WHERE user_id = ?`;
        
        await query(updateQuery, queryParams);
        
        res.redirect(`/my_profile/${userId}`);
    } catch (error) {
        
        console.error("Error updating user:", error);
        res.status(500).send("An error occurred while updating the user");
    }
}

module.exports = router;