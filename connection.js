const mysql = require("mysql2");

const connect = mysql.createConnection({
  host: "localhost",
  // Your username
  user: "root",
  // Your password
  password: "kabul@12345",
  database: "employees"
});

connect.connect(function (err) {
  if (err) throw err;
});

module.exports = connect;
