// ============================================
// TripSafety - Reset Password
// ============================================

// Automatically use the same computer/IP that
// opened the frontend.
//
// Laptop:
// http://127.0.0.1:5500
//
// Mobile:
// http://10.207.140.55:5500
//
// API becomes:
// http://10.207.140.55:5000/api

const API_URL = `http://${window.location.hostname}:5000/api`;

console.log("TripSafety API:", API_URL);


// ============================================
// ELEMENTS
// ============================================

const resetForm = document.getElementById("resetForm");
const newPasswordInput =
    document.getElementById("newPassword");

const confirmPasswordInput =
    document.getElementById("confirmPassword");

const resetMessage =
    document.getElementById("resetMessage");

const resetButton =
    document.getElementById("resetPasswordBtn");


// ============================================
// GET RESET TOKEN
// ============================================

const urlParams =
    new URLSearchParams(window.location.search);

const token = urlParams.get("token");


// ============================================
// CHECK TOKEN
// ============================================

if (!token) {

    showMessage(
        "Invalid or missing password reset token.",
        "error"
    );

    if (resetButton) {
        resetButton.disabled = true;
    }
}


// ============================================
// FORM SUBMIT
// ============================================

if (resetForm) {

    resetForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            const newPassword =
                newPasswordInput.value.trim();

            const confirmPassword =
                confirmPasswordInput.value.trim();


            // ------------------------------------
            // VALIDATION
            // ------------------------------------

            if (!token) {

                showMessage(
                    "Invalid or missing reset token.",
                    "error"
                );

                return;
            }


            if (!newPassword || !confirmPassword) {

                showMessage(
                    "Please enter both passwords.",
                    "error"
                );

                return;
            }


            if (newPassword.length < 6) {

                showMessage(
                    "Password must contain at least 6 characters.",
                    "error"
                );

                return;
            }


            if (newPassword !== confirmPassword) {

                showMessage(
                    "Passwords do not match.",
                    "error"
                );

                return;
            }


            // ------------------------------------
            // BUTTON
            // ------------------------------------

            if (resetButton) {

                resetButton.disabled = true;

                resetButton.textContent =
                    "Resetting...";
            }


            try {

                console.log(
                    "Sending reset request to:",
                    `${API_URL}/auth/reset-password`
                );


                // --------------------------------
                // API REQUEST
                // --------------------------------

                const response =
                    await fetch(
                        `${API_URL}/auth/reset-password`,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({
                                token: token,
                                newPassword: newPassword
                            })
                        }
                    );


                // --------------------------------
                // READ RESPONSE
                // --------------------------------

                const data =
                    await response.json();


                console.log(
                    "Reset response:",
                    data
                );


                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        "Unable to reset password."
                    );
                }


                // --------------------------------
                // SUCCESS
                // --------------------------------

                showMessage(
                    "Password reset successfully! Redirecting to login...",
                    "success"
                );


                if (newPasswordInput) {
                    newPasswordInput.value = "";
                }

                if (confirmPasswordInput) {
                    confirmPasswordInput.value = "";
                }


                // Redirect to login after 2 seconds

                setTimeout(
                    () => {

                        window.location.href =
                            "index.html";

                    },
                    2000
                );


            } catch (error) {

                console.error(
                    "Reset password error:",
                    error
                );


                showMessage(
                    error.message ||
                    "Failed to reset password.",
                    "error"
                );


                if (resetButton) {

                    resetButton.disabled = false;

                    resetButton.textContent =
                        "Reset Password";
                }
            }

        }
    );
}


// ============================================
// MESSAGE
// ============================================

function showMessage(message, type) {

    if (!resetMessage) {
        alert(message);
        return;
    }


    resetMessage.textContent = message;

    resetMessage.style.display = "block";


    if (type === "success") {

        resetMessage.style.background =
            "#ecfdf5";

        resetMessage.style.color =
            "#047857";

        resetMessage.style.border =
            "1px solid #a7f3d0";

    } else {

        resetMessage.style.background =
            "#fef2f2";

        resetMessage.style.color =
            "#dc2626";

        resetMessage.style.border =
            "1px solid #fecaca";
    }
}