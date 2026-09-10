const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const db = require("../config/database");
const { generateToken } = require("../utils/jwt");
const {
    sendPasswordResetEmail
} = require("../utils/email");


// ==========================================
// REGISTER USER
// ==========================================

const register = async (req, res) => {

    try {

        const { name, email, password } = req.body;

        if (!name || !email || !password) {

            return res.status(400).json({
                success: false,
                message: "Name, email and password are required"
            });
        }

        if (password.length < 6) {

            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters"
            });
        }

        const normalizedName = name.trim();
        const normalizedEmail = email.trim().toLowerCase();

        db.query(
            "SELECT id FROM users WHERE email = ?",
            [normalizedEmail],
            async (err, results) => {

                if (err) {

                    console.error(
                        "Register SELECT error:",
                        err
                    );

                    return res.status(500).json({
                        success: false,
                        message: "Database error"
                    });
                }

                if (results.length > 0) {

                    return res.status(409).json({
                        success: false,
                        message: "Email already registered"
                    });
                }

                const hashedPassword =
                    await bcrypt.hash(password, 10);

                db.query(
                    `
                    INSERT INTO users
                    (name, email, password)
                    VALUES (?, ?, ?)
                    `,
                    [
                        normalizedName,
                        normalizedEmail,
                        hashedPassword
                    ],
                    (insertError, result) => {

                        if (insertError) {

                            console.error(
                                "Register INSERT error:",
                                insertError
                            );

                            return res.status(500).json({
                                success: false,
                                message:
                                    "Unable to create account"
                            });
                        }

                        const token =
                            generateToken(result.insertId);

                        return res.status(201).json({

                            success: true,

                            message:
                                "Account created successfully",

                            token,

                            user: {
                                id: result.insertId,
                                name: normalizedName,
                                email: normalizedEmail
                            }

                        });

                    }
                );

            }
        );

    } catch (error) {

        console.error(
            "Register error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }

};


// ==========================================
// LOGIN USER
// ==========================================

const login = async (req, res) => {

    try {

        const { email, password } = req.body;

        if (!email || !password) {

            return res.status(400).json({
                success: false,
                message:
                    "Email and password are required"
            });
        }

        const normalizedEmail =
            email.trim().toLowerCase();

        db.query(
            "SELECT * FROM users WHERE email = ?",
            [normalizedEmail],
            async (err, results) => {

                if (err) {

                    console.error(
                        "Login database error:",
                        err
                    );

                    return res.status(500).json({
                        success: false,
                        message: "Database error"
                    });
                }

                if (results.length === 0) {

                    return res.status(401).json({
                        success: false,
                        message:
                            "Invalid email or password"
                    });
                }

                const user = results[0];

                const passwordMatch =
                    await bcrypt.compare(
                        password,
                        user.password
                    );

                if (!passwordMatch) {

                    return res.status(401).json({
                        success: false,
                        message:
                            "Invalid email or password"
                    });
                }

                const token =
                    generateToken(user.id);

                return res.json({

                    success: true,

                    message:
                        "Login successful",

                    token,

                    user: {
                        id: user.id,
                        name: user.name,
                        email: user.email
                    }

                });

            }
        );

    } catch (error) {

        console.error(
            "Login error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }

};


// ==========================================
// GET CURRENT USER
// ==========================================

const getMe = (req, res) => {

    const userId = req.user.userId;

    db.query(
        `
        SELECT
            id,
            name,
            email,
            created_at
        FROM users
        WHERE id = ?
        `,
        [userId],
        (err, results) => {

            if (err) {

                console.error(
                    "Get user error:",
                    err
                );

                return res.status(500).json({
                    success: false,
                    message: "Database error"
                });
            }

            if (results.length === 0) {

                return res.status(404).json({
                    success: false,
                    message: "User not found"
                });
            }

            return res.json({
                success: true,
                user: results[0]
            });

        }
    );

};


// ==========================================
// CHANGE PASSWORD
// ==========================================

const changePassword = async (req, res) => {

    try {

        const userId = req.user.userId;

        const {
            currentPassword,
            newPassword
        } = req.body;

        if (!currentPassword || !newPassword) {

            return res.status(400).json({
                success: false,
                message:
                    "Current password and new password are required."
            });
        }

        if (newPassword.length < 6) {

            return res.status(400).json({
                success: false,
                message:
                    "New password must contain at least 6 characters."
            });
        }

        if (currentPassword === newPassword) {

            return res.status(400).json({
                success: false,
                message:
                    "New password must be different from current password."
            });
        }

        db.query(
            `
            SELECT id, password
            FROM users
            WHERE id = ?
            LIMIT 1
            `,
            [userId],
            async (err, results) => {

                if (err) {

                    console.error(
                        "Change password SELECT error:",
                        err
                    );

                    return res.status(500).json({
                        success: false,
                        message: "Database error."
                    });
                }

                if (results.length === 0) {

                    return res.status(404).json({
                        success: false,
                        message: "User not found."
                    });
                }

                const user = results[0];

                const passwordMatch =
                    await bcrypt.compare(
                        currentPassword,
                        user.password
                    );

                if (!passwordMatch) {

                    return res.status(401).json({
                        success: false,
                        message:
                            "Current password is incorrect."
                    });
                }

                const hashedPassword =
                    await bcrypt.hash(
                        newPassword,
                        10
                    );

                db.query(
                    `
                    UPDATE users
                    SET password = ?
                    WHERE id = ?
                    `,
                    [
                        hashedPassword,
                        userId
                    ],
                    (updateError, result) => {

                        if (updateError) {

                            console.error(
                                "Change password UPDATE error:",
                                updateError
                            );

                            return res.status(500).json({
                                success: false,
                                message:
                                    "Unable to update password."
                            });
                        }

                        return res.json({
                            success: true,
                            message:
                                "Password changed successfully."
                        });

                    }
                );

            }
        );

    } catch (error) {

        console.error(
            "Change password error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Unable to change password."
        });
    }

};


// ==========================================
// FORGOT PASSWORD
// ==========================================

const forgotPassword = (req, res) => {

    const { email } = req.body;

    if (!email) {

        return res.status(400).json({
            success: false,
            message: "Email is required"
        });
    }

    const normalizedEmail =
        email.trim().toLowerCase();

    console.log(
        "Forgot password request:",
        normalizedEmail
    );

    db.query(
        `
        SELECT
            id,
            name,
            email
        FROM users
        WHERE LOWER(TRIM(email)) = ?
        LIMIT 1
        `,
        [normalizedEmail],
        (error, results) => {

            if (error) {

                console.error(
                    "Forgot password SELECT error:",
                    error
                );

                return res.status(500).json({
                    success: false,
                    message: "Database error"
                });
            }

            console.log(
                "Users found:",
                results.length
            );

            if (results.length === 0) {

                return res.status(404).json({
                    success: false,
                    message:
                        "No account found with this email"
                });
            }

            const user = results[0];

            // --------------------------------------
            // GENERATE SECURE TOKEN
            // --------------------------------------

            const rawToken =
                crypto.randomBytes(32).toString("hex");

            const tokenHash =
                crypto
                    .createHash("sha256")
                    .update(rawToken)
                    .digest("hex");

            // Token expires after 15 minutes
            const expiresAt =
                new Date(
                    Date.now() + 15 * 60 * 1000
                );

            // --------------------------------------
            // DELETE OLD UNUSED TOKENS
            // --------------------------------------

            db.query(
                `
                DELETE FROM password_reset_tokens
                WHERE user_id = ?
                AND used = FALSE
                `,
                [user.id],
                (deleteError) => {

                    if (deleteError) {

                        console.error(
                            "Delete reset tokens error:",
                            deleteError
                        );

                        return res.status(500).json({
                            success: false,
                            message:
                                "Unable to create reset request"
                        });
                    }

                    // --------------------------------------
                    // SAVE NEW TOKEN
                    // --------------------------------------

                    db.query(
                        `
                        INSERT INTO password_reset_tokens
                        (
                            user_id,
                            token_hash,
                            expires_at,
                            used
                        )
                        VALUES (?, ?, ?, FALSE)
                        `,
                        [
                            user.id,
                            tokenHash,
                            expiresAt
                        ],
                        async (insertError) => {

                            if (insertError) {

                                console.error(
                                    "Reset token INSERT error:",
                                    insertError
                                );

                                return res.status(500).json({
                                    success: false,
                                    message:
                                        "Unable to create reset request"
                                });
                            }

                            // --------------------------------------
                            // CREATE MOBILE-ACCESSIBLE RESET LINK
                            // --------------------------------------

                            const frontendUrl =
                                process.env.FRONTEND_URL ||
                                "http://127.0.0.1:5500/TripSafety/frontend";

                            const resetLink =
                                `${frontendUrl}/reset-password.html?token=${rawToken}`;

                            console.log("");
                            console.log(
                                "=========================================="
                            );
                            console.log(
                                "PASSWORD RESET REQUEST"
                            );
                            console.log(
                                "=========================================="
                            );
                            console.log(
                                "User:",
                                user.name
                            );
                            console.log(
                                "Email:",
                                user.email
                            );
                            console.log(
                                "User ID:",
                                user.id
                            );
                            console.log(
                                "Reset Link:"
                            );
                            console.log(
                                resetLink
                            );
                            console.log(
                                "Expires: 15 minutes"
                            );
                            console.log(
                                "=========================================="
                            );
                            console.log("");

                            // --------------------------------------
                            // SEND EMAIL
                            // --------------------------------------

                            try {

                                await sendPasswordResetEmail(
                                    user.email,
                                    user.name,
                                    resetLink
                                );

                                console.log(
                                    "Password reset email sent to:",
                                    user.email
                                );

                                return res.json({

                                    success: true,

                                    message:
                                        "Password reset link has been sent to your email."

                                });

                            } catch (emailError) {

                                console.error(
                                    "Password reset email error:",
                                    emailError
                                );

                                // Remove token if email fails
                                db.query(
                                    `
                                    DELETE FROM password_reset_tokens
                                    WHERE token_hash = ?
                                    `,
                                    [tokenHash]
                                );

                                return res.status(500).json({

                                    success: false,

                                    message:
                                        "Unable to send password reset email. Please try again later."

                                });

                            }

                        }
                    );

                }
            );

        }
    );

};


// ==========================================
// RESET PASSWORD
// ==========================================

const resetPassword = (req, res) => {

    const {
        token,
        newPassword
    } = req.body;

    if (!token || !newPassword) {

        return res.status(400).json({
            success: false,
            message:
                "Token and new password are required"
        });
    }

    if (newPassword.length < 6) {

        return res.status(400).json({
            success: false,
            message:
                "Password must contain at least 6 characters"
        });
    }

    const tokenHash =
        crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");

    db.query(
        `
        SELECT
            id,
            user_id,
            expires_at,
            used
        FROM password_reset_tokens
        WHERE token_hash = ?
        LIMIT 1
        `,
        [tokenHash],
        (error, results) => {

            if (error) {

                console.error(
                    "Reset token SELECT error:",
                    error
                );

                return res.status(500).json({
                    success: false,
                    message: "Database error"
                });
            }

            if (results.length === 0) {

                return res.status(400).json({
                    success: false,
                    message:
                        "Invalid or expired reset link"
                });
            }

            const resetToken = results[0];

            if (resetToken.used) {

                return res.status(400).json({
                    success: false,
                    message:
                        "This reset link has already been used"
                });
            }

            const expiresAt =
                new Date(
                    resetToken.expires_at
                ).getTime();

            if (
                isNaN(expiresAt) ||
                expiresAt < Date.now()
            ) {

                return res.status(400).json({
                    success: false,
                    message:
                        "This reset link has expired"
                });
            }

            bcrypt.hash(
                newPassword,
                10,
                (hashError, hashedPassword) => {

                    if (hashError) {

                        console.error(
                            "Password hash error:",
                            hashError
                        );

                        return res.status(500).json({
                            success: false,
                            message:
                                "Unable to secure new password"
                        });
                    }

                    db.query(
                        `
                        UPDATE users
                        SET password = ?
                        WHERE id = ?
                        `,
                        [
                            hashedPassword,
                            resetToken.user_id
                        ],
                        (updateError, updateResult) => {

                            if (updateError) {

                                console.error(
                                    "Reset password UPDATE error:",
                                    updateError
                                );

                                return res.status(500).json({
                                    success: false,
                                    message:
                                        "Unable to update password"
                                });
                            }

                            if (
                                updateResult.affectedRows === 0
                            ) {

                                return res.status(404).json({
                                    success: false,
                                    message:
                                        "User not found"
                                });
                            }

                            db.query(
                                `
                                UPDATE password_reset_tokens
                                SET used = TRUE
                                WHERE id = ?
                                `,
                                [resetToken.id],
                                (tokenError) => {

                                    if (tokenError) {

                                        console.error(
                                            "Reset token update error:",
                                            tokenError
                                        );

                                        return res.status(500).json({
                                            success: false,
                                            message:
                                                "Password changed, but reset token could not be closed"
                                        });
                                    }

                                    console.log(
                                        "Password reset successfully for user:",
                                        resetToken.user_id
                                    );

                                    return res.json({

                                        success: true,

                                        message:
                                            "Password reset successfully"

                                    });

                                }
                            );

                        }
                    );

                }
            );

        }
    );

};


// ==========================================
// EXPORT
// ==========================================

module.exports = {
    register,
    login,
    getMe,
    changePassword,
    forgotPassword,
    resetPassword
};