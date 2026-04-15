const bcrypt = require('bcryptjs');

const raw = 'admin123';
const hash = bcrypt.hashSync(raw, 10);
console.log(hash);

const mysql = require('mysql2');
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'cse@1234',
  database: 'hotel_booking_dbs'
});

connection.query(
  'UPDATE users SET password = ? WHERE email = ?',
  [hash, 'admin@hotel.com'],
  function(err, results) {
    if (err) console.log(err);
    else console.log('Update successful, affected rows:', results.affectedRows);
    connection.end();
  }
);
