

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


//API GET requests to handle when a user "visit" a page
// app.get("/api/notes", function(err, res) {
//   try {
//     notesData = fs.readFileSync("develop/db/db.json", "utf8");
//     notesData = JSON.parse(notesData);

//   } catch (err) {
//     console.log("\n error (in app.get.catch):");
//     console.log(err);
//   }

//   res.json(notesData);
// });

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
//API POST requests to handle when a user creates new notesData and save
// app.post("/api/notes", function(req, res) {
//   try {
 
//       notesData = fs.readFileSync("./develop/db/db.json", "utf8");
//       console.log(notesData);

//       notesData = JSON.parse(notesData);
//       req.body.id = notesData.length;
//       // The saved notesData is pushed to the appropraite JavaScripts array.
//       notesData.push(req.body); 

//       notesData = JSON.stringify(notesData);
    
//       fs.writeFile("./develop/db/db.json", notesData, "utf8", function(err) {

//       if (err) throw err;
//     });
   
//     res.json(JSON.parse(notesData));

//   } catch (err) {
//     throw err;
//     console.error(err);
//   }
// });

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



//API DELETE receive a query parameter containing the id of a note to delete.
// app.delete("/api/notes/:id", function(req, res) {
//   try {

//     notesData = fs.readFileSync("./develop/db/db.json", "utf8");

//     notesData = JSON.parse(notesData);
   
//     notesData = notesData.filter(function(note) {
//       return note.id != req.params.id;
//     });

//     notesData = JSON.stringify(notesData);

//     // New Data file after deletion is written to the db.jason file.
//     fs.writeFile("./develop/db/db.json", notesData, "utf8", function(err) {

//       if (err) throw err;
//     });

//     res.send(JSON.parse(notesData));

//   } catch (err) {
//     throw err;
//     console.log(err);
//   }
// });

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
