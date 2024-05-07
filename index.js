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

app.get('/admin-panel', function(req, res){
    res.render('admin-panel')
});

app.get('/my_profile/:userId', function(req, res){
    const {userId} = req.params;
    db.query('SELECT * FROM users WHERE user_id = ?', [userId], (err, results) => {
        if(err) throw err;
        res.render('profile', {
            title: 'user_data',
            user_data: results[0]
        });
    })
});

app.get('/categories', function(req, res){
    db.query('SELECT * FROM category', (err, results) => {
        if (err) throw err;
        res.render('categories', {
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
        res.render('game', {
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
        res.render('games-by-category', {
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
            res.redirect("/");
        }
    });
});
