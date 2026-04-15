const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'cse@1234',
  database: 'hotel_booking_dbs'
});

connection.query(
  'SELECT * FROM users',
  function(err, results, fields) {
    if (err) {
      console.log('Error querying:', err);
    } else {
      console.log('Users:', results);
    }
    connection.end();
  }
);
