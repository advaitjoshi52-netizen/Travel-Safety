const db = require("../config/database");

// ===============================
// GET MY NOTIFICATIONS
// ===============================

const getNotifications = (req, res) => {

    const userId = req.userId;

    db.query(
        `
        SELECT
            id,
            user_id,
            title,
            message,
            type,
            is_read,
            created_at
        FROM notifications
        WHERE user_id = ?
        ORDER BY created_at DESC
        `,
        [userId],
        (err, results) => {

            if (err) {
                console.error("❌ GET NOTIFICATIONS ERROR:", err);

                return res.status(500).json({
                    success: false,
                    message: "Unable to fetch notifications",
                    error: err.message
                });
            }

            res.json({
                success: true,
                notifications: results
            });
        }
    );
};


// ===============================
// MARK ONE AS READ
// ===============================

const markAsRead = (req, res) => {

    const userId = req.userId;
    const notificationId = req.params.id;

    db.query(
        `
        UPDATE notifications
        SET is_read = TRUE
        WHERE id = ?
        AND user_id = ?
        `,
        [notificationId, userId],
        (err, result) => {

            if (err) {
                console.error("❌ MARK READ ERROR:", err);

                return res.status(500).json({
                    success: false,
                    message: "Unable to mark notification as read",
                    error: err.message
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Notification not found"
                });
            }

            res.json({
                success: true,
                message: "Notification marked as read"
            });
        }
    );
};


// ===============================
// MARK ALL AS READ
// ===============================

const markAllAsRead = (req, res) => {

    const userId = req.userId;

    db.query(
        `
        UPDATE notifications
        SET is_read = TRUE
        WHERE user_id = ?
        AND is_read = FALSE
        `,
        [userId],
        (err, result) => {

            if (err) {
                console.error("❌ MARK ALL READ ERROR:", err);

                return res.status(500).json({
                    success: false,
                    message: "Unable to mark notifications as read",
                    error: err.message
                });
            }

            res.json({
                success: true,
                message: "All notifications marked as read",
                updated: result.affectedRows
            });
        }
    );
};


// ===============================
// EXPORT
// ===============================

module.exports = {
    getNotifications,
    markAsRead,
    markAllAsRead
};