const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const { promisify } = require('util');
const fs = require('fs');
const fsp = require('fs').promises;
const path = require('path');
const unzipper = require('unzipper');
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
        
        if ( path.extname(category_cover.name) != '.png' ) {
            return res.status(415).redirect(`/admin-panel?statusmessage=${encodeURIComponent('Invalid file type. Only .png files are allowed.')}`);
        }

        if (!category_name || !category_description) {
            return res.status(400).send("Missing required fields");
        }

        const sanitizedCategoryName = category_name.trim().toLowerCase().replace(/\s+/g, '_');
        const coverFileName = `${sanitizedCategoryName}${path.extname(category_cover.name)}`;
        const coverPath = path.join(__dirname, './../public/images/categories-cover/', coverFileName);
        const coverPathSave = path.join('/images/categories-cover/', coverFileName);

        queryParams.push(coverPathSave);

        category_cover.mv(coverPath, function(error) {
            if (error) {
                console.error(error);
                return res.status(500).send(error).redirect(`/admin-panel?statusmessage=${encodeURIComponent('An error ocurred while moving the cover to the designed path.')}`);
            }
        });

        await query(createQuery, queryParams);

        res.status(200).redirect(`/admin-panel?statusmessage=${encodeURIComponent('Category created successfully')}`);
    } catch (error) {
        console.error("Error creating category:", error);
        res.status(500).redirect(`/admin-panel?statusmessage=${encodeURIComponent('An error occurred while creating the category')}`);
    }
}

// EDIT CATEGORY
router.renderEditCategoryForm = function (req, res) {
    const { categoryId } = req.params;
    db.query("SELECT * FROM category WHERE category_id = ?", [categoryId], (error, results) => {
        if (error) throw error;
        res.render("categories/edit-category", { category_data: results[0] });
    })
}
router.editCategoryAction = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const category_cover = req.files ? req.files.category_cover : undefined;
        const { category_name, category_description } = req.body;
        console.log(category_cover);

        let updateQuery = 'UPDATE category SET category_name = ?, category_description = ?';
        const queryParams = [category_name, category_description];
        
        if (category_cover != undefined && path.extname(category_cover.name) != '.png' ) {
            return res.status(415).redirect(`/admin-panel?statusmessage=${encodeURIComponent('Invalid file type. Only .png files are allowed.')}`);
        }

        const [currentCategory] = await query('SELECT category_cover_path, category_name FROM category WHERE category_id = ?', [categoryId]);
        const currentCoverPath = currentCategory.category_cover_path;
        const currentCategoryName = currentCategory.category_name;

        let newCoverPath = currentCoverPath;

        if (category_cover) {
            const sanitizedCategoryName = category_name.trim().toLowerCase().replace(/\s+/g, '_');
            const coverFileName = `${sanitizedCategoryName}${path.extname(category_cover.name)}`;
            const coverPath = path.join(__dirname, './../public/images/categories-cover/', coverFileName);
            newCoverPath = path.join('/images/categories-cover/', coverFileName);

            updateQuery += `, category_cover_path = ?`;
            queryParams.push(newCoverPath);

            if (fs.existsSync(coverPath)) {
                fs.unlinkSync(coverPath);
            }

            category_cover.mv(coverPath, function(error) {
                if (error) {
                    console.error(error);
                    return res.status(500).send(error);
                }
            });
        } else if (category_name !== currentCategoryName) {
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

        res.status(200).redirect(`/admin-panel?statusmessage=${encodeURIComponent('Category edited successfully')}`);
    } catch (error) {
        console.error("Error editing category:", error);
        res.status(500).redirect(`/admin-panel?statusmessage=${encodeURIComponent('An error occurred while editing the category')}`);
    }
}

