'use strict';

const express = require('express');
const app = express();
const port = 8010;

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');

const buildSchemas = require('./src/schemas');

db.serialize(() => {
    buildSchemas(db);

    const app = require('./src/app')(db);
    app.use(function(err, req, res, next) {
        var message = (err.message ? err.message : 'internal error')
        res.status(err.status || 500).json({
            error_code: err.error_code,
            message: message
        })
    }); 

    app.listen(port, () => console.log(`App started and listening on port ${port}`));
});