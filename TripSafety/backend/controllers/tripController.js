// ============================================
// TRIP SAFETY - TRIP CONTROLLER
// ============================================

const db = require("../config/database");


// ============================================
// CREATE TRIP
// ============================================

exports.createTrip = (req, res) => {

    const userId = req.user.userId;

    const {
        trip_name,
        transport,
        source_location,
        destination,
        trip_date,
        start_time,
        expected_arrival,
        notes
    } = req.body;


    if (
        !trip_name ||
        !source_location ||
        !destination ||
        !trip_date ||
        !start_time
    ) {

        return res.status(400).json({
            success: false,
            message: "Please fill all required trip fields."
        });

    }


    const sql = `
        INSERT INTO trips
        (
            user_id,
            trip_name,
            source,
            destination,
            trip_date,
            start_time,
            arrival_time,
            transport,
            notes,
            status
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'upcoming')
    `;


    const values = [
        userId,
        trip_name,
        source_location,
        destination,
        trip_date,
        start_time,
        expected_arrival || null,
        transport || null,
        notes || null
    ];


    db.query(
        sql,
        values,
        (err, result) => {

            if (err) {

                console.error(
                    "CREATE TRIP ERROR:",
                    err
                );

                return res.status(500).json({
                    success: false,
                    message: "Failed to create trip."
                });
            }


            // --------------------------------
            // CREATE NOTIFICATION
            // --------------------------------

            db.query(
                `
                INSERT INTO notifications
                (
                    user_id,
                    title,
                    message,
                    type
                )
                VALUES (?, ?, ?, ?)
                `,
                [
                    userId,
                    "Trip Registered",
                    `Your trip "${trip_name}" has been registered successfully.`,
                    "trip"
                ],
                (notificationError) => {

                    if (notificationError) {

                        console.error(
                            "NOTIFICATION ERROR:",
                            notificationError
                        );

                    }
                }
            );


            res.status(201).json({

                success: true,

                message:
                    "Trip created successfully.",

                tripId:
                    result.insertId

            });

        }
    );
};



// ============================================
// GET ALL TRIPS
// ============================================

exports.getTrips = (req, res) => {

    const userId = req.user.userId;


    const sql = `
        SELECT
            id,
            user_id,
            trip_name,
            source,
            destination,
            trip_date,
            start_time,
            arrival_time,
            transport,
            notes,
            status,
            created_at
        FROM trips
        WHERE user_id = ?
        ORDER BY trip_date DESC, start_time DESC
    `;


    db.query(
        sql,
        [userId],
        (err, trips) => {

            if (err) {

                console.error(
                    "GET TRIPS ERROR:",
                    err
                );

                return res.status(500).json({
                    success: false,
                    message: "Failed to load trips."
                });
            }


            res.json({

                success: true,

                trips: trips

            });

        }
    );
};



// ============================================
// GET SINGLE TRIP
// ============================================

exports.getTrip = (req, res) => {

    const userId = req.user.userId;

    const tripId = req.params.id;


    const sql = `
        SELECT
            id,
            user_id,
            trip_name,
            source,
            destination,
            trip_date,
            start_time,
            arrival_time,
            transport,
            notes,
            status,
            created_at
        FROM trips
        WHERE id = ?
        AND user_id = ?
        LIMIT 1
    `;


    db.query(
        sql,
        [tripId, userId],
        (err, trips) => {

            if (err) {

                console.error(
                    "GET TRIP ERROR:",
                    err
                );

                return res.status(500).json({
                    success: false,
                    message: "Failed to load trip."
                });
            }


            if (trips.length === 0) {

                return res.status(404).json({
                    success: false,
                    message: "Trip not found."
                });

            }


            res.json({

                success: true,

                trip: trips[0]

            });

        }
    );
};



// ============================================
// START TRIP
// ============================================

exports.startTrip = (req, res) => {

    const userId = req.user.userId;

    const tripId = req.params.id;


    const sql = `
        UPDATE trips
        SET status = 'active'
        WHERE id = ?
        AND user_id = ?
    `;


    db.query(
        sql,
        [tripId, userId],
        (err, result) => {

            if (err) {

                console.error(
                    "START TRIP ERROR:",
                    err
                );

                return res.status(500).json({
                    success: false,
                    message: "Failed to start trip."
                });
            }


            if (result.affectedRows === 0) {

                return res.status(404).json({
                    success: false,
                    message: "Trip not found."
                });

            }


            // --------------------------------
            // NOTIFICATION
            // --------------------------------

            db.query(
                `
                INSERT INTO notifications
                (
                    user_id,
                    title,
                    message,
                    type
                )
                VALUES (?, ?, ?, ?)
                `,
                [
                    userId,
                    "Trip Started",
                    "Your trip has started successfully.",
                    "trip"
                ]
            );


            res.json({

                success: true,

                message:
                    "Trip started successfully."

            });

        }
    );
};



// ============================================
// COMPLETE TRIP
// ============================================

exports.completeTrip = (req, res) => {

    const userId = req.user.userId;

    const tripId = req.params.id;


    const sql = `
        UPDATE trips
        SET status = 'completed'
        WHERE id = ?
        AND user_id = ?
    `;


    db.query(
        sql,
        [tripId, userId],
        (err, result) => {

            if (err) {

                console.error(
                    "COMPLETE TRIP ERROR:",
                    err
                );

                return res.status(500).json({
                    success: false,
                    message: "Failed to complete trip."
                });
            }


            if (result.affectedRows === 0) {

                return res.status(404).json({
                    success: false,
                    message: "Trip not found."
                });

            }


            db.query(
                `
                INSERT INTO notifications
                (
                    user_id,
                    title,
                    message,
                    type
                )
                VALUES (?, ?, ?, ?)
                `,
                [
                    userId,
                    "Trip Completed",
                    "Your trip has been completed successfully.",
                    "trip"
                ]
            );


            res.json({

                success: true,

                message:
                    "Trip completed successfully."

            });

        }
    );
};



// ============================================
// CANCEL TRIP
// ============================================

exports.cancelTrip = (req, res) => {

    const userId = req.user.userId;

    const tripId = req.params.id;


    const sql = `
        UPDATE trips
        SET status = 'cancelled'
        WHERE id = ?
        AND user_id = ?
    `;


    db.query(
        sql,
        [tripId, userId],
        (err, result) => {

            if (err) {

                console.error(
                    "CANCEL TRIP ERROR:",
                    err
                );

                return res.status(500).json({
                    success: false,
                    message: "Failed to cancel trip."
                });
            }


            if (result.affectedRows === 0) {

                return res.status(404).json({
                    success: false,
                    message: "Trip not found."
                });

            }


            res.json({

                success: true,

                message:
                    "Trip cancelled successfully."

            });

        }
    );
};



// ============================================
// TRIP HISTORY
// ============================================

exports.getTripHistory = (req, res) => {

    const userId = req.user.userId;


    const sql = `
        SELECT
            id,
            trip_name,
            source,
            destination,
            trip_date,
            start_time,
            arrival_time,
            transport,
            notes,
            status,
            created_at
        FROM trips
        WHERE user_id = ?
        AND status IN ('completed', 'cancelled')
        ORDER BY trip_date DESC
    `;


    db.query(
        sql,
        [userId],
        (err, trips) => {

            if (err) {

                console.error(
                    "TRIP HISTORY ERROR:",
                    err
                );

                return res.status(500).json({
                    success: false,
                    message: "Failed to load trip history."
                });
            }


            res.json({

                success: true,

                trips: trips

            });

        }
    );
};