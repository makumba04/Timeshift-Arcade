// ### APP ###

// Definimos las dos constantes principales
const express = require('express'); // El handler del constructor de ExpressJS
const app = express(); // El handler de la propia app creado por el constructor de express
const mysql = require('mysql2'); // El handler para crear la conexión a base de datos

app.use(express.static(__dirname + '/public'));

app.set('views', __dirname + '/views');
app.set('view engine', 'pug');

app.listen(3000, ()=> {
    console.log('Server up and running')
});

// ### CONEXION BD ###

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'timeshiftdb',
});
  
db.connect((err) => {
    if (err) {
      console.error('Error connecting to MySQL:', err);
      return;
    }
    console.log('Connected to MySQL database');
});

// ### RUTAS ###

app.get('/', function(req, res){
    res.render('index');
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