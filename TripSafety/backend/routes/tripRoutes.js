// ============================================
// TRIP SAFETY - TRIP ROUTES
// ============================================

const express = require("express");

const router = express.Router();

const authMiddleware =
    require("../middleware/authMiddleware");

const tripController =
    require("../controllers/tripController");


// ============================================
// CREATE TRIP
// POST /api/trips
// ============================================

router.post(
    "/",
    authMiddleware,
    tripController.createTrip
);


// ============================================
// GET ALL USER TRIPS
// GET /api/trips
// ============================================

router.get(
    "/",
    authMiddleware,
    tripController.getTrips
);


// ============================================
// GET SINGLE TRIP
// GET /api/trips/:id
// ============================================

router.get(
    "/:id",
    authMiddleware,
    tripController.getTrip
);


// ============================================
// START TRIP
// PUT /api/trips/:id/start
// ============================================

router.put(
    "/:id/start",
    authMiddleware,
    tripController.startTrip
);


// ============================================
// COMPLETE TRIP
// PUT /api/trips/:id/complete
// ============================================

router.put(
    "/:id/complete",
    authMiddleware,
    tripController.completeTrip
);


// ============================================
// CANCEL TRIP
// PUT /api/trips/:id/cancel
// ============================================

router.put(
    "/:id/cancel",
    authMiddleware,
    tripController.cancelTrip
);


// ============================================
// TRIP HISTORY
// GET /api/trips/history
// ============================================

router.get(
    "/history/all",
    authMiddleware,
    tripController.getTripHistory
);


module.exports = router;