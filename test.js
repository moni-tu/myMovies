const express = require('express'),
  bodyParser = require('body-parser'),
  uuid = require('uuid');

const app = express();

app.use(bodyParser.json());

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

// Gets the list of data about ALL movies to the user
app.get('/movies', (req, res) => {
    res.status(200).json(movies);

// Gets the data about a single movie, by name

app.get('/movies/:name', (req, res) => {
    res.status(200).json(movies.find((movie) =>
        { return movie.name === req.params.name }));
    });

// Adds a new movie to our list of movies.
app.post('/movies/:movieName', (req, res) => {
    let newMovie = req.body;
  
    if (!newMovie.name) {
      const message = 'Missing name in request body';
      res.status(400).send(message);
    } else {
      newMovie.id = uuid.v4();
      movies.push(newMovie);
      res.status(201).send(newMovies);
    }
  });

// Deletes a movie from our list by ID
app.delete('/movies/:deleteMovie', (req, res) => {
let movies = movies.find((movie) => { return movie.id === req.params.id });

if (movie) {
    movies = movies.filter((obj) => { return obj.id !== req.params.id });
    res.status(201).send('movie ' + req.params.id + ' was deleted.');
}
});

// Update the "genre" of a movie by movie name/genre name
app.put('/movies/:name/:genre', (req, res) => {
let movie = movies.find((movie) => { return movie.name === req.params.name });

if (movie) {
    movie.classes[req.params.class] = parseInt(req.params.genre);
    res.status(201).send('Movie ' + req.params.name + ' was assigned a genre of ' + req.params.genre + ' in ' + req.params.class);
} else {
    res.status(404).send('Movie with the name ' + req.params.name + ' was not found.');
}
})});

app.listen(8080, () => {
    console.log('Your app is listening on port 8080');
  });
