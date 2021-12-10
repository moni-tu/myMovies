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
    title: 'The Matrix',
    year: '1999',
    genre: {
      name: 'Action,Sci-Fi',
      description: 'When a beautiful stranger leads computer hacker Neo to a forbidding underworld, he discovers the shocking truth--the life he knows is the elaborate deception of an evil cyber-intelligence.'      
    },
    director: {
        name: 'Lana Wachowski,Lilly Wachowski',
        bio: ' The American sisters are  film and television directors, writers and producers',
        born: 'June 21, 1965,December 29, 1967'
      },
  },
  {
    title: 'Inception',
    year: '1999',
    genre: {
      name: 'Action,Sci-Fi',
      description: 'When a'      
    },
    director: {
        name: 'Christopher Nolan',
        bio: ' The American film and television directors, writers and producers',
        born: ''
      },
  },
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
app.get('/movies/genre/:name', (req, res) => {
  res.json(movies.find((movie) => {
    return movie.genre.name === req.params.name;
  }));
});
// 4.Return data about a director (bio, birth year, death year) by name
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
      { return movie.title === req.params.title}));
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
