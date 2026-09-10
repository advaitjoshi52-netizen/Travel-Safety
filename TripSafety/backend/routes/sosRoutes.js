// ============================================
// TRIP SAFETY - SOS ROUTES
// ============================================

const express = require("express");

const router = express.Router();

const authMiddleware =
    require("../middleware/authMiddleware");

const sosController =
    require("../controllers/sosController");


// ============================================
// ACTIVATE SOS
// POST /api/sos
// ============================================

router.post(
    "/",
    authMiddleware,
    sosController.activateSOS
);


// ============================================
// GET ACTIVE SOS
// GET /api/sos/active
// ============================================

router.get(
    "/active",
    authMiddleware,
    sosController.getActiveSOS
);


// ============================================
// RESOLVE SOS
// PUT /api/sos/:id/resolve
// ============================================

router.put(
    "/:id/resolve",
    authMiddleware,
    sosController.resolveSOS
);


// ============================================
// EXPORT ROUTER
// ============================================

module.exports = router;