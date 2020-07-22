const mysql = require('mysql');
const util = require('util');
var connection;
if (process.env.JAWSDB_URL){
  connection =mysql.createConnection(process.env.JAWSDB_URL);
}
else{
  connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'Ranjini96!',
    database: 'Note_Taker'
  });
}
connection.connect(function(err) {
  if (err) {
    console.error("error connecting: " + err.stack);
    return;
  }
  console.log("connected as id " + connection.threadId);
});
// we give connection.query access to promises
// i.e. .then() and .catch()
connection.query = util.promisify(connection.query);
module.exports = connection;