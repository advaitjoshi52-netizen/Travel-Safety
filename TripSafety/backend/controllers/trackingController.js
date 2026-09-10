const db = require("../config/database");

// ===============================
// SAVE GPS LOCATION
// ===============================

const saveLocation = (req, res) => {

    const userId = req.userId;
    const tripId = req.params.id;

    const {
        latitude,
        longitude,
        accuracy
    } = req.body;

    // Validate GPS data
    if (
        latitude === undefined ||
        longitude === undefined
    ) {
        return res.status(400).json({
            success: false,
            message: "Latitude and longitude are required"
        });
    }

    // Validate coordinates
    if (
        latitude < -90 ||
        latitude > 90 ||
        longitude < -180 ||
        longitude > 180
    ) {
        return res.status(400).json({
            success: false,
            message: "Invalid GPS coordinates"
        });
    }

    // Check that trip belongs to user
    db.query(
        `
        SELECT id, status
        FROM trips
        WHERE id = ?
        AND user_id = ?
        `,
        [tripId, userId],
        (err, trips) => {

            if (err) {
                console.error("❌ CHECK TRIP ERROR:", err);

                return res.status(500).json({
                    success: false,
                    message: "Database error"
                });
            }

            if (trips.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Trip not found"
                });
            }

            if (trips[0].status !== "active") {
                return res.status(400).json({
                    success: false,
                    message: "Trip is not active"
                });
            }

            // Save GPS location
            db.query(
                `
                INSERT INTO locations
                (
                    trip_id,
                    latitude,
                    longitude,
                    accuracy
                )
                VALUES (?, ?, ?, ?)
                `,
                [
                    tripId,
                    latitude,
                    longitude,
                    accuracy || null
                ],
                (err, result) => {

                    if (err) {
                        console.error(
                            "❌ SAVE LOCATION ERROR:",
                            err
                        );

                        return res.status(500).json({
                            success: false,
                            message: "Unable to save location"
                        });
                    }

                    res.status(201).json({
                        success: true,
                        message: "Location saved successfully",
                        location: {
                            id: result.insertId,
                            trip_id: Number(tripId),
                            latitude: Number(latitude),
                            longitude: Number(longitude),
                            accuracy: accuracy || null
                        }
                    });

                }
            );

        }
    );
};


// ===============================
// GET LATEST LOCATION
// ===============================

const getLatestLocation = (req, res) => {

    const userId = req.userId;
    const tripId = req.params.id;

    db.query(
        `
        SELECT
            l.id,
            l.trip_id,
            l.latitude,
            l.longitude,
            l.accuracy,
            l.recorded_at
        FROM locations l
        INNER JOIN trips t
            ON l.trip_id = t.id
        WHERE l.trip_id = ?
        AND t.user_id = ?
        ORDER BY l.recorded_at DESC
        LIMIT 1
        `,
        [tripId, userId],
        (err, results) => {

            if (err) {
                console.error(
                    "❌ GET LOCATION ERROR:",
                    err
                );

                return res.status(500).json({
                    success: false,
                    message: "Unable to fetch location"
                });
            }

            if (results.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "No GPS location found"
                });
            }

            res.json({
                success: true,
                location: results[0]
            });

        }
    );
};


// ===============================
// GET LOCATION HISTORY
// ===============================

const getLocationHistory = (req, res) => {

    const userId = req.userId;
    const tripId = req.params.id;

    db.query(
        `
        SELECT
            l.id,
            l.trip_id,
            l.latitude,
            l.longitude,
            l.accuracy,
            l.recorded_at
        FROM locations l
        INNER JOIN trips t
            ON l.trip_id = t.id
        WHERE l.trip_id = ?
        AND t.user_id = ?
        ORDER BY l.recorded_at ASC
        `,
        [tripId, userId],
        (err, results) => {

            if (err) {
                console.error(
                    "❌ LOCATION HISTORY ERROR:",
                    err
                );

                return res.status(500).json({
                    success: false,
                    message: "Unable to fetch location history"
                });
            }

            res.json({
                success: true,
                locations: results
            });

        }
    );
};


// ===============================
// EXPORT
// ===============================

module.exports = {
    saveLocation,
    getLatestLocation,
    getLocationHistory
};