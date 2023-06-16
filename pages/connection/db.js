const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  port:3306,
  user: 'jiyas',
  password: 'Jiyhib@2023',
  database: 'parking',
});

connection.connect((error) => {
  if (error) throw error;
  console.log('Connected to the MySQL database.');
});

module.exports = connection;