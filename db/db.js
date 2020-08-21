const mysql = require("mysql2")

var con = mysql.createConnection({
    host: '931',
    user: 'mala',
    database: 'joinPlus',
    password: ""
    
  });

  exports.con = con;