// DELETE CATEGORY
router.renderDeleteCategoryConfirm = function (req, res) {
    const { categoryId } = req.params;
    db.query("SELECT * FROM category WHERE category_id = ?", [categoryId], (error, results) => {
        if (error) throw error;
        res.render("categories/delete-category-confirm", { category_data: results[0] });
    })
}
router.confirmedCategoryDelete = async (req, res) => {
    try {
        const { categoryId, categoryName } = req.params;
        const sanitizedCategoryName = path.join(__dirname, './../public/images/categories-cover/', categoryName.toLowerCase().trim() + '.png') ;

        await fsp.rm(`${sanitizedCategoryName}`);
        await query("DELETE FROM category WHERE category_id = ?", [categoryId]);
        
        res.status(200).redirect(`/admin-panel?statusmessage=${encodeURIComponent('Category deleted successfully')}`);
    } catch (error) {
        console.error("Error deleting category:", error);
        res.status(500).redirect(`/admin-panel?statusmessage=${encodeURIComponent('An error occurred while deleting the category')}`);
    }
}

// CREATE GAME
router.renderCreateGameForm = function (req, res) {res.render("games/create-game-form");}
router.createGameAction = async (req, res) => {
    try {
        const game_zip = req.files.game_zip;
        const game_cover = req.files.game_cover;
        const { category_type, game_name, game_description, htp, featured } = req.body;
        const createQuery = `INSERT INTO game (category_type, game_name, game_description, localpath, htp, featured, cover_path ) VALUES (?, ?, ?, ?, ?, ?, ?)`;
        const queryParams = [category_type, game_name, game_description];

        if (!category_type || !game_cover || !game_name || !game_description || !htp || !featured) {
            return res.status(400).send("Missing required fields");
        }

        const sanitizedGameName = game_name.trim().toLowerCase().replace(/\s+/g, '_');

        const zipFileName = `${sanitizedGameName}${path.extname(game_zip.name)}`;
        const zipFilePath = path.join(__dirname, './../uploads/', zipFileName);
        const extractPath = path.join(__dirname, './../public/games/', sanitizedGameName);
        const localpath = `/games/${sanitizedGameName}/main.js`;
        queryParams.push(localpath);
        queryParams.push(htp);
        queryParams.push(featured);

        await fsp.writeFile(zipFilePath, game_zip.data);
        
        if (!fs.existsSync(extractPath)) {
            fs.mkdirSync(extractPath, { recursive: true });
        }

        const coverFileName = `${sanitizedGameName}${path.extname(game_cover.name)}`;
        const coverPath = path.join(__dirname, './../public/images/games-cover/', coverFileName);
        const coverPathSave = path.join('/images/games-cover/', coverFileName);
        queryParams.push(coverPathSave);

        game_cover.mv(coverPath, function(error) {
            if (error) {
                console.error(error);
                return res.status(500).send(error);
            }
        });

        fs.createReadStream(zipFilePath)
            .pipe(unzipper.Extract({ path: extractPath }))
            .on('close', async () => {
                await fsp.unlink(zipFilePath);
            })
            .on('error', (error) => {
                console.error('Error unzipping file:', error);
                res.status(500).send('Error unzipping file');
            });

        await query(createQuery, queryParams);

        res.status(200).redirect(`/admin-panel?statusmessage=${encodeURIComponent('Game created successfully')}`);
    } catch (error) {
        console.error('Error creating game: ', error);
        res.status(500).redirect(`/admin-panel?statusmessage=${encodeURIComponent('An error occurred while creating the game')}`);
    }
}

