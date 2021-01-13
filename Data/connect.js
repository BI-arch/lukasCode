var MSSQL = require('mssql')
var pool = new MSSQL.ConnectionPool({
    user: 'lukasz',
    password: 'Szukasz2020',
    server: 'biarchsql.database.windows.net',
    database: 'BI001_CST'
})

pool.connect(err => {
    if(err) {
        console.log('Error: ', err)
      }
      // If no error, then good to go...
      else {
          console.log("sql connected succesfully")
      }
})

module.exports = {pool, MSSQL};