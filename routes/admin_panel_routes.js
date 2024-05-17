const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const { promisify } = require('util');
const fs = require('fs');
const fsp = require('fs').promises;
const path = require('path');
const { stringify } = require('querystring');
require('dotenv').config()

const router = express.Router();

// -- DB CONNECTION

const db = mysql.createPool({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_ROOT,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});
const query = promisify(db.query).bind(db);

// -- ROUTES

// ADMIN PANEL
router.renderAdminPanel = function (req, res) {res.render("admin-panel/admin-panel")};

// CREATE CATEGORY
router.renderCreateCategoryForm = function (req, res) {res.render("categories/create-category-form")};
router.createCategoryAction = async (req, res) => {
    try {
        const category_cover = req.files.category_cover;
        const { category_name, category_description } = req.body;
        const createQuery = `INSERT INTO category (category_name, category_description, category_cover_path) VALUES (?, ?, ?)`;
        const queryParams = [category_name, category_description];
        
        if (!category_name || !category_description) {
            return res.status(400).send("Missing required fields");
        }

        const sanitizedCategoryName = category_name.trim().toLowerCase().replace(/\s+/g, '_');
        const coverFileName = `${sanitizedCategoryName}${path.extname(category_cover.name)}`;
        const coverPath = path.join(__dirname, './../public/images/categories-cover/', coverFileName);
        const coverPathSave = path.join('/images/categories-cover/', coverFileName);

        queryParams.push(coverPathSave);

        await query(createQuery, queryParams);

        category_cover.mv(coverPath, function(err) {
            if (err) {
                console.error(err);
                return res.status(500).send(err);
            }
        });

        res.redirect('/admin-panel');
    } catch (error) {

        console.error("Error registering category:", error);
        res.status(500).send("An error occurred while registering the category");
    }
}

// EDIT CATEGORY
router.renderEditCategoryForm = function (req, res) {

    const { categoryId } = req.params;
    db.query("SELECT * FROM category WHERE category_id = ?", [categoryId], (err, results) => {
        if (err) throw err;
        res.render("categories/edit-category", { category_data: results[0] });
    })
}
router.editCategoryAction = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const category_cover = req.files ? req.files.category_cover : undefined;
        const { category_name, category_description } = req.body;
        console.log(category_cover);

        // Construir la consulta de actualización y los parámetros
        let updateQuery = 'UPDATE category SET category_name = ?, category_description = ?';
        const queryParams = [category_name, category_description];

        // Obtener el nombre de portada actual
        const [currentCategory] = await query('SELECT category_cover_path, category_name FROM category WHERE category_id = ?', [categoryId]);
        const currentCoverPath = currentCategory.category_cover_path;
        const currentCategoryName = currentCategory.category_name;

        let newCoverPath = currentCoverPath;

        if (category_cover) {
            // Si se ha subido una nueva portada
            const sanitizedCategoryName = category_name.trim().toLowerCase().replace(/\s+/g, '_');
            const coverFileName = `${sanitizedCategoryName}${path.extname(category_cover.name)}`;
            const coverPath = path.join(__dirname, './../public/images/categories-cover/', coverFileName);
            newCoverPath = path.join('/images/categories-cover/', coverFileName);

            updateQuery += `, category_cover_path = ?`;
            queryParams.push(newCoverPath);

            if (fs.existsSync(coverPath)) {
                fs.unlinkSync(coverPath);
            }

            category_cover.mv(coverPath, function(err) {
                if (err) {
                    console.error(err);
                    return res.status(500).send(err);
                }
            });
        } else if (category_name !== currentCategoryName) {
            // Si el nombre de la categoría ha cambiado pero no se ha subido una nueva portada
            const sanitizedCategoryName = category_name.trim().toLowerCase().replace(/\s+/g, '_');
            const currentCoverFileName = path.basename(currentCoverPath);
            const newCoverFileName = `${sanitizedCategoryName}${path.extname(currentCoverFileName)}`;
            const newCoverFilePath = path.join(__dirname, './../public/images/categories-cover/', newCoverFileName);
            const currentCoverFilePath = path.join(__dirname, './../public', currentCoverPath);

            fs.renameSync(currentCoverFilePath, newCoverFilePath);
            newCoverPath = path.join('/images/categories-cover/', newCoverFileName);

            updateQuery += `, category_cover_path = ?`;
            queryParams.push(newCoverPath);
        }

        updateQuery += ' WHERE category_id = ?';
        queryParams.push(categoryId);

        await query(updateQuery, queryParams);

        res.redirect('/admin-panel');
    } catch (error) {
        console.error("Error updating category:", error);
        res.status(500).send("An error occurred while updating the category");
    }
}

