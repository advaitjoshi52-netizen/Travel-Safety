const express = require("express");

const {
    getNotifications,
    markAsRead,
    markAllAsRead
} = require("../controllers/notificationController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


// ===============================
// GET NOTIFICATIONS
// ===============================

router.get(
    "/",
    authMiddleware,
    getNotifications
);


// ===============================
// MARK ONE AS READ
// ===============================

router.patch(
    "/:id/read",
    authMiddleware,
    markAsRead
);


// ===============================
// MARK ALL AS READ
// ===============================

router.patch(
    "/read-all",
    authMiddleware,
    markAllAsRead
);


module.exports = router;