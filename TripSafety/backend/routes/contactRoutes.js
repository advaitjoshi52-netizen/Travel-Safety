// ============================================
// TRIP SAFETY - CONTACT ROUTES
// ============================================

const express = require("express");

const router = express.Router();


// ============================================
// MIDDLEWARE
// ============================================

const authMiddleware =
    require("../middleware/authMiddleware");


// ============================================
// CONTROLLER
// ============================================

const contactController =
    require("../controllers/contactController");


// ============================================
// GET ALL CONTACTS
// GET /api/contacts
// ============================================

router.get(
    "/",
    authMiddleware,
    contactController.getContacts
);


// ============================================
// ADD CONTACT
// POST /api/contacts
// ============================================

router.post(
    "/",
    authMiddleware,
    contactController.addContact
);


// ============================================
// UPDATE CONTACT
// PUT /api/contacts/:id
// ============================================

router.put(
    "/:id",
    authMiddleware,
    contactController.updateContact
);


// ============================================
// DELETE CONTACT
// DELETE /api/contacts/:id
// ============================================

router.delete(
    "/:id",
    authMiddleware,
    contactController.deleteContact
);


// ============================================
// EXPORT ROUTER
// ============================================

module.exports = router;