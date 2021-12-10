/*
Hello Monica, you are expected to create this endpoints.
1.Return a list of ALL movies to the user
2.Return data (description, genre, director, image URL, whether it’s featured or not) about a single movie by title to the user
3.Return data about a genre (description) by name/title (e.g., “Thriller”)
4.Return data about a director (bio, birth year, death year) by name
5.Allow new users to register
6.Allow users to update their user info (username)
7.Allow users to add a movie to their list of favorites (showing only a text that a movie has been added—more on this later)
8.Allow users to remove a movie from their list of favorites (showing only a text that a movie has been removed—more on this later)
9.Allow existing users to deregister (showing only a text that a user email has been removed—more on this later)
*/
const express = require('express');  
const morgan = require('morgan');
const bodyParser = require('body-parser');
const uuid = require('uuid');

const app = express();
app.use(morgan('common'));
app.use(express.static('public'));
app.use(bodyParser.json());

// API
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

let users = []

// 1.Return a list of ALL movies to the user
app.get('/movies', (req, res) => {
  res.status(200).json(movies);
});
// 2.Return data about a single movie by title to the user
app.get('/movies/:title', (req, res) => {
  res.status(200).json(movies.find((movie) =>

    { return movie.title === req.params.title}));
});
// 3.Return data about a genre (description) by name/title (e.g., “Thriller”)
app.get('/movies/director/:name', (req, res) => {
  res.json(movies.find((movie) => {
    return movie.director.name === req.params.name;
  }));
});

// 5.Allow new users to register
app.post('/users', (req, res) => {
  let newUser = req.body;
  if (!newUser.name) {
    const message = 'Missing name in request body';
    res.status(400).send(message);
  } else {
    newUser.id = uuid.v4();
    users.push(newUser);
    res.status(201).send(newUser);
  }
});

// 6.Allow users to update their user info (username)
app.put('/users/:username', (req, res) => {
  res.send('No such User');
      { return movie.title === req.params.title}
  });

// 7.Allow users to add a movie to their list of favorites (showing only a text that a movie has been added—more on this later)
app.post('/users/favorite-list', (req, res) => {
  res.send('Movie has been added.');
});

// 8.Allow users to remove a movie from their list of favorites (showing only a text that a movie has been removed—more on this later)
app.delete('/users/favorite-list', (req, res) => {
  res.send('Movie has been removed.');
});
// 9.Allow existing users to deregister (showing only a text that a user email has been removed—more on this later)
app.delete('/users/:username', (req, res) => {
  res.send('User email has been removed.');
});

app.listen(8080, () => {
  console.log('Your app is listening on port 8080');
});