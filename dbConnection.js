const mysql = require('mysql2')

exports.promisePool = mysql.createPool(
    {
        host:      'localhost',
        user:       'root',
        password:   'mR2944360$',
        database:   'sql-primer' 
    }).promise();
// create pool or connection