// DELETE CATEGORY
router.renderDeleteCategoryConfirm = function (req, res) {
    const { categoryId } = req.params;
    db.query("SELECT * FROM category WHERE category_id = ?", [categoryId], (err, results) => {
        if (err) throw err;
        res.render("categories/delete-category-confirm", { category_data: results[0] });
    })
}
router.confirmedCategoryDelete = async (req, res) => {
    try {
        const { categoryId, categoryName } = req.params;
        const sanitizedCategoryName = path.join(__dirname, './../public/images/categories-cover/', categoryName.toLowerCase().trim() + '.png') ;

        await fsp.rm(`${sanitizedCategoryName}`);
        await query("DELETE FROM category WHERE category_id = ?", [categoryId]);
        // res.status(200).send("User deleted successfully");
        
        res.redirect('/admin-panel');
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).send("An error occurred while deleting the category");
    }
}

// CREATE GAME
router.renderCreateGameForm = function (req, res) {res.render("games/create-game-form");}
router.createGameAction = async (req, res) => {
    try {

        const game_cover = req.files.game_cover;
        const { category_type, game_name, game_description, localpath, htp, featured } = req.body;
        const createQuery = `INSERT INTO game (category_type, game_name, game_description, localpath, htp, featured, cover_path ) VALUES (?, ?, ?, ?, ?, ?, ?)`;
        const queryParams = [category_type, game_name, game_description, localpath, htp, featured];

        if (!category_type || !game_cover || !game_name || !game_description || !localpath || !htp || !featured) {
            return res.status(400).send("Missing required fields");
        }

        const sanitizedGameName = game_name.trim().toLowerCase().replace(/\s+/g, '_');
        const coverFileName = `${sanitizedGameName}${path.extname(game_cover.name)}`;
        const coverPath = path.join(__dirname, './../public/images/games-cover/', coverFileName);
        const coverPathSave = path.join('/images/games-cover/', coverFileName);
        queryParams.push(coverPathSave);

        game_cover.mv(coverPath, function(err) {
            if (err) {
                console.error(err);
                return res.status(500).send(err);
            }
        });

        await query(createQuery, queryParams);

        res.redirect('/admin-panel');
    } catch (error) {

        console.error("Error registering game:", error);
        res.status(500).send("An error occurred while registering the game");
    }
}

// EDIT GAME
router.renderEditGameForm = function (req, res) {

    const { gameId } = req.params;
    db.query("SELECT * FROM game WHERE game_id = ?", [gameId], (err, results) => {
        if (err) throw err;
        res.render("games/edit-game", { game_data: results[0] });
    })
}
router.editGameAction = async (req, res) => {
    try {
        const { gameId } = req.params;
        const game_cover = req.files ? req.files.game_cover : undefined;
        const { category_type, game_name, game_description, localpath, htp, featured } = req.body;
        const queryParams = [];
        
        // Obtener el nombre de portada actual
        const [currentGame] = await query('SELECT cover_path, game_name FROM game WHERE game_id = ?', [gameId]);
        const currentCoverPath = currentGame.cover_path;
        const currentGameName = currentGame.game_name;

        var updateQuery = 'UPDATE game SET';

        if (category_type !== undefined) {
            updateQuery += ` category_type = ? `;
            queryParams.push(category_type);
        }
        updateQuery += `, game_name = ?`;
        queryParams.push(game_name);

        if (game_description !== '') {
            updateQuery += `, game_description = ?`;
            queryParams.push(game_description);
        }

        updateQuery += `, localpath = ?`;
        queryParams.push(localpath);

        if (htp !== '') {
            updateQuery += `, htp = ?`;
            queryParams.push(htp);
        }

        if (featured !== undefined) {
            updateQuery += `, featured = ?`;
            queryParams.push(featured);
        }

        let newCoverPath = currentCoverPath;

        if(game_cover) {
            const sanitizedGameName = game_name.trim().toLowerCase().replace(/\s+/g, '_');
            const coverFileName = `${sanitizedGameName}${path.extname(game_cover.name)}`;
            const coverPath = path.join(__dirname, './../public/images/games-cover/', coverFileName);
            const coverPathSave = path.join('/images/games-cover/', coverFileName);

            updateQuery += `, cover_path = ?`;
            queryParams.push(coverPathSave);

            if (fs.existsSync(coverPath)) {
                fs.unlinkSync(coverPath);
            }

            game_cover.mv(coverPath, function(err) {
                if (err) {
                    console.error(err);
                    return res.status(500).send(err);
                }
            });
        } else if (game_name !== currentGameName) {
            // Si el nombre del juego cambia, renombrar el archivo de portada
            const sanitizedGameName = game_name.trim().toLowerCase().replace(/\s+/g, '_');
            const currentCoverFileName = path.basename(currentCoverPath);
            const newCoverFileName = `${sanitizedGameName}${path.extname(currentCoverFileName)}`;
            const newCoverFilePath = path.join(__dirname, './../public/images/games-cover/', newCoverFileName);
            const currentCoverFilePath = path.join(__dirname, './../public', currentCoverPath);

            fs.renameSync(currentCoverFilePath, newCoverFilePath);
            newCoverPath = path.join('/images/games-cover/', newCoverFileName);

            updateQuery += `, cover_path = ?`;
            queryParams.push(newCoverPath);
        }

        updateQuery += ` WHERE game_id = ?`;
        queryParams.push(gameId);

        await query(updateQuery, queryParams);

        res.redirect(`/admin-panel`);
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).send("An error occurred while updating the user");
    }
}

