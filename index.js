/*
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
const mongoose = require('mongoose');
const Models = require('./models.js');
const bodyParser = require('body-parser');
const cors = require('cors');
// const uuid = require('uuid');
const path = require('path');
require('dotenv').config({path: path.join(__dirname, '.env')});

// Declare Exportet Mongoose Models
const myMovies = Models.Movie;
const Users = Models.User;
let mongouri = process.env.MONGO_URI;

// connect to MongoDB Database called "test"
// connect to local DB
// mongoose.connect('mongodb://localhost:27017/test', { useNewUrlParser: true, useUnifiedTopology: true });
// connect to hosted DB
mongoose.connect(mongouri, { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();
app.use(morgan('common'));
app.use(express.static('public'));
app.use(bodyParser.json());

let allowedOrigins = ['http://localhost:8080', 'http://testsite.com', 'http://localhost:1234', 'https://my-awesome-movies.netlify.app', 'http://localhost:4200', 'https://mymovie-backend-api.herokuapp.com/users', 'https://moni-tu.github.io/MyMovies-Angular-client/welcome', 'https://moni-tu.github.io'];
app.use(cors({
  origin: (origin, callback) => {
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){ // If a specific origin isn’t found on the list of allowed origins
      let message = 'The CORS policy for this application doesn’t allow access from origin ' + origin;
      return callback(new Error(message ), false);
    }
    return callback(null, true);
  }
}));

let auth = require('./auth')(app);
const passport = require('passport');
require('./passport');
app.use(passport.initialize());

const { check, validationResult } = require('express-validator');

/* ***** ENDPOINT DEFINITION ***** */

// default text response when at /
app.get ('/', (req, res) => {
  res.send('Welcome to myMovies!');
});

/**
* GET: returns a list of all movies to the user
* Request body: Bearer token
* @returns array of movie objects
* @requires passport 
*/

app.get('/mymovies', 
passport.authenticate('jwt', { session: false }), 
(req, res) => {
  myMovies.find()
    .then((myMovies) => {
      res.status(201).json(myMovies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

/**
 * GET: returns data (title, imagePath, description) about a single movie by title to the user
 * Request body: Bearer token
 * @param title
 * @returns movie object
 * @requires passport
 */

app.get('/mymovies/:Title', passport.authenticate('jwt', { session: false }), (req, res) => {
  myMovies.findOne({ Title: req.params.Title })
    .then((movie) => {
      res.json(movie);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

/**
 * GET: returns data about a genre (name and description of the genre) by name (ex. Thriller)
 * @param name (of genre)
 * @returns genre object
 * @requires passport 
 */
app.get('/mymovies/genre/:name', passport.authenticate('jwt', { session: false }), (req, res) => {
  myMovies.findOne({ 'Genre.Name': req.params.name })
    .then((movie) => {
      res.json(movie);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

/** 
 * GET: return data about director (name, bio and birth) by name (ex. Christopher Nolan)
 * Request body: Bearer token
 * @param name (of director)
 * @returns director object
 * @requires passport
*/
app.get('/mymovies/director/:name', passport.authenticate('jwt', { session: false }), (req, res) => {
  myMovies.findOne({ 'Director.Name': req.params.name })
    .then((movie) => {
      res.json(movie);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});


/* We’ll expect JSON in this format
{
  ID: Integer,
  Username: String,
  Password: String,
  Email: String,
  Birthday: Date
}*/

/**
 * POST: new users can register. Username, password and email are required.
 * Request body: Bearer token
 * @returns: user object
 */
app.post(
  '/users/',
  [
    check('Username', 'Username is required').isLength({min: 5}),
    check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Email does not appear to be valid').isEmail()
  ],
  (req, res) => {
    // check validation object for errors
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
  let hashedPassword = Users.hashPassword(req.body.Password);
  Users.findOne({ Username: req.body.Username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + 'already exists');
      } else {
        Users
          .create({
            Username: req.body.Username,
            Password: hashedPassword,
            Email: req.body.Email,
            Birthday: req.body.Birthday,
          })
          .then((user) =>{res.status(201).json(user) })
        .catch((error) => {
          console.error(error);
          res.status(500).send('Error: ' + error);
        })
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});

/**
 * All user endpoint have uppercase (User, Password, Email, Birthday)
 * GET: allows users too see their personal info (username, email, birthday)
 * Request body: Bearer token
 * @param Username
 * @returns user object
 * @requires passport
 */
app.get('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOne({ Username: req.params.Username })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

/**
 * PUT: allows users to update their personal information
 * Request body: Bearer token, updated user info
 * @param Username
 * @returns user object
 * @requires passport
 */
app.put(
  "/users/:Username", passport.authenticate('jwt', { session: false }),
  [
    check("Username", "Username is required").isLength({ min: 5 }),
    check(
      "Username",
      "Username contains non alphanumeric characters - not allowed."
    ).isAlphanumeric(),
    check("Password", "Password is required").not().isEmpty(),
    check("Email", "Email does not appear to be valid").isEmail(),
  ],
  (req, res) => {
    // check the validation object for errors
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    Users.findOneAndUpdate({ Username: req.params.Username }, { $set:
      {
        Username: req.body.Username,
        Password: req.body.Password,
        Email: req.body.Email,
        Birthday: req.body.Birthday
      }
    },
    { new: true }, // This line makes sure that the updated document is returned
    (err, updatedUser) => {
      if(err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
      } else {
        res.json(updatedUser);
      }
    });
  });

/**
 * POST: allows to add a movie to the user's list of favorite movies
 * Request body: Bearer token
 * @param ObjectId (of Favorites of Username)
 * @returns ObjectId
 * @requires passport
 */
app.post('/users/:Username/Favorites/:ObjectId', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, {
     $push: { Favorites: req.params.ObjectId }
   },
   { new: true }, // This line makes sure that the updated document is returned
  (err, updatedUser) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});

/**
 * DELETE: Allow users to remove a movie from their list of favorites
 * Request body: Bearer token, updated user info
 * @param ObjectId (of Favorites of Username)
 * @returns user object
 * @requires passport
 * 
 */
app.delete('/users/:Username/Favorites/:ObjectId', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, {
     $pull: { Favorites: req.params.ObjectId }
   },
   { new: true }, // This line makes sure that the updated document is returned
  (err, updatedUser) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});

/**
 * DELETE: allows user to delete their account
 * Request body: Bearer token
 * @param Username
 * @returns success message 
 * @requires passport 
 */
app.delete('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndRemove({ Username: req.params.Username })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.Username + ' was not found');
      } else {
        res.status(200).send(req.params.Username + ' was deleted.');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});
// look for a pre-configured port number in the environment variable, and, if nothing is found, sets the port to a certain port number
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0',() => {
 console.log('Listening on Port ' + port);
});