// ============================================
// TRIP SAFETY - BACKEND SERVER
// ============================================

require("dotenv").config();


// ============================================
// IMPORTS
// ============================================

const express = require("express");
const cors = require("cors");

const db = require("./config/database");


// ============================================
// ROUTES
// ============================================

const authRoutes =
    require("./routes/authRoutes");

const tripRoutes =
    require("./routes/tripRoutes");

const trackingRoutes =
    require("./routes/trackingRoutes");

const contactRoutes =
    require("./routes/contactRoutes");

const notificationRoutes =
    require("./routes/notificationRoutes");

const sosRoutes =
    require("./routes/sosRoutes");


// ============================================
// APP
// ============================================

const app = express();


// ============================================
// MIDDLEWARE
// ============================================

// Allow frontend from laptop and mobile
app.use(
    cors({
        origin: true,
        credentials: true
    })
);

app.use(
    express.json()
);


// ============================================
// CHECK ROUTES
// ============================================

console.log("");
console.log("========== ROUTE CHECK ==========");

console.log(
    "AUTH ROUTES:",
    typeof authRoutes
);

console.log(
    "TRIP ROUTES:",
    typeof tripRoutes
);

console.log(
    "TRACKING ROUTES:",
    typeof trackingRoutes
);

console.log(
    "CONTACT ROUTES:",
    typeof contactRoutes
);

console.log(
    "NOTIFICATION ROUTES:",
    typeof notificationRoutes
);

console.log(
    "SOS ROUTES:",
    typeof sosRoutes
);

console.log(
    "================================="
);
console.log("");


// ============================================
// VALIDATE ROUTES
// ============================================

if (typeof authRoutes !== "function") {
    throw new Error(
        "authRoutes.js is not exporting an Express router."
    );
}

if (typeof tripRoutes !== "function") {
    throw new Error(
        "tripRoutes.js is not exporting an Express router."
    );
}

if (typeof trackingRoutes !== "function") {
    throw new Error(
        "trackingRoutes.js is not exporting an Express router."
    );
}

if (typeof contactRoutes !== "function") {
    throw new Error(
        "contactRoutes.js is not exporting an Express router."
    );
}

if (typeof notificationRoutes !== "function") {
    throw new Error(
        "notificationRoutes.js is not exporting an Express router."
    );
}

if (typeof sosRoutes !== "function") {
    throw new Error(
        "sosRoutes.js is not exporting an Express router."
    );
}


// ============================================
// AUTH ROUTES
// ============================================

app.use(
    "/api/auth",
    authRoutes
);


// ============================================
// TRIP ROUTES
// ============================================

app.use(
    "/api/trips",
    tripRoutes
);


// ============================================
// TRACKING ROUTES
// ============================================

app.use(
    "/api/tracking",
    trackingRoutes
);


// ============================================
// CONTACT ROUTES
// ============================================

app.use(
    "/api/contacts",
    contactRoutes
);


// ============================================
// NOTIFICATION ROUTES
// ============================================

app.use(
    "/api/notifications",
    notificationRoutes
);


// ============================================
// SOS ROUTES
// ============================================

app.use(
    "/api/sos",
    sosRoutes
);


// ============================================
// HOME API
// ============================================

app.get(
    "/",
    (req, res) => {

        res.json({
            success: true,
            message:
                "TripSafety API is running 🚀"
        });

    }
);


// ============================================
// DATABASE TEST
// ============================================

app.get(
    "/api/test-db",
    (req, res) => {

        db.query(
            "SELECT 1 AS result",
            (err, result) => {

                if (err) {

                    console.error(
                        "Database error:",
                        err
                    );

                    return res.status(500).json({
                        success: false,
                        message:
                            "Database connection failed"
                    });

                }

                res.json({
                    success: true,
                    message:
                        "Database connected successfully",
                    result
                });

            }
        );

    }
);


// ============================================
// 404 HANDLER
// ============================================

app.use(
    (req, res) => {

        res.status(404).json({
            success: false,
            message:
                "API endpoint not found"
        });

    }
);


// ============================================
// GLOBAL ERROR HANDLER
// ============================================

app.use(
    (err, req, res, next) => {

        console.error(
            "SERVER ERROR:",
            err
        );

        res.status(500).json({
            success: false,
            message:
                "Internal server error"
        });

    }
);


// ============================================
// START SERVER
// ============================================

const PORT =
    process.env.PORT || 5000;


// ============================================
// LISTEN ON ALL NETWORK INTERFACES
// ============================================

app.listen(PORT, "0.0.0.0", () => {

    console.log("");
    console.log("============================================");
    console.log("🚀 TripSafety Server Started");
    console.log("============================================");
    console.log(`Local:   http://localhost:${PORT}`);
    console.log(`Network: http://10.207.140.55:${PORT}`);
    console.log("============================================");

});