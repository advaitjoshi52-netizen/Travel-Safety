const express = require("express");

const {
    register,
    login,
    getMe,
    changePassword,
    forgotPassword,
    resetPassword
} = require("../controllers/authController");

const authMiddleware =
    require("../middleware/authMiddleware");

const router = express.Router();


// Register
router.post(
    "/register",
    register
);


// Login
router.post(
    "/login",
    login
);


// Current user
router.get(
    "/me",
    authMiddleware,
    getMe
);


// Change password
router.put(
    "/change-password",
    authMiddleware,
    changePassword
);


// Forgot password
router.post(
    "/forgot-password",
    forgotPassword
);


// Reset password
router.post(
    "/reset-password",
    resetPassword
);


module.exports = router;