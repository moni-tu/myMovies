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

const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;
const Genres = Models.Genre;
const Directors = Models.Director;

mongoose.connect('mongodb://localhost:27017/Test', { useNewUrlParser: true, useUnifiedTopology: true });

app.use(morgan('common'));
app.use(express.static('public'));
app.use(bodyParser.json());

// API
let movies = [
  {
    title: 'Inception',
    director: {
      Name:'Christopher Nolan',
      Bio: 'British-American film director, producer, and screenwriter. His films have grossed more than US$5 billion worldwide, and have garnered 11 Academy Awards from 36 nominations.',
      Birth: 1970,
      Death: 'still alive',
    },
    genre: 'Science Fiction',
    releaseYear: 2010
  },
  {
    title: 'Your Name',
    director:  {
      Name:'Makoto Shinkai',
      Bio: 'Makoto Shinkai is a Japanese animator, filmmaker, author, and manga artist.',
      Birth: 1973,
      Death: 'still alive',
    },
    genre: 'Romance',
    releasedYear: 2016
  },
  {
    title: 'Scrubs',
    director:  {
      Name:'Bill Lawrence',
      Bio: 'American screenwriter, producer, and director. He is the creator of the series Scrubs and co-creator of shows including Cougar Town, Spin City, Ground Floor',
      Birth: 1968,
      Death: 'still alive',
    }, 
    genre: 'Comedy-drama',
    releasedYear: 2001
  },
  {
    title: 'New Girl',
    director: {
      Name:'Elizabeth Meriwether',
      Bio: 'American writer, producer and television showrunner. She is known for creating the Fox sitcom New Girl, and for writing the play Oliver Parker! (2010) and the romantic comedy film No Strings Attached (2011).',
      Birth: 1981,
      Death: 'still alive',
    },
    genre:'Sitcom',
    releasedYear: 2011
  },
  {
    title: 'Brooklyn 99', 
    director:  {
      Name:'Dan Goor',
      Bio: 'American comedy writer and television producer. He has written for several comedy talk shows including The Daily Show, Last Call with Carson Daly and Late Night with Conan O"Brien',
      Birth: 1975,
      Death: 'still alive',
    },
    genre: 'Police procedural Sitcom',
    releasedYear: 2013
  },
  {
    title: 'The Matrix',
    director:  {
      Name:'The Wachowskis',
      Bio: 'American film and television directors, writers and producers.The sisters are both trans women.',
      Birth: 1965/1967,
      Death: 'still alive',
    },
    genre: 'Science Fiction',
    releasedYear: 1999 
  },
  {
    title: 'Parasite',
    director:  {
      Name:'Bong Joon-ho',
      Bio: 'South Korean film director, producer and screenwriter. The recipient of three Academy Awards, his filmography is characterised by emphasis on social themes, genre-mixing, black humor, and sudden tone shifts.',
      Birth: 1969,
      Death: 'still alive',
    },
    genre: 'Thriller',
    releasedYear: 2019
  },
  {
    title: 'Forrest Gump',
    director:  {
      Name:'Robert Zemeckis',
      Bio: 'American film director, producer, and screenwriter. He first came to public attention as the director of the action-adventure romantic comedy Romancing the Stone (1984), the science-fiction comedy Back to the Future film trilogy (1985—90), and the live-action/animated comedy Who Framed Roger Rabbit (1988).',
      Birth: 1951,
      Death: 'still alive',
    },
    genre: 'Drama',
    releasedYear: 1994
  },
  {
    title: 'Wedding Crashers',
    director:  {
      Name:'David Dobkin',
      Bio: 'American director, producer and screenwriter. He is best known for directing the films Clay Pigeons, Shanghai Knights, Wedding Crashers, The Judge, and Eurovision Song Contest: The Story of Fire Saga.',
      Birth: 1970,
      Death: 'still alive',
    },
    genre: 'Comedy',
    releasedYear: 2005
  },
  {
    title: 'BoJack Horseman',
    director: {
      Name:'Raphael Bob-Waksberg',
      Bio: 'American comedian, writer, producer, actor, and voice actor. He is known as the creator and showrunner of the Netflix animated comedy series BoJack Horseman and the Amazon Prime Video animated series Undone. ',
      Birth: 1984,
      Death: 'still alive',
    },
    genre: 'Drama',
    releasedYear: 2014
  }
];

let users = [
  {
    username: 'moni-tu',
    favourites: ['New Girl', 'Your Name'],
  },
];

app.get ('/', )
// 1. Get all movies
app.get('/movies', (req, res) => {
  Users.find()
    .then((movies) => {
      res.status(201).json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});
// 2.Return data about a single movie by title to the user
app.get('/movies/:title', (req, res) => {
  movies.findOne({ title: req.params.title })
    .then((title) => {
      res.json(title);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});
// 3.Return data about a genre (description) by name/title (e.g., “Thriller”)
app.get('/movies/genre/:genre', (req, res) => {
  const foundGenre = movies.find((movie) => movie.genre === req.params.genre)
  res.status(200).json(foundGenre)
  
});

// 4.Return data about a director (bio, birth year, death year) by name
app.get('/movies/director/:name', (req, res) => {
  res.status(200).json(movies.find((movie) => {
    return movie.director.Name === req.params.name
  }))
})

//5. Add a user
/* We’ll expect JSON in this format
{
  ID: Integer,
  Username: String,
  Password: String,
  Email: String,
  Birthday: Date
}*/
app.post('/users', (req, res) => {
  Users.findOne({ Username: req.body.Username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + 'already exists');
      } else {
        Users
          .create({
            Username: req.body.Username,
            Password: req.body.Password,
            Email: req.body.Email,
            Birthday: req.body.Birthday
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

// 6. Get a user by username
app.get('/users/:Username', (req, res) => {
  Users.findOne({ Username: req.params.Username })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// 7. Add a movie to a user's list of favorites
app.post('/users/:Username/movies/:MovieID', (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, {
     $push: { FavoriteMovies: req.params.MovieID }
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

// 8.Allow users to remove a movie from their list of favorites (showing only a text that a movie has been removed—more on this later)
app.delete('/users/:Username/movies/:MovieID', (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, {
     $pull: { FavoriteMovies: req.params.MovieID }
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
// 9.Allow existing users to deregister (showing only a text that a user email has been removed—more on this later)
app.delete('/users/:Username', (req, res) => {
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

app.listen(8080, () => {
  console.log('Your app is listening on port 8080');
});
