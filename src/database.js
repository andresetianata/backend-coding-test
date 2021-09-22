var db;

module.exports = {
  do_exec_sqlite_all,
  do_exec_sqlite_run,
  do_exec_sqlite_insert_rides,
  do_init_db
}
function do_init_db(database) {
  db = database;
}
function do_exec_sqlite_run(sql, values) {
  return new Promise((resolve, reject) => {
    db.run(sql, values, (err) => {
      if (err) {
        reject({
          status: "error",
          error_code: 'SERVER_ERROR',
          message: "Unknown error"
        })
      }
      resolve({
        status: "success"
      })
    })
  })
}
function do_exec_sqlite_all(sql, values) {
  return new Promise((resolve, reject) => {
    db.all(sql, values, (err, rows) => {
      console.log("Error", err);
      console.log("Rows", rows)
      if (err) {
        reject({
          status: "error",
          error_code: "SERVER_ERROR",
          message: "Unknown error"
        })
      }
      if (rows.length == 0) {
        reject({
          status: "error",
          error_code: "NOT_FOUND"
        })
      }
      resolve({
        status: "success",
        rows: rows
      })
    })
  })
}
function do_exec_sqlite_insert_rides(values) {
  return new Promise((resolve,reject) => {
    db.run('INSERT INTO Rides(startLat, startLong, endLat, endLong, riderName, driverName, driverVehicle) VALUES (?, ?, ?, ?, ?, ?, ?)', values, function(err) {
      if (err) {
        reject({
          status: "error",
          error_code: 'SERVER_ERROR',
          message: "Unknown error"
        })
      }
      db.all('SELECT * FROM Rides WHERE rideID = ?', this.lastID, function(err, rows) {
        if (err) {
          reject({
            status: "error",
            error_code: 'SERVER_ERROR',
            message: "Unknown error"
          })
        }
        resolve({
          status: 'success',
          rows: rows
        })
      })
    })
  })
}