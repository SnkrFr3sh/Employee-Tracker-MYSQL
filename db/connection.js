const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  // Enter your local MYSQL credentials
  user: '',
  password: '',
  database: 'employees'
});

connection.connect(function (err) {
  if (err) throw err;
});

module.exports = connection;
