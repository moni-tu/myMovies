const express = require('express'),
  bodyParser = require('body-parser'),
  uuid = require('uuid');

const app = express();

app.use(bodyParser.json());

//Gets the list of data about ALL movies
app.get('/movies', (req, res) => {
    res.json(movies);

// Gets the data about a single movie, by name

app.get('/movies/:name', (req, res) => {
    res.json(movies.find((movie) =>
        { return movie.name === req.params.name }));
    });

// Adds data for a new movie to our list of movies.
app.post('/students', (req, res) => {
    let newMovie = req.body;
  
    if (!newMovie.name) {
      const message = 'Missing name in request body';
      res.status(400).send(message);
    } else {
      newMovie.id = uuid.v4();
      movies.push(newStudent);
      res.status(201).send(newMovies);
    }
  });

// Deletes a movie from our list by ID
app.delete('/movies/:id', (req, res) => {
let movies = movies.find((student) => { return movie.id === req.params.id });

if (movie) {
    movies = movies.filter((obj) => { return obj.id !== req.params.id });
    res.status(201).send('movie ' + req.params.id + ' was deleted.');
}
});

// Update the "genre" of a movie by movie name/genre name
app.put('/movies/:name/:class/:grade', (req, res) => {
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
