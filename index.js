// require modules to create the server
const express = require('express');
    morgan = require('morgan'),
    path = require('path'),
    bodyParser = require('body-parser'),
    uuid = require('uuid');

const app = express();

app.use(bodyParser.json());

app.use(morgan('common'));

app.use(express.static('public'));

//Created JSON object to carry movie data.
let movies = [
    {
      title: 'Inception',
      director: ['Christopher Nolan'],
      genre: ['Action', 'Science Fiction'],
      releaseYear: 2010
    },
    {
      title: 'Your Name',
      director: 'Makoto Shinkai',
      genre: ['Animated', 'Romance', 'Drama'],
      releasedYear: 2016
    },
    {
      title: 'Scrubs',
      director: 'Bill Lawrence', 
      genre:['Medical drama', 'Comedy-drama', 'Sitcom'],
      releasedYear: 2001
    },
    {
      title: 'New Girl',
      director: 'Elizabeth Meriwether',
      genre:'Sitcom',
      releasedYear: 2011
    },
    {
      title: 'Brooklyn 99', 
      director: ['Dan Goor', 'Michael Schur'],
      genre: ['Police procedural Sitcom'],
      releasedYear: 2013
    },
    {
      title: 'The Matrix',
      director: 'The Wachowskis',
      genre: ['Action', 'Science Fiction'],
      releasedYear: 1999
    },
    {
      title: 'Parasite',
      director: 'Bong Joon-ho',
      genre: ['Thriller', 'Black Comedy'],
      releasedYear: 2019
    },
    {
      title: 'Forrest Gump',
      director: 'Robert Zemeckis',
      genre: ['Comedy', 'Drama'],
      releasedYear: 1994
    },
    {
      title: 'Wedding Crashers',
      director: 'David Dobkin',
      genre: ['Romance', 'Comedy'],
      releasedYear: 2005
    },
    {
      title: 'BoJack Horseman',
      director: 'Raphael Bob-Waksberg',
      genre: ['Sitcom', 'Comedy','Drama', 'Animated'],
      releasedYear: 2014
    }
];

// Get index request/route
app.get('/', (req, res) => {
  res.send('Welcome to myMovies!');
});

// Get documentation request/route
app.get('/documentation', (req, res) => {
  res.sendFile('public/documentation.html', {root: __dirtitle});
});

//Get movies request/route
app.get('/movies', (req, res) =>{
  res.json(movies); //return json object containing movies
});

// Gets the data about a movie , by name
app.get('/movies/:title', (req, res) => {
  res.json(movies.find((movie) =>
    { return movie.title === req.params.title
  }));
});

//Error handler middleware function
app.use((err, req, res, next) => {
  console.error(err.stack); //log all caught error to terminal
  res.status(500).send('An error has been found!');
  next();
});

//Listens to requests on port.
app.listen(8080, () => {
  console.log('This app is listening on port 8080.');
});