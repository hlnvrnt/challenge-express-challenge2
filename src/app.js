const express = require("express");
require("dotenv").config();
const app = express();

app.use(express.json()); 

const movieControllers = require("./controllers/movieControllers");

app.get("/api/movies", movieControllers.getMovies);
app.get("/api/movies/:id", movieControllers.getMovieById);

const validateMovie = require("./middlewares/validateMovie");

app.post("/api/movies", validateMovie, movieControllers.postMovies);

app.put("/api/movies/:id", movieControllers.updateMovie);

const usersControllers = require("./controllers/usersControllers");

app.get("/api/users", usersControllers.getUsers);
app.get("/api/users/:id", usersControllers.getUsersById);

const validateUser = require("./middlewares/validateUser");

app.post("/api/users", validateUser, usersControllers.postUsers);

app.put("/api/users/:id", usersControllers.updateUser);

module.exports = app;


const port = process.env.APP_PORT;