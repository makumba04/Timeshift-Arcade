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