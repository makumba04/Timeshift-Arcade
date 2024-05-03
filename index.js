// ### APP ###

// Definimos las constantes principales
const express = require('express'); // El handler del constructor de ExpressJS
// const dotenv = require('dotenv'); // El handler para cargar variables de entorno
const mysql = require('mysql2'); // El handler para crear la conexión a base de datos
const app = express(); // El handler de la propia app creado por el constructor de express
const favicon = require('serve-favicon');

app.use(express.static(__dirname + '/public'));
app.use(favicon(__dirname + '/public/images/favicon.ico'));

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

// ### RUTAS ###

app.get('/', function(req, res){
    db.query('SELECT * FROM game WHERE featured IS TRUE', (err, results)=>{
        if(err) throw err;
        res.render('index', {
            title: 'featured',
            featured: results
        });
    })
});

app.get('/admin-panel', function(req, res){
    res.render('admin-panel')
});

app.get('/categories', function(req, res){
    db.query('SELECT * FROM category', (err, results) => {
        if (err) throw err;
        res.render('categories', {
            title: 'categories',
            categories: results
        });
    })
});

app.get('/games/:id', function(req, res){
    const {id} = req.params;
    db.query('SELECT * FROM game WHERE game_id = ?', [id], (err, results) => {
        if (err) throw err;
        res.render('game', {
            title: 'game',
            game: results[0]
        });
    })
});

// IMPORTANTE!!!! PARA QUE MUESTRE EL NOMBRE DE CATEGORIA DEBE HABER AL MENOS UN JUEGO DENTRO DE LA MISMA
app.get('/games_category/:id', function(req, res){
    const {id} = req.params;
    db.query('SELECT * FROM game INNER JOIN category ON category.category_id = game.category_type WHERE game.category_type = ?', [id], (err, results) => {
        if (err) throw err;
        res.render('games-by-category', {
            title: 'games',
            games: results
        });
    })
});

app.get('/auth', function(req, res){
    res.render('auth');
});