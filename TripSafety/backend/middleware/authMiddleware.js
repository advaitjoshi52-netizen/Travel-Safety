// ============================================
// TRIP SAFETY - AUTH MIDDLEWARE
// ============================================

const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {

    const authHeader = req.headers.authorization;

    console.log(
        "AUTH HEADER:",
        authHeader ? "Token received" : "Missing"
    );


    // ========================================
    // CHECK TOKEN
    // ========================================

    if (
        !authHeader ||
        !authHeader.startsWith("Bearer ")
    ) {

        return res.status(401).json({
            success: false,
            message: "Authentication required."
        });

    }


    const token =
        authHeader.split(" ")[1];


    if (!token) {

        return res.status(401).json({
            success: false,
            message: "Token missing."
        });

    }


    try {

        // ========================================
        // VERIFY JWT
        // ========================================

        const decoded =
            jwt.verify(
                token,
                process.env.JWT_SECRET
            );


        console.log(
            "JWT SECRET LOADED:",
            process.env.JWT_SECRET
                ? "Yes"
                : "No"
        );


        console.log(
            "JWT VERIFIED:",
            decoded
        );


        // ========================================
        // SET USER
        // ========================================

        req.user = decoded;

        req.userId =
            decoded.userId;


        console.log(
            "AUTH USER ID:",
            req.userId
        );


        next();


    } catch (error) {

        console.error(
            "JWT ERROR:",
            error.message
        );


        return res.status(401).json({
            success: false,
            message:
                "Invalid or expired token."
        });

    }

};


module.exports = authMiddleware;