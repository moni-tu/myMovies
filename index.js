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


app.listen(8080, () =>{
  console.log('This app is listening on port 8080.');
});

// 1. Gets the list of data about ALL movies to the user
app.get('/movies', (req, res) => {
res.status(200).json(movies);

// 2. Gets the data about a single movie, by titles

app.get('/movies/:title', (req, res) => {
res.status(200).json(movies.find((movie) =>
    { return movie.title === req.params.title}));
});

// 3.Return data about a genre (description) by name/title (e.g., “Thriller”)
app.get('/movies/:genre', (req, res) => {
  res.json(movies.find((movie) => {
    return movie.genre === req.params.genre;
  }));
});

// 4.Return data about a director (bio, birth year, death year) by name
app.get('/movies/:director', (req, res) => {
  res.status(200).json(movies.find((director) => {
      return movies.director.name === req.params.name
  })) 
})
// 5.Allow new user
app.post('/users/:newUser', (req, res) => {
  res.send('Seccessful registration')
});

// 6.Allow users to update their user information
app.put('/users/:Username', (req, res) => {
  res.send('Seccessful update')
});

// Adds data for a new movie to our list of movies.
app.post('/movies/:newMovie', (req, res) => {
let newMovie = req.body;

if (!newMovie.title) {
  const message = 'Missing title in request body';
  res.status(400).send(message);
} else {
  newMovie.title = uuid.v4();
  movies.push(newMovie);
  res.status(201).send(newMovie);
}
});

// Deletes a movie from our list by title
app.delete('/movies/:title', (req, res) => {
let movie = movies.find((movie) => { return movie.title === req.params.title });

if (movie) {
movies = movies.filter((obj) => { return obj.title !== req.params.title });
res.status(201).send('movie ' + req.params.title + ' was deleted.');
}
});

// Update the genre of a movie by movie title
app.put('/movies/:title/:genre', (req, res) => {
let movie = movies.find((movie) => { return movie.title === req.params.title });

if (movie) {
movie.title[req.params.title] = parseInt(req.params.genre);
res.status(201).send('Movie ' + req.params.title + ' was assigned a genre of ' + req.params.genre + ' in ' + req.params.title);
} else {
res.status(404).send('Movie with the name ' + req.params.title + ' was not found.');
}
})});

