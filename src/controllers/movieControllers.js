const movies = [
  {
    id: 1,
    title: "Citizen Kane",
    director: "Orson Wells",
    year: "1941",
    color: false,
    duration: 120,
  },
  {
    id: 2,
    title: "The Godfather",
    director: "Francis Ford Coppola",
    year: "1972",
    color: true,
    duration: 180,
  },
  {
    id: 3,
    title: "Pulp Fiction",
    director: "Quentin Tarantino",
    year: "1994",
    color: true,
    duration: 180,
  },
];

const database = require("../../database");

const getMovies = (req, res) => {
  database
    .query("select * from movies")
    .then(([movies]) => {
      res.json(movies); // use res.json instead of console.log
    })
    .catch((e) => {
      console.log(e);
      res.status(500).send("Internal server error");
    });
};

const getMovieById = (req, res) => {
  const id = parseInt(req.params.id);

  database
    .query("select * from movies where id = ?", [id])
    .then(([movies])=>{
      if (movies[0]!=null) {
        res.json(movies[0])
      } else {
        res.sendStatus(404);
      }
    })
    .catch((e) => {
      console.log(e);
      res.status(500).send("Internal server error");
    });
};

const postMovies = (req, res) => {
  const { title, director, year, color, duration } = req.body;

  database
  .query(
    "INSERT INTO movies(title, director, year, color, duration) VALUES (?, ?, ?, ?, ?)",
    [title, director, year, color, duration])
  .then(([result])=>{
    const newMovie = {
      id :result.insertId, 
      title,
      director,
      year,
      color,
      duration
    }
    console.log(result)
    res.status(201).send(newMovie)
  })
  .catch((e) => {
    console.log(e);
    res.status(500).send("Internal server error");
  });

};


const updateMovie = (req, res) => {
  const id = parseInt(req.params.id)
  const { title, director, year, color, duration } = req.body;

  database
  .query(
    "UPDATE movies SET title = ?, director = ?, year = ?, color = ?, duration = ? where id = ?",
    [title, director, year, color, duration, id]
    )
  .then(([result])=>{
    if(result.affectedRows === 0){
     res.sendStatus(404) 
    }else{
      res.sendStatus(204)
    }
  })
  .catch((e) => {
    console.log(e);
    res.status(500).send("Internal server error");
  });

};



module.exports = {
  getMovies,
  getMovieById,
  postMovies,
  updateMovie,
};
