// ============================================
// TRIP SAFETY - SOS CONTROLLER
// ============================================

const db = require("../config/database");

const {
    createSOSMessage,
    createSMSLink
} = require("../utils/notification");


// ============================================
// ACTIVATE SOS
// ============================================

exports.activateSOS = (req, res) => {

    const userId = req.user.userId;

    const {
        trip_id,
        latitude,
        longitude,
        accuracy,
        message
    } = req.body;


    console.log("");
    console.log("============================================");
    console.log("🚨 SOS API CALLED");
    console.log("============================================");
    console.log("User ID:", userId);
    console.log("Trip ID:", trip_id);
    console.log("Location:", latitude, longitude);


    // ========================================
    // VALIDATION
    // ========================================

    if (
        latitude === undefined ||
        longitude === undefined
    ) {
        return res.status(400).json({
            success: false,
            message: "Latitude and longitude are required."
        });
    }


    // ========================================
    // SAVE SOS ALERT
    // ========================================

    const sosSQL = `
        INSERT INTO sos_alerts
        (
            user_id,
            trip_id,
            latitude,
            longitude,
            accuracy,
            message,
            status
        )
        VALUES (?, ?, ?, ?, ?, ?, 'active')
    `;


    db.query(
        sosSQL,
        [
            userId,
            trip_id || null,
            latitude,
            longitude,
            accuracy || null,
            message || "Emergency SOS activated"
        ],
        (sosError, result) => {

            if (sosError) {

                console.error(
                    "❌ SOS INSERT ERROR:",
                    sosError
                );

                return res.status(500).json({
                    success: false,
                    message: "Failed to save SOS."
                });
            }


            const sosId = result.insertId;

            console.log(
                "✅ SOS saved. ID:",
                sosId
            );


            // ========================================
            // GET USER
            // ========================================

            db.query(
                `
                SELECT name
                FROM users
                WHERE id = ?
                LIMIT 1
                `,
                [userId],
                (userError, users) => {

                    if (userError) {

                        console.error(
                            "❌ USER QUERY ERROR:",
                            userError
                        );

                        return res.status(500).json({
                            success: false,
                            message:
                                "SOS saved, but user could not be loaded."
                        });
                    }


                    const userName =
                        users.length > 0
                            ? users[0].name
                            : "TripSafety User";


                    // ========================================
                    // GET EMERGENCY CONTACTS
                    // ========================================

                    db.query(
                        `
                        SELECT
                            id,
                            name,
                            phone,
                            relationship
                        FROM emergency_contacts
                        WHERE user_id = ?
                        ORDER BY id DESC
                        `,
                        [userId],
                        (contactError, contacts) => {

                            if (contactError) {

                                console.error(
                                    "❌ CONTACT QUERY ERROR:",
                                    contactError
                                );

                                return res.status(500).json({
                                    success: false,
                                    message:
                                        "SOS saved, but contacts could not be loaded."
                                });
                            }


                            console.log(
                                "📞 Emergency contacts:",
                                contacts.length
                            );


                            // ========================================
                            // CREATE SOS SMS MESSAGE
                            // ========================================

                            const smsMessage =
                                createSOSMessage({
                                    userName,
                                    latitude,
                                    longitude
                                });


                            // ========================================
                            // CREATE SMS LINKS
                            // ========================================

                            const smsContacts =
                                contacts.map(contact => {

                                    return {
                                        id: contact.id,
                                        name: contact.name,
                                        phone: contact.phone,
                                        relationship:
                                            contact.relationship,

                                        smsLink:
                                            createSMSLink(
                                                contact.phone,
                                                smsMessage
                                            )
                                    };

                                });


                            console.log(
                                "📱 SMS links created:",
                                smsContacts.length
                            );


                            // ========================================
                            // SAVE DATABASE NOTIFICATIONS
                            // ========================================

                            let completed = 0;


                            // No emergency contacts
                            if (contacts.length === 0) {

                                return finishSOS(
                                    userId,
                                    latitude,
                                    longitude,
                                    sosId,
                                    smsContacts,
                                    res
                                );
                            }


                            // ========================================
                            // CREATE CONTACT NOTIFICATIONS
                            // ========================================

                            contacts.forEach(contact => {

                                const notificationSQL = `
                                    INSERT INTO notifications
                                    (
                                        user_id,
                                        title,
                                        message,
                                        type
                                    )
                                    VALUES (?, ?, ?, ?)
                                `;


                                const notificationMessage =
                                    `🚨 SOS activated. ` +
                                    `Emergency contact: ${contact.name}. ` +
                                    `Location: ${latitude}, ${longitude}`;


                                db.query(
                                    notificationSQL,
                                    [
                                        userId,
                                        "SOS Emergency Activated",
                                        notificationMessage,
                                        "sos"
                                    ],
                                    notificationError => {

                                        if (notificationError) {

                                            console.error(
                                                "❌ Notification error:",
                                                notificationError
                                            );
                                        }


                                        completed++;


                                        if (
                                            completed ===
                                            contacts.length
                                        ) {

                                            finishSOS(
                                                userId,
                                                latitude,
                                                longitude,
                                                sosId,
                                                smsContacts,
                                                res
                                            );
                                        }

                                    }
                                );

                            });

                        }
                    );

                }
            );

        }
    );
};


