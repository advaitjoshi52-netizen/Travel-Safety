const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,

    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
});

const sendPasswordResetEmail = async (
    email,
    name,
    resetLink
) => {

    const mailOptions = {
        from: `"TripSafety" <${process.env.MAIL_USER}>`,
        to: email,

        subject: "TripSafety - Reset Your Password",

        text: `
Hello ${name || "User"},

We received a request to reset your TripSafety password.

Click the link below to reset your password:

${resetLink}

This link will expire in 15 minutes.

If you did not request a password reset, you can safely ignore this email.

Regards,
TripSafety Team
        `,

        html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>TripSafety Password Reset</title>
</head>

<body style="
    margin:0;
    padding:0;
    background:#f5f7fb;
    font-family:Arial,Helvetica,sans-serif;
">

    <div style="
        max-width:600px;
        margin:40px auto;
        background:#ffffff;
        border-radius:16px;
        padding:40px;
        box-shadow:0 10px 30px rgba(0,0,0,0.08);
    ">

        <div style="
            text-align:center;
            font-size:42px;
            margin-bottom:15px;
        ">
            🛡️
        </div>

        <h1 style="
            text-align:center;
            color:#2563eb;
            margin-bottom:10px;
        ">
            TripSafety
        </h1>

        <h2 style="
            text-align:center;
            color:#111827;
        ">
            Reset Your Password
        </h2>

        <p style="
            color:#475569;
            font-size:15px;
            line-height:1.6;
        ">
            Hello ${name || "User"},
        </p>

        <p style="
            color:#475569;
            font-size:15px;
            line-height:1.6;
        ">
            We received a request to reset your TripSafety password.
            Click the button below to create a new password.
        </p>

        <div style="
            text-align:center;
            margin:30px 0;
        ">

            <a
                href="${resetLink}"
                style="
                    display:inline-block;
                    background:#2563eb;
                    color:#ffffff;
                    text-decoration:none;
                    padding:14px 28px;
                    border-radius:8px;
                    font-weight:bold;
                "
            >
                Reset Password
            </a>

        </div>

        <p style="
            color:#64748b;
            font-size:13px;
            line-height:1.6;
        ">
            This password reset link will expire in
            <strong>15 minutes</strong>.
        </p>

        <p style="
            color:#64748b;
            font-size:13px;
            line-height:1.6;
        ">
            If you did not request this password reset,
            you can safely ignore this email.
        </p>

        <hr style="
            border:none;
            border-top:1px solid #e5e7eb;
            margin:30px 0;
        ">

        <p style="
            text-align:center;
            color:#94a3b8;
            font-size:12px;
        ">
            © 2026 TripSafety. Smart Travel Safety.
        </p>

    </div>

</body>
</html>
        `
    };

    return transporter.sendMail(mailOptions);
};

module.exports = {
    sendPasswordResetEmail
};