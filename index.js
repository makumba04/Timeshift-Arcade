const express = require('express');
const app = express();

app.use(express.static(__dirname + '/public'));

app.set('views', __dirname + '/views');
app.set('view engine', 'pug');

app.listen(3000, ()=> {
    console.log('Server up and running')
});

// ### RUTAS ###

app.get('/', function(req, res){
    res.render('index');
});

// Hay que crear la BD y las tablas antes de correr esto

// app.get('/games/:id', function(req, res){
//     const {id} = req.params;
//     // db.query('SELECT modelos.nombreModelo, modelos.intro, modelos.historia, modelos.legado, generaciones.id, generaciones.rutaPortada, generaciones.nombreGeneracion, generaciones.periodo FROM modelos INNER JOIN generaciones ON modelos.id = generaciones.modelo_id WHERE modelos.id = ?', [id], (err, results) => {
//     //   if (err) throw err;
//     //   res.render('ModelTemplate', {
//     //     title: 'modelo',
//     //     modelo: results
//     //   });
//     // })
// });