// EDIT GAME
router.renderEditGameForm = function (req, res) {

    const { gameId } = req.params;
    db.query("SELECT * FROM game WHERE game_id = ?", [gameId], (error, results) => {
        if (error) throw error;
        res.render("games/edit-game", { game_data: results[0] });
    })
}
router.editGameAction = async (req, res) => {
    try {
        const { gameId } = req.params;
        const game_zip = req.files ? req.files.game_zip : undefined;
        const game_cover = req.files ? req.files.game_cover : undefined;
        const { category_type, game_name, game_description, htp, featured } = req.body;
        const queryParams = [];

        const [currentGame] = await query('SELECT cover_path, game_name, localpath FROM game WHERE game_id = ?', [gameId]);
        const currentCoverPath = currentGame.cover_path;
        const currentGameName = currentGame.game_name;
        const currentLocalPath = currentGame.localpath;
        const currentExtractPath = path.join(__dirname, './../public', path.dirname(currentLocalPath));

        let updateQuery = 'UPDATE game SET';
        let setClauses = [];

        if (category_type !== undefined) {
            setClauses.push('category_type = ?');
            queryParams.push(category_type);
        }

        setClauses.push('game_name = ?');
        queryParams.push(game_name);

        if (game_description !== '') {
            setClauses.push('game_description = ?');
            queryParams.push(game_description);
        }

        if (htp !== '') {
            setClauses.push('htp = ?');
            queryParams.push(htp);
        }

        if (featured !== undefined) {
            setClauses.push('featured = ?');
            queryParams.push(featured);
        }

        let newCoverPath = currentCoverPath;

        if (game_cover) {
            const sanitizedGameName = game_name.trim().toLowerCase().replace(/\s+/g, '_');
            const coverFileName = `${sanitizedGameName}${path.extname(game_cover.name)}`;
            const coverPath = path.join(__dirname, './../public/images/games-cover/', coverFileName);
            const coverPathSave = path.join('/images/games-cover/', coverFileName);

            setClauses.push('cover_path = ?');
            queryParams.push(coverPathSave);

            if (fs.existsSync(coverPath)) {
                fs.unlinkSync(coverPath);
            }

            game_cover.mv(coverPath, function(error) {
                if (error) {
                    console.error(error);
                    return res.status(500).send(error);
                }
            });
        } else if (game_name !== currentGameName) {
            const sanitizedGameName = game_name.trim().toLowerCase().replace(/\s+/g, '_');
            const currentCoverFileName = path.basename(currentCoverPath);
            const newCoverFileName = `${sanitizedGameName}${path.extname(currentCoverFileName)}`;
            const newCoverFilePath = path.join(__dirname, './../public/images/games-cover/', newCoverFileName);
            const currentCoverFilePath = path.join(__dirname, './../public', currentCoverPath);

            fs.renameSync(currentCoverFilePath, newCoverFilePath);
            newCoverPath = path.join('/images/games-cover/', newCoverFileName);

            setClauses.push('cover_path = ?');
            queryParams.push(newCoverPath);
        }

        if (game_zip) {
            const sanitizedGameName = game_name.trim().toLowerCase().replace(/\s+/g, '_');
            const zipFileName = `${sanitizedGameName}${path.extname(game_zip.name)}`;
            const zipFilePath = path.join(__dirname, './../uploads/', zipFileName);
            const newExtractPath = path.join(__dirname, './../public/games/', sanitizedGameName);
            const newLocalPath = path.join('/games/', sanitizedGameName, '/main.js');

            setClauses.push('localpath = ?');
            queryParams.push(newLocalPath);

            if (fs.existsSync(currentExtractPath)) {
                fs.rmSync(currentExtractPath, { recursive: true, force: true });
            }

            await fsp.writeFile(zipFilePath, game_zip.data);

            if (!fs.existsSync(newExtractPath)) {
                fs.mkdirSync(newExtractPath, { recursive: true });
            }

            fs.createReadStream(zipFilePath)
                .pipe(unzipper.Extract({ path: newExtractPath }))
                .on('close', async () => {
                    await fsp.unlink(zipFilePath);
                })
                .on('error', (error) => {
                    console.error('Error unzipping file:', error);
                    return res.status(500).send('Error unzipping file');
                });
        } else if (game_name !== currentGameName) {
            const sanitizedGameName = game_name.trim().toLowerCase().replace(/\s+/g, '_');
            const currentGameDir = path.join(__dirname, './../public/games', currentGameName.trim().toLowerCase().replace(/\s+/g, '_'));
            const newGameDir = path.join(__dirname, './../public/games/', sanitizedGameName);
            newLocalPath = path.join('/games/', sanitizedGameName, '/main.js');

            if (fs.existsSync(currentGameDir)) {
                fs.renameSync(currentGameDir, newGameDir);
            }

            setClauses.push('localpath = ?');
            queryParams.push(newLocalPath);
        }

        updateQuery += ' ' + setClauses.join(', ') + ' WHERE game_id = ?';
        queryParams.push(gameId);

        await query(updateQuery, queryParams);

        res.status(200).redirect(`/admin-panel?statusmessage=${encodeURIComponent('Game edited successfully')}`);
    } catch (error) {
        console.error('Error editing game: ', error);
        res.status(500).redirect(`/admin-panel?statusmessage=${encodeURIComponent('An error occurred while editing the game')}`);
    }
};


