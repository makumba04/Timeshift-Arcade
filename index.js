const express = require('express');
const api = express();

api.use(express.static(__dirname + '/public'));

api.listen(3000, ()=> {
    console.log('Server up and running')
});

// ### RUTAS ###

// app.get('/', function(req, res){
//     if (err) throw err;
//       res.render('index', {
//         title: 'modelos',
//         modelos: results
//     });
// });