const database = require("../../database");


const getUsers = (req, res) => {
    database
      .query("select * from users")
      .then(([users]) => {
        res.json(users); // use res.json instead of console.log
      })
      .catch((e) => {
        console.log(e);
        res.status(500).send("Internal server error");
      });
  };

  
const getUsersById = (req, res) => {
    const id = parseInt(req.params.id);
  
    database
      .query("select * from users where id = ?", [id])
      .then(([users])=>{
        if (users[0]!=null) {
          res.json(users[0])
        } else {
          res.sendStatus(404);
        }
      })
      .catch((e) => {
        console.log(e);
        res.status(500).send("Internal server error");
      });
  };

  
const postUsers = (req, res) => {
  const { firstname, lastname, email, city, language } = req.body;

  database
  .query(
    "INSERT INTO users(firstname, lastname, email, city, language) VALUES (?, ?, ?, ?, ?)",
    [firstname, lastname, email, city, language])
  .then(([results])=>{
    const newUser = {
      id :results.insertId, 
      firstname,
      lastname,
      email,
      city,
      language
    }
    console.log(results)
    res.status(201).send(newUser)
  })
  .catch((e) => {
    console.log(e);
    res.status(500).send("Internal server error");
  });

};


const updateUser = (req, res) => {
  const id = parseInt(req.params.id)
  const { firstname, lastname, email, city, language } = req.body;

  database
  .query(
    "UPDATE users SET firstname = ?, lastname = ?, email = ?, city = ?, language = ? where id = ?",
    [firstname, lastname, email, city, language, id]
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

const deleteUser = (req, res) => {
  const id = parseInt(req.params.id);

  database
    .query("delete from users where id = ?", [id])
    .then(([result]) => {
      if (result.affectedRows === 0) {
        res.sendStatus(404);
      } else {
        res.sendStatus(204);
      }
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
};


module.exports = {
    getUsers,
    getUsersById,
    postUsers,
    updateUser,
    deleteUser,
  };