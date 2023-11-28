const express = require("express");
require("dotenv").config();
const app = express();

app.use(express.json()); 

const movieControllers = require("./controllers/movieControllers");

app.get("/api/movies", movieControllers.getMovies);
app.get("/api/movies/:id", movieControllers.getMovieById);

app.post("/api/movies", movieControllers.postMovies);

const usersControllers = require("./controllers/usersControllers");

app.get("/api/users", usersControllers.getUsers);
app.get("/api/users/:id", usersControllers.getUsersById);

app.post("/api/users", usersControllers.postUsers);

module.exports = app;


const port = process.env.APP_PORT;