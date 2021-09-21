var db;

module.exports = {
  do_exec_sqlite_all,
  do_exec_sqlite_run,
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