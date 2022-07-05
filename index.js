/**
 * @file The index file creates the Express application, sets up the server and implements routes to Api
 * endpoints used to access myFlix data. Requests made to these endpoints use mongoose models created in the
 * models file and are authenticated using strategies implemented in the passport file. The connect method
 * establishes a connection between mongoose and the database, which is hosted on MongoDB Atlas. The
 * server and endpoints are hosted on Heroku.
 * @requires mongoose Connects the app to the database and implements data schemas using models.
 * @requires './models.js' The file where data schemas and models are defined.
 * @requires express Used to create an express application.
 * @requires morgan Used to log requests made to the database.
 * @requires passport Used to create strategies for authenticating and authorising requests to the Api endpoints.
 * @requires './auth.js' The file that implements the user login route.
 * @requires cors Used to control origins from which requests to the server can be made.
 * @requires express-validator Used to perform validation on data provided when creating or updating a user.
 */

// Load express framework
const express = require('express'); 
// Import middleware libraries: Morgan, body-parser, and uuid 
const morgan = require('morgan');
const path = require('path');
const bodyParser = require('body-parser');

const cors = require('cors');
// const uuid = require('uuid');

require('dotenv').config({path: path.join(__dirname, '.env')});

// Declare Exportet Mongoose Models
const mongoose = require('mongoose');
const Models = require('./models.js');
const myMovies = Models.Movie;
const Users = Models.User;
let mongouri = process.env.MONGO_URI;

// connect to local DB MongoDB Database called "test"
// mongoose.connect('mongodb://localhost:27017/test', { useNewUrlParser: true, useUnifiedTopology: true });
// connect to hosted DB
mongoose.connect(mongouri, { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();

app.use(morgan('common'));
app.use(express.static('public'));
app.use(bodyParser.json());

// 5.07.22 update the address of mymovies react changed to the same but with numbers on front 'https://624b0be321937b090192e2e0--my-awesome-movies.netlify.app'. I had CORs error when accessing the app again.

let allowedOrigins = ['http://localhost:8080', 'http://testsite.com', 'http://localhost:1234', 'https://my-awesome-movies.netlify.app', 'https://624b0be321937b090192e2e0--my-awesome-movies.netlify.app', 'http://localhost:4200', 'https://mymovie-backend-api.herokuapp.com/users', 'https://moni-tu.github.io/MyMovies-Angular-client/welcome', 'https://moni-tu.github.io', 'https://www.imdb.com', 'https://www.imdb.com/title', 'https://www.imdb.com/title/tt0396269/mediaviewer/rm746526464/?ref_=tt_ov_i'];
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

// default text response when at /
app.get ('/', (req, res) => {
  res.send('Welcome to myMovies!');
});

/**
 * GET: Returns a list of ALL movies to the user
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
 * GET: Returns data (description, genre, director, image URL, whether it’s featured or not) about a single movie by title to the user
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