const express = require("express");

const {
    saveLocation,
    getLatestLocation,
    getLocationHistory
} = require("../controllers/trackingController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


// ===============================
// SAVE GPS LOCATION
// ===============================

router.post(
    "/:id/location",
    authMiddleware,
    saveLocation
);


// ===============================
// GET LATEST LOCATION
// ===============================

router.get(
    "/:id/location",
    authMiddleware,
    getLatestLocation
);


// ===============================
// GET LOCATION HISTORY
// ===============================

router.get(
    "/:id/location/history",
    authMiddleware,
    getLocationHistory
);


module.exports = router;