// ============================================
// FINISH SOS
// ============================================

function finishSOS(
    userId,
    latitude,
    longitude,
    sosId,
    smsContacts,
    res
) {

    const locationUrl =
        `https://www.google.com/maps?q=${latitude},${longitude}`;


    // ========================================
    // USER NOTIFICATION
    // ========================================

    const notificationSQL = `
        INSERT INTO notifications
        (
            user_id,
            title,
            message,
            type
        )
        VALUES (?, ?, ?, ?)
    `;


    const notificationMessage =
        `Your SOS alert has been activated successfully. ` +
        `Emergency contacts found: ${smsContacts.length}. ` +
        `Location: ${latitude}, ${longitude}`;


    db.query(
        notificationSQL,
        [
            userId,
            "SOS Emergency Activated",
            notificationMessage,
            "sos"
        ],
        error => {

            if (error) {

                console.error(
                    "❌ User notification error:",
                    error
                );
            }


            console.log("");
            console.log(
                "============================================"
            );

            console.log("🚨 SOS COMPLETE");

            console.log("SOS ID:", sosId);

            console.log(
                "Contacts:",
                smsContacts.length
            );

            console.log(
                "============================================"
            );


            // ========================================
            // RESPONSE
            // ========================================

            return res.json({

                success: true,

                message:
                    "SOS activated successfully.",

                sosId,

                contactsFound:
                    smsContacts.length,

                smsContacts,

                locationUrl

            });

        }
    );
}


// ============================================
// GET ACTIVE SOS
// ============================================

exports.getActiveSOS = (req, res) => {

    const userId = req.user.userId;


    const sql = `
        SELECT *
        FROM sos_alerts
        WHERE user_id = ?
        AND status = 'active'
        ORDER BY created_at DESC
    `;


    db.query(
        sql,
        [userId],
        (error, rows) => {

            if (error) {

                console.error(
                    "❌ GET SOS ERROR:",
                    error
                );

                return res.status(500).json({
                    success: false,
                    message:
                        "Unable to load active SOS alerts."
                });
            }


            res.json({

                success: true,

                alerts: rows

            });

        }
    );

};


// ============================================
// RESOLVE SOS
// ============================================

exports.resolveSOS = (req, res) => {

    const userId = req.user.userId;

    const sosId = req.params.id;


    const sql = `
        UPDATE sos_alerts
        SET
            status = 'resolved',
            resolved_at = NOW()
        WHERE id = ?
        AND user_id = ?
    `;


    db.query(
        sql,
        [
            sosId,
            userId
        ],
        (error, result) => {

            if (error) {

                console.error(
                    "❌ RESOLVE SOS ERROR:",
                    error
                );

                return res.status(500).json({
                    success: false,
                    message:
                        "Unable to resolve SOS alert."
                });
            }


            if (
                result.affectedRows === 0
            ) {

                return res.status(404).json({
                    success: false,
                    message:
                        "SOS alert not found."
                });
            }


            res.json({
                success: true,
                message:
                    "SOS resolved successfully."
            });

        }
    );

};