// DELETE GAME
router.renderDeleteGameConfirm = function (req, res) {
    const { gameId } = req.params;
    db.query("SELECT * FROM game WHERE game_id = ?", [gameId], (error, results) => {
        if (error) throw error;
        res.render("games/delete-game-confirm", { game_data: results[0] });
    })
}
router.confirmedGameDelete = async (req, res) => {
    try {
        const { gameId, gameName } = req.params;
        const sanitizedGameCover = path.join(__dirname, './../public/images/games-cover/', gameName.toLowerCase().trim() + '.jpg') ;
        const sanitizedGamePath = path.join(__dirname, './../public/games', gameName.toLowerCase().trim());

        await fsp.rm(`${sanitizedGameCover}`);
        await fsp.rm(`${sanitizedGamePath}`, { recursive: true, force: true })
        await query("DELETE FROM game WHERE game_id = ?", [gameId]);
        
        res.status(200).redirect(`/admin-panel?statusmessage=${encodeURIComponent('Game deleted successfully')}`);
    } catch (error) {
        console.error('Error deleting game: ', error);
        res.status(500).redirect(`/admin-panel?statusmessage=${encodeURIComponent('An error occurred while deleting the game')}`);
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

        res.status(200).redirect(`/admin-panel?statusmessage=${encodeURIComponent('User created successfully')}`);
    } catch (error) {
        console.error('Error creating user: ', error);
        res.status(500).redirect(`/admin-panel?statusmessage=${encodeURIComponent('An error occurred while creating the category')}`);
    }
}

// EDIT USER
router.renderEditUserForm = function (req, res) {
    const { userId } = req.params;
    db.query("SELECT * FROM users WHERE user_id = ?", [userId], (error, results) => {
        if (error) throw error;
        res.render("users/edit-user", { user_data: results[0] });
    })
}
router.editUserAction = async (req, res) => {
    try {
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

        await query(updateQuery, queryParams);

        res.status(200).redirect(`/admin-panel?statusmessage=${encodeURIComponent('User edited successfully')}`);
    } catch (error) {
        console.error('Error editing user: ', error);
        res.status(500).redirect(`/admin-panel?statusmessage=${encodeURIComponent('An error occurred while editing the user')}`);
    }
}

// DELETE USER
router.renderDeleteUserConfirm = function (req, res) {
    const { userId } = req.params;
    db.query("SELECT * FROM users WHERE user_id = ?", [userId], (error, results) => {
        if (error) throw error;
        res.render("users/delete-user-confirm", { user_data: results[0] });
    })
}
router.confirmedUserDelete = async (req, res) => {
    try {
        const { userId } = req.params;
        await query("DELETE FROM users WHERE user_id = ?", [userId]);
        
        res.status(200).redirect(`/admin-panel?statusmessage=${encodeURIComponent('User deleted successfully')}`);
    } catch (error) {
        console.error('Error deleting user: ', error);
        res.status(500).redirect(`/admin-panel?statusmessage=${encodeURIComponent('An error occurred while deleting the user')}`);
    }
}

module.exports = router;