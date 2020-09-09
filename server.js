

//Loading dependencies. These npm packages give useful functionality to the server
const express = require("express");
const path = require("path");
const fs = require("fs");
var connection = require('./config/connection');

//Setting up basic property for the express server
const app = express();

//Setting initial port
const PORT = process.env.PORT || 8080;


let notesData = [];

//Setting up the Express app to handle data parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "develop/public")));


app.get("/api/notes", function(req, res) {
  try {
    connection.query ("SELECT * FROM note")
    .then(results => {
      res.send(results)
      console.log(results.length)
    })
    .catch(err => console.log(err))
  }
  catch(error)
  {
    res.send(error);
  }
})


app.post ("/api/notes", function(req, res) {
 

  try {
    const noteRequest = req.body;
    console.log(noteRequest);

    connection.query(
      "INSERT INTO note SET ?",
      {
        title: noteRequest.title,
        n_text: noteRequest.n_text
      },
      function (err) {
        if (err) throw err;
        else 
        {
          res.redirect("/notes")
          console.log(" Note was succesfully created!");
        }
      }
    );
  }
  catch (error)
  {
    console.log(error);
  }
});



app.delete("/api/notes/:id", function (req, res) {
connection.query (
  'DELETE FROM note WHERE id = ?', [req.params.id], (err, rows, fields) => {
    if(!err)
    res.send("Delete Successfully")
    else
    console.log(err)
  }
);
});

//Below codes handle when user visit the page.
//Returns the 'nots.html' file
app.get("/notes", function(req, res) {
  res.sendFile(path.join(__dirname, "develop/public/notes.html"));
});

//Returns the 'index.html' - the home page
app.get("*", function(req, res) {
  res.sendFile(path.join(__dirname, "develop/public/index.html"));
});

app.get("/api/notes", function(req, res) {
  return res.sendFile(path.join(__dirname, "develop/db/schema.sql"));
});

//app.Listen "starts" our server
app.listen(PORT, function() {
  console.log("SERVER IS LISTENING: " + PORT);
});
