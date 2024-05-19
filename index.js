// -- HANDLERS PRINCIPALES
const express = require('express');
const mysql = require('mysql2');
const favicon = require('serve-favicon');
const fileUpload = require('express-fileupload');
const session = require('express-session');
require('dotenv').config()

const app = express();

const profileRoutes = require('./routes/profile_routes');
const categoryRoutes = require('./routes/category_routes');
const gameRoutes = require('./routes/game_routes');
const authRoutes = require('./routes/auth_routes');
const adminPanelRoutes = require('./routes/admin_panel_routes');

app.use('/my_profile', profileRoutes);
app.use('/category', categoryRoutes);
app.use('/games', gameRoutes);
app.use('/auth', authRoutes);
app.use('/admin-panel', adminPanelRoutes);
app.use(fileUpload());

app.use(errorHandler);
app.use(express.static(__dirname + '/public'));
app.use(favicon(__dirname + '/public/images/favicon.ico'));
app.use(express.urlencoded({ extended: true }));
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

app.set('views', __dirname + '/views');
app.set('view engine', 'pug');

app.listen(3000, ()=> {
    console.log('Server up and running')
});

// -- CONEXION A BD

const db = mysql.createPool({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_ROOT,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

// -- HOME

app.get('/', function(req, res){

    db.query('SELECT * FROM game WHERE featured IS TRUE', (err, results)=>{
        if(err) throw err;
        res.render('index', { featured: results, isLoggedIn: req.session.isLoggedIn, user_id: req.session.userId });
    })
});

// -- ADMIN PANEL ROUTES

    function requireAdmin(req, res, next) {
        const user_role = req.session.userRoleLevel;

        if(user_role != 3) {
            res.status(403).send("You don't have the authorization to enter this page");
        } else {
            next();
        }
    }

    app.get('/admin-panel', requireAdmin, adminPanelRoutes.renderAdminPanel);

    app.get('/admin_panel_categories', (req, res) => {
        db.query('SELECT * FROM category', (err, results) =>{
            if(err) throw err;
            res.json(results)
        });
    });

    app.get('/admin_panel_games', (req, res) => {
        db.query('SELECT game.*, category.* FROM game INNER JOIN category ON game.category_type = category.category_id', (err, results) =>{
            if(err) throw err;
            res.json(results)
        });
    });

    app.get('/admin_panel_users', (req, res) => {
        db.query('SELECT * FROM users', (err, results) =>{
            if(err) throw err;
            res.json(results)
        });
    });
    
    // -- CREATE (ADMIN-PANEL)
    app.get("/admin_panel_category/create", requireAdmin, adminPanelRoutes.renderCreateCategoryForm); // CATEGORY
    app.post("/admin_panel_category/create_action", adminPanelRoutes.createCategoryAction); // CATEGORY
    app.get("/admin_panel_games/create", requireAdmin, adminPanelRoutes.renderCreateGameForm); // GAME
    app.post("/admin_panel_games/create_action", adminPanelRoutes.createGameAction); // GAME
    app.get("/admin_panel_users/create", requireAdmin, adminPanelRoutes.renderCreateUserForm); // USER
    app.post("/admin_panel_users/create_action", adminPanelRoutes.createUserAction); // USER

    // -- EDIT (ADMIN-PANEL)
    app.get("/admin_panel_categories/edit/:categoryId", requireAdmin, adminPanelRoutes.renderEditCategoryForm); // CATEGORY
    app.post("/admin_panel_categories/edit_action/:categoryId", adminPanelRoutes.editCategoryAction); // CATEGORY
    app.get("/admin_panel_games/edit/:gameId", requireAdmin, adminPanelRoutes.renderEditGameForm); // GAME
    app.post("/admin_panel_games/edit_action/:gameId", adminPanelRoutes.editGameAction); // GAME
    app.get("/admin_panel_users/edit/:userId", requireAdmin, adminPanelRoutes.renderEditUserForm); // USER
    app.post("/admin_panel_users/edit_action/:userId", adminPanelRoutes.editUserAction); // USER

    // -- DELETE (ADMIN-PANEL)
    app.get("/admin_panel_category/delete/confirm/:categoryId", requireAdmin, adminPanelRoutes.renderDeleteCategoryConfirm); // CATEGORY
    app.post("/admin_panel_category/delete/:categoryId/:categoryName", adminPanelRoutes.confirmedCategoryDelete); // CATEGORY
    app.get("/admin_panel_games/delete/confirm/:gameId", requireAdmin, adminPanelRoutes.renderDeleteGameConfirm); // GAME
    app.post("/admin_panel_games/delete/:gameId/:gameName", adminPanelRoutes.confirmedGameDelete); // GAME
    app.get("/admin_panel_users/delete/confirm/:userId", requireAdmin, adminPanelRoutes.renderDeleteUserConfirm); // USER
    app.post("/admin_panel_users/delete/:userId", adminPanelRoutes.confirmedUserDelete); // USER

// -- USER PROFILE ROUTES

app.get('/my_profile/:userId', profileRoutes.showUserProfile);
app.get('/add_edit_bio/:userId', profileRoutes.addEditUserBio);
app.get('/user_linked_games/:userid', profileRoutes.userLinkedGames);
app.get('/user/:userId/profile-image', profileRoutes.serveUserPFP);
app.get('/uploadPFP/:userId', profileRoutes.uploadPFP);
app.post('/uploadPFP/action/:userId', profileRoutes.uploadPFP_action);
app.post('/add_edit_bio/action/:userId', profileRoutes.addEditUserBio_action);

// -- CATEGORY ROUTES

app.get('/categories', categoryRoutes.showAllCategories);

// -- GAME ROUTES

app.get('/games/:id', gameRoutes.showGameById);
app.get('/games_category/:id', gameRoutes.showGamesByCategory);

// -- AUTH ROUTES

app.get('/auth', authRoutes.showForms);
app.get("/auth/logout", authRoutes.logout);
app.post("/auth/register", authRoutes.processRegister);
app.post("/auth/login", authRoutes.processLogin);