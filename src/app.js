'use strict';

const express = require('express');
const app = express();
const database = require('./database');

const jsonParser = express.json();

module.exports = (db) => {
    database.do_init_db(db);

    app.get('/health', (req, res) => res.send('Healthy'));

    app.post('/rides', jsonParser, async (req, res) => {
        try {
            const startLatitude = Number(req.body.start_lat);
            const startLongitude = Number(req.body.start_long);
            const endLatitude = Number(req.body.end_lat);
            const endLongitude = Number(req.body.end_long);
            const riderName = req.body.rider_name;
            const driverName = req.body.driver_name;
            const driverVehicle = req.body.driver_vehicle;

            if (startLatitude < -90 || startLatitude > 90 || startLongitude < -180 || startLongitude > 180) {
                return next({
                    error_code: 'VALIDATION_ERROR',
                    message: 'Start latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively'
                });
            }
    
            if (endLatitude < -90 || endLatitude > 90 || endLongitude < -180 || endLongitude > 180) {
                return next({
                    error_code: 'VALIDATION_ERROR',
                    message: 'End latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively'
                });
            }
    
            if (typeof riderName !== 'string' || riderName.length < 1) {
                return next({
                    error_code: 'VALIDATION_ERROR',
                    message: 'Rider name must be a non empty string'
                });
            }
    
            if (typeof driverName !== 'string' || driverName.length < 1) {
                return next({
                    error_code: 'VALIDATION_ERROR',
                    message: 'Rider name must be a non empty string'
                });
            }
    
            if (typeof driverVehicle !== 'string' || driverVehicle.length < 1) {
                return next({
                    error_code: 'VALIDATION_ERROR',
                    message: 'Rider name must be a non empty string'
                });
            }

            var values = [req.body.start_lat, req.body.start_long, req.body.end_lat, req.body.end_long, req.body.rider_name, req.body.driver_name, req.body.driver_vehicle];

            let insert = await database.do_exec_sqlite_run('INSERT INTO Rides(startLat, startLong, endLat, endLong, riderName, driverName, driverVehicle) VALUES (?, ?, ?, ?, ?, ?, ?)', values);
            if (insert.status== "success") {
                let readById = await database.do_exec_sqlite_all('SELECT * FROM Rides WHERE rideID = ?', this.lastID);
                if (readById.status == "success") {
                    res.send(readById.rows);
                }
            }
        }
        catch(error) {
            var errorObject = {};
            if (error.error_code == "NOT_FOUND") {
                errorObject.error_code = "RIDES_NOT_FOUND_ERROR";
                errorObject.message = "Could not find any rides";
            }
            else {
                errorObject.error_code = error.error_code;
                errorObject.message = error.message;
            }
            return next(errorObject)
        }
    });

    app.get('/rides', async (req, res, next) => {
        try {
            if (!req.query.page && !req.query.limit) return next({ error_code: 'INVALID_QUERY_PARAMETER', message: "Invalid query parameter" }) 
            var limit = req.query.limit;
            var offset = (req.query.page * limit) - limit;
            let readAll = await database.do_exec_sqlite_all(`SELECT * FROM Rides LIMIT ? OFFSET ?`, [limit, offset]);
            if (readAll.status == "success") {
                res.send(readAll.rows);
            }
        }
        catch(error) {
            var errorObject = {};
            if (error.error_code == "NOT_FOUND") {
                errorObject.error_code = "RIDES_NOT_FOUND_ERROR";
                errorObject.message = "Could not find any rides";
            }
            else {
                errorObject.error_code = error.error_code;
                errorObject.message = error.message;
            }
            return next(errorObject)
        }
    });

    app.get('/rides/:id', async (req, res) => {
        try {
            let readById = await database.do_exec_sqlite_all(`SELECT * FROM Rides WHERE rideID = ?`, req.params.id);
            if (readById.status == "success") {
                res.send(readById.rows)
            }
        }
        catch(error) {
            var errorObject = {};
            if (error.error_code == "NOT_FOUND") {
                errorObject.error_code = "RIDES_NOT_FOUND_ERROR";
                errorObject.message = "Could not find any rides";
            }
            else {
                errorObject.error_code = error.error_code;
                errorObject.message = error.message;
            }
            return next(errorObject)
        }
    });

         

    return app;
};
