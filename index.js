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

// Movie API
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
      Bio: ' American director, producer and screenwriter. He is best known for directing the films Clay Pigeons, Shanghai Knights, Wedding Crashers, The Judge, and Eurovision Song Contest: The Story of Fire Saga.',
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

// 3.Return data about genre by name/title
app.get('/movies/genre/:name', (req, res) => {
  res.status(200).json(movies.find((genre) => {
      return genre.genre === req.params.genre
  }));
});


// 4.Return data about a director (bio, birth year, death year) by name
app.get('movies/director/:name', (req, res) => {
  res.status(200).json(movies.find((director) => {
      return director.director.name === req.params.directorName
  })) 
})

// 5.Allow new user
app.post('/users/:newUser', (req, res) => {
  res.send('Seccessful registration')
});

// 6.Allow users to update their user information
app.put('/users/:username', (req, res) => {
  res.send('Seccessful update')
});

// 7.Add new movie to list of favorite
app.post('users/:favourites/:movieName', (req, res) => {
    res.send('Seccessfully added new movie to list of favorite')
})  

// 8.Delete movie from list of favorite 
app.delete('users/:favourites/:movieName', (req, res) => {
    res.send('Seccessfully deleted movie')
});

// 9.Delete the user
app.delete('/users/:deleteUser', (req, res) => {
  res.send('User seccessfully deleted!')
})

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

