// require modules to create the server
const express = require('express');
const morgan = require('morgan');

const app = express();

// create middle functions to...
app.use(morgan('common')); //log all requests on terminal
app.use(express.static('public')); // serve all static file in public folder 

// Get index request/route
app.get('/', (req, res) => {
  res.send('Welcome to myMovies!');
});

// Get documentation request/route
app.get('/documentation', (req, res) => {
  res.send('public/documentation.html', {root: __dirname });
});

//Get movies request/route
app.get('/movies', (req, res) =>{
    res.json(myMovies); //return json object containing movies
    });

//Listens to requests on port.
app.listen(8080, () =>{
    console.log('This app is listening on port 8080.');
  });