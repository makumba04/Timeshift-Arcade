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

// -- RUTAS (PROFILE)

router.showUserProfile = function (req, res) {
    const {userId} = req.params;
    db.query('SELECT * FROM users WHERE user_id = ?', [userId], (error, results) => {
        if(error) throw error;
        res.render('profile/profile', {
            title: 'user_data',
            user_data: results[0]
        });
    })
}

router.addEditUserBio = function (req, res) {
    const {userId} = req.params;
    db.query('SELECT * FROM users WHERE user_id = ?', [userId], (error, results) => {
        if(error) throw error;
        res.render('profile/add_edit_bio', { user_data: results[0], isLoggedIn: req.session.isLoggedIn, user_id: req.session.userId });
    })
}

router.serveUserPFP = function (req, res) {
    const { userId } = req.params;

    db.query("SELECT fileName, Image FROM pfp_image WHERE user_id = ?", [userId], (error, results) => {
        if (results.length === 0) {
            return res.status(404).send("Image not found.");
        }

        const { fileName, Image } = results[0];
        const mimeType = fileName.split('.').pop();
        const contentType = mimeType === 'png' ? 'image/png' : 'image/jpeg';
        
        res.setHeader('Content-Type', contentType);
        res.send(Image);
    })
};

router.userLinkedGames = function (req, res) {
    const {userId} = req.params;
    db.query('SELECT game.* FROM game INNER JOIN saves ON game.game_id = saves.game_id INNER JOIN users ON users.user_id = saves.user_id WHERE users.user_id = ?', [userId], (error, results) => {
        if (error) throw error;
        res.json(results);
    })
}

router.uploadPFP = function (req, res) {
    const {userId} = req.params;
    db.query('SELECT * FROM users WHERE user_id = ?', [userId], (error, results) => {
        if(error) throw error;
        res.render('profile/uploadPFP', { user_data: results[0], isLoggedIn: req.session.isLoggedIn, user_id: req.session.userId })
    })
}

router.uploadPFP_action = async (req, res) => {

    try {
        const { userId } = req.params;
        const pfp_image = req.files.pfp_image;
        
        if (!pfp_image) {
            return res.status(400).send("No image file uploaded.");
        }

        const pfp_filename = pfp_image.name;
        const pfp_image_data = pfp_image.data;

        var condition = await query("SELECT * FROM pfp_image WHERE user_id = ?", [userId]);

        let Query;
        let queryParams;

        if (condition.length === 0) {
            
            Query = `INSERT INTO pfp_image (user_id, fileName, Image) VALUES (?, ?, ?)`;
            queryParams = [userId, pfp_filename, pfp_image_data];
        } else {
            
            Query = `UPDATE pfp_image SET fileName = ?, Image = ? WHERE user_id = ?`;
            queryParams = [pfp_filename, pfp_image_data, userId];
        }

        await query(Query, queryParams);

        res.redirect(`/my_profile/${userId}`);
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).send("An error occurred while updating the user");
    }
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