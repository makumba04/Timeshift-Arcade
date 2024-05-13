// ### APP ###

// Definimos las constantes principales
const express = require('express'); // El handler del constructor de ExpressJS
// const dotenv = require('dotenv'); // El handler para cargar variables de entorno
const mysql = require('mysql2'); // El handler para crear la conexión a base de datos
const app = express(); // El handler de la propia app creado por el constructor de express
const bcrypt = require('bcrypt');
const favicon = require('serve-favicon');
const { promisify } = require('util');
const session = require('express-session');
const { isSymbolObject } = require('util/types');

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

// dotenv.config({ path: './config.env'}) -- El archivo config.env por ahora da problemas, mejor no añadirlo hasta que se haya terminado todo

// ### CONEXION BD ###

const db = mysql.createConnection({ // Aquí se declaran las variables para conectar con la base de datos
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'timeshiftdb'
})
  
db.connect((err) => { // Aquí se realiza la conexión
    if (err) { // Si ocurriera algún problema a la hora de conectarse
      console.error('Error connecting to MySQL:', err); // Manda el error en un mensaje
      return;
    }
    console.log('Connected to MySQL database'); // Si funciona correctamente, muestra un mensaje de confirmación de conexión
});

const query = promisify(db.query).bind(db);
// ### RUTAS ###