// DELETE GAME
router.renderDeleteGameConfirm = function (req, res) {
    
    const { gameId } = req.params;
    db.query("SELECT * FROM game WHERE game_id = ?", [gameId], (err, results) => {
        if (err) throw err;
        res.render("games/delete-game-confirm", { game_data: results[0] });
    })
}
router.confirmedGameDelete = async (req, res) => {
    try {

        const { gameId, gameName } = req.params;
        const sanitizedGameName = path.join(__dirname, './../public/images/games-cover/', gameName.toLowerCase().trim() + '.jpg') ;

        await fsp.rm(`${sanitizedGameName}`);
        await query("DELETE FROM game WHERE game_id = ?", [gameId]);
        // res.status(200).send("User deleted successfully");
        
        res.redirect('/admin-panel');
    } catch (error) {

        console.error("Error deleting user:", error);
        res.status(500).send("An error occurred while deleting the game");
    }
}

// CREATE USER
router.renderCreateUserForm = function (req, res) {res.render("users/create-user-form");}
router.createUserAction = async (req, res) => {

    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).send("Missing required fields");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const createQuery = `INSERT INTO users (username, email, passwd, user_role) VALUES (?, ?, ?, 1)`;
        const queryParams = [username, email, hashedPassword];

        await query(createQuery, queryParams);

        res.redirect('/admin-panel');
    } catch (error) {
        // Handle errors
        console.error("Error registering user:", error);
        res.status(500).send("An error occurred while registering the user");
    }
}

// EDIT USER
router.renderEditUserForm = function (req, res) {

    const { userId } = req.params;
    db.query("SELECT * FROM users WHERE user_id = ?", [userId], (err, results) => {
        if (err) throw err;
        res.render("users/edit-user", { user_data: results[0] });
    })
}
router.editUserAction = async (req, res) => {

    try {
        // Get the request body
        const { userId } = req.params;
        const { username, email, password, user_role } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const queryParams = [username, email, hashedPassword];

        let updateQuery = `UPDATE users SET username = ?, email = ?, passwd = ?`;

        if (user_role !== undefined) {
            updateQuery += `, user_role = ?`;
            queryParams.push(user_role);
        }
        queryParams.push(userId);
        updateQuery += ` WHERE user_id = ?`;

        const queryResult = await query(updateQuery, queryParams);

        res.redirect('/admin-panel');
    } catch (error) {

        console.error("Error updating user:", error);
        res.status(500).send("An error occurred while updating the user");
    }
}

// DELETE USER
router.renderDeleteUserConfirm = function (req, res) {
    
    const { userId } = req.params;
    db.query("SELECT * FROM users WHERE user_id = ?", [userId], (err, results) => {
        if (err) throw err;
        res.render("users/delete-user-confirm", { user_data: results[0] });
    })
}
router.confirmedUserDelete = async (req, res) => {
    try {

        const { userId } = req.params;
        await query("DELETE FROM users WHERE user_id = ?", [userId]);
        // res.status(200).send("User deleted successfully");
        res.redirect('/admin-panel')
    } catch (error) {

        console.error("Error deleting user:", error);
        res.status(500).send("An error occurred while deleting the user");
    }
}

module.exports = router;