app.get('/', function(req, res){

    db.query('SELECT * FROM game WHERE featured IS TRUE', (err, results)=>{
        if(err) throw err;
        res.render('index', {
            title: 'featured',
            featured: results,
            isLoggedIn: req.session.isLoggedIn,
            user_id: req.session.userId
        });
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

    app.get('/admin-panel', requireAdmin, function(req, res){
        res.render('admin-panel/admin-panel')
    });

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
    
    // -- CREATE CATEGORY

        app.get("/admin_panel_category/create", requireAdmin, async (req, res) => {
            try {
                res.render("categories/create-category-form");
            } catch (error) {
                console.error("Error displaying form page:", error);
                res.status(500).send("An error occurred while displaying form page");
            }
        });

        app.post("/admin_panel_category/create_action", async (req, res) => {
            try {
                // Get the request body
                const { category_cover, category_name, category_description } = req.body;

                // Validate input
                if (!category_cover || !category_name || !category_description) {
                    return res.status(400).send("Missing required fields");
                }

                // Insert the user into the database
                const queryResult = await query(
                    `INSERT INTO category (category_cover, category_name, category_description) VALUES (?, ?, ?)`,
                    [category_cover, category_name, category_description]
                );

                res.redirect('/admin-panel');
            } catch (error) {
                // Handle errors
                console.error("Error registering category:", error);
                res.status(500).send("An error occurred while registering the category");
            }
        })

    // -- EDIT CATEGORY
        app.get("/admin_panel_categories/edit/:categoryId", requireAdmin, async (req, res) => {
            try {
                const { categoryId } = req.params;
                const categoryData = await query("SELECT * FROM category WHERE category_id = ?", [categoryId]);

                res.render("categories/edit-category", { category_data: categoryData[0]});
            } catch (error) {
                console.error("Error displaying form page:", error);
                res.status(500).send("An error occurred while displaying form page");
            }
        });

        app.post("/admin_panel_categories/edit_action/:categoryId", async (req, res) => {
            try {
                const { categoryId } = req.params;
                const { category_cover, category_name, category_description } = req.body;
                const queryParams = [category_cover, category_name, category_description, categoryId];
                
                var updateQuery = 'UPDATE category SET category_cover = ?, category_name = ?, category_description = ? WHERE category_id = ?';
                
                const queryResult = await query(updateQuery, queryParams);
        
                res.redirect('/admin-panel');
            } catch (error) {
                // Handle errors
                console.error("Error updating user:", error);
                res.status(500).send("An error occurred while updating the user");
            }
        })
    
    // -- DELETE CATEGORY
        app.get("/admin_panel_category/delete/confirm/:categoryId", requireAdmin, async (req, res) => {
            try {
                const { categoryId } = req.params;
                const categoryData = await query("SELECT * FROM category WHERE category_id = ?", [categoryId]);
        
                res.render("categories/delete-category-confirm", { category_data: categoryData[0] });
            } catch (error) {
                console.error("Error displaying confirmation page:", error);
                res.status(500).send("An error occurred while displaying confirmation page");
            }
        });

        app.post("/admin_panel_category/delete/:categoryId", async (req, res) => {
            try {
                const { categoryId } = req.params;

                await query("DELETE FROM category WHERE category_id = ?", [categoryId]);
                // res.status(200).send("User deleted successfully");
                
                res.redirect('/admin-panel');
            } catch (error) {

                console.error("Error deleting user:", error);
                res.status(500).send("An error occurred while deleting the category");
            }
        });

    // -- CREATE GAME
        app.get("/admin_panel_games/create", requireAdmin, async (req, res) => {
            try {
                res.render("games/create-game-form");
            } catch (error) {
                console.error("Error displaying form page:", error);
                res.status(500).send("An error occurred while displaying form page");
            }
        });

        app.post("/admin_panel_games/create_action", async (req, res) => {
            try {
                // Get the request body
                const { category_type, game_cover, game_name, game_description, localpath, htp, featured } = req.body;

                // Validate input
                if (!category_type || !game_cover || !game_name || !game_description || !localpath || !htp || !featured) {
                    return res.status(400).send("Missing required fields");
                }

                // Insert the user into the database
                const queryResult = await query(
                    `INSERT INTO game (category_type, game_cover, game_name, game_description, localpath, htp, featured ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
                    [category_type, game_cover, game_name, game_description, localpath, htp, featured]
                );

                res.redirect('/admin-panel');
            } catch (error) {
                // Handle errors
                console.error("Error registering game:", error);
                res.status(500).send("An error occurred while registering the game");
            }
        })
    
    // -- EDIT GAME
        app.get("/admin_panel_games/edit/:gameId", requireAdmin, async (req, res) => {
            try {
                const { gameId } = req.params;
                const gameData = await query("SELECT * FROM game WHERE game_id = ?", [gameId]);

                res.render("games/edit-game", { game_data: gameData[0]});
            } catch (error) {
                console.error("Error displaying form page:", error);
                res.status(500).send("An error occurred while displaying form page");
            }
        });

        app.post("/admin_panel_games/edit_action/:gameId", async (req, res) => {
            try {
                const { gameId } = req.params;
                const { category_type, game_cover, game_name, game_description, localpath, htp, featured } = req.body;
                const queryParams = [];
                
                var updateQuery = 'UPDATE game SET';

                if (category_type !== undefined) {
                    updateQuery += ` category_type = ?, `;
                    queryParams.push(category_type);
                }
                updateQuery += ` game_cover = ?, game_name = ?`;
                
                queryParams.push(game_cover);
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

                updateQuery += ` WHERE game_id = ?`;
                queryParams.push(gameId);
                
                const queryResult = await query(updateQuery, queryParams);
        
                res.redirect('/admin-panel');
            } catch (error) {
                // Handle errors
                console.error("Error updating user:", error);
                res.status(500).send("An error occurred while updating the user");
            }
        })

    // -- DELETE GAME
        app.get("/admin_panel_games/delete/confirm/:gameId", requireAdmin, async (req, res) => {
            try {
                const { gameId } = req.params;
                const gameData = await query("SELECT * FROM game WHERE game_id = ?", [gameId]);
        
                res.render("games/delete-game-confirm", { game_data: gameData[0] });
            } catch (error) {
                console.error("Error displaying confirmation page:", error);
                res.status(500).send("An error occurred while displaying confirmation page");
            }
        });

        app.post("/admin_panel_games/delete/:gameId", async (req, res) => {
            try {
                const { gameId } = req.params;

                await query("DELETE FROM game WHERE game_id = ?", [gameId]);
                // res.status(200).send("User deleted successfully");
                
                res.redirect('/admin-panel');
            } catch (error) {

                console.error("Error deleting user:", error);
                res.status(500).send("An error occurred while deleting the game");
            }
        });

    // -- CREATE USER

        app.get("/admin_panel_users/create", requireAdmin, async (req, res) => {
            try {
                res.render("users/create-user-form");
            } catch (error) {
                console.error("Error displaying form page:", error);
                res.status(500).send("An error occurred while displaying form page");
            }
        });

        app.post("/admin_panel_users/create_action", async (req, res) => {
            try {
                // Get the request body
                const { username, email, password } = req.body;
        
                // Validate input
                if (!username || !email || !password) {
                    return res.status(400).send("Missing required fields");
                }
        
                // Hash the password
                const hashedPassword = await bcrypt.hash(password, 10);
        
                // Insert the user into the database
                const queryResult = await query(
                    `INSERT INTO users (username, email, passwd, user_role) VALUES (?, ?, ?, 1)`,
                    [username, email, hashedPassword]
                );
        
                res.redirect('/admin-panel');
            } catch (error) {
                // Handle errors
                console.error("Error registering user:", error);
                res.status(500).send("An error occurred while registering the user");
            }
        })

    // -- EDIT USER
        app.get("/admin_panel_users/edit/:userId", requireAdmin, async (req, res) => {
            try {
                const { userId } = req.params;
                const userData = await query("SELECT * FROM users WHERE user_id = ?", [userId]);

                res.render("users/edit-user", { user_data: userData[0]});
            } catch (error) {
                console.error("Error displaying confirmation page:", error);
                res.status(500).send("An error occurred while displaying confirmation page");
            }
        });

        app.post("/admin_panel_users/edit_action/:userId", async (req, res) => {
            try {
                // Get the request body
                const { userId } = req.params;
                const { username, email, password, user_role } = req.body;
        
                // Hash the password
                const hashedPassword = await bcrypt.hash(password, 10);
        
                // Construct the parameter array for the query
                const queryParams = [username, email, hashedPassword];
        
                // Construct the SET clause for the update query
                let updateQuery = `UPDATE users SET username = ?, email = ?, passwd = ?`;
        
                // If user_role is provided, include it in the query and parameters
                if (user_role !== undefined) {
                    updateQuery += `, user_role = ?`;
                    queryParams.push(user_role);
                }
        
                // Add the userId parameter to the end of the array
                queryParams.push(userId);
        
                // Add the WHERE clause to the update query
                updateQuery += ` WHERE user_id = ?`;
        
                // Execute the update query
                const queryResult = await query(updateQuery, queryParams);
        
                res.redirect('/admin-panel');
            } catch (error) {
                // Handle errors
                console.error("Error updating user:", error);
                res.status(500).send("An error occurred while updating the user");
            }
        })
        

    // -- DELETE USER
        app.get("/admin_panel_users/delete/confirm/:userId", requireAdmin, async (req, res) => {
            try {
                const { userId } = req.params;
                const userData = await query("SELECT * FROM users WHERE user_id = ?", [userId]);
        
                res.render("users/delete-user-confirm", { user_data: userData[0] });
            } catch (error) {
                console.error("Error displaying confirmation page:", error);
                res.status(500).send("An error occurred while displaying confirmation page");
            }
        });

        app.post("/admin_panel_users/delete/:userId", async (req, res) => {
            try {
                const { userId } = req.params;

                await query("DELETE FROM users WHERE user_id = ?", [userId]);
                // res.status(200).send("User deleted successfully");
                
                res.redirect('/admin-panel')
            } catch (error) {

                console.error("Error deleting user:", error);
                res.status(500).send("An error occurred while deleting the user");
            }
        });

// -- ADMIN PANEL ROUTES

app.get('/my_profile/:userId', function(req, res){
    const {userId} = req.params;
    db.query('SELECT * FROM users WHERE user_id = ?', [userId], (err, results) => {
        if(err) throw err;
        res.render('users/profile', {
            title: 'user_data',
            user_data: results[0]
        });
    })
});

app.get('/add_edit_bio/:userId', function(req, res){
    const {userId} = req.params;
    db.query('SELECT * FROM users WHERE user_id = ?', [userId], (err, results) => {
        if(err) throw err;
        res.render('users/add_edit_bio', {
            title: 'user_data',
            user_data: results[0]
        });
    })
})

app.post('/add_edit_bio/action/:userId', async (req, res) => {
    try {
        // Get the request body
        const { userId } = req.params;
        const { user_bio } = req.body;
        const queryParams = [user_bio, userId];

        var updateQuery = `UPDATE users SET user_bio = ? WHERE user_id = ?`;
        
        const queryResult = await query(updateQuery, queryParams);
        
        res.redirect(`/my_profile/${userId}`);
    } catch (error) {
        // Handle errors
        console.error("Error updating user:", error);
        res.status(500).send("An error occurred while updating the user");
    }
})

app.get('/user_linked_games/:userid', function(req, res){
    const {userId} = req.params;
    db.query('SELECT game.* FROM game INNER JOIN saves ON game.game_id = saves.game_id INNER JOIN users ON users.user_id = saves.user_id WHERE users.user_id = ?', [userId], (err, results) => {
        if (err) throw err;
        res.json(results);
    })
})

app.get('/categories', function(req, res){
    db.query('SELECT * FROM category', (err, results) => {
        if (err) throw err;
        res.render('categories/categories', {
            title: 'categories',
            categories: results,
            isLoggedIn: req.session.isLoggedIn,
            user_id: req.session.userId
        });
    })
});

app.get('/games/:id', function(req, res){
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
});

app.get('/games_category/:id', function(req, res){
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
});

app.get('/auth', function(req, res){
    res.render('auth');
});

app.post("/auth/register", async (req, res) => {
    try {
        // Get the request body
        const { username, email, password } = req.body;

        // Validate input
        if (!username || !email || !password) {
            return res.status(400).send("Missing required fields");
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert the user into the database
        const queryResult = await query(
            `INSERT INTO users (username, email, passwd, user_role) VALUES (?, ?, ?, 1)`,
            [username, email, hashedPassword]
        );

        res.redirect('/');
    } catch (error) {
        // Handle errors
        console.error("Error registering user:", error);
        res.status(500).send("An error occurred while registering the user");
    }
});

app.post("/auth/login", async (req, res) => {
    try {
        // Get the request body
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).send("Missing email or password");
        }

        // Check if the user exists in the database
        const user = await query("SELECT * FROM users WHERE email = ?", [email]);

        if (user.length === 0) {
            return res.status(401).send("Invalid email or password");
        }

        // Verify the password
        const isValidPassword = await bcrypt.compare(password, user[0].passwd);

        if (!isValidPassword) {
            return res.status(401).send("Invalid email or password");
        }

        // Set session variable for authentication
        req.session.userId = user[0].user_id;
        req.session.userRoleLevel = user[0].user_role; // Save user's role level
        req.session.isLoggedIn = true; // Flag indicating user is logged in

        // Redirect the user to the main page with a success message
        res.redirect("/?loginSuccess=true");

    } catch (error) {
        // Handle errors
        console.error("Error logging in:", error);
        res.status(500).send("An error occurred while logging in");
    }
});

app.get("/auth/logout", (req, res) => {
    // Clear session variables
    req.session.destroy(err => {
        if (err) {
            console.error("Error logging out:", err);
            res.status(500).send("An error occurred while logging out");
        } else {
            // Redirect to home page after logout
            res.redirect("/auth");
        }
    });
});