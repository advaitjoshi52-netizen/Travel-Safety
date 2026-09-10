const API_URL = "http://localhost:5000/api";

const form =
    document.getElementById("forgotPasswordForm");

const button =
    document.getElementById("resetBtn");

const message =
    document.getElementById("message");


form.addEventListener("submit", async function(e) {

    e.preventDefault();

    const email =
        document.getElementById("email")
        .value
        .trim();


    button.disabled = true;
    button.textContent = "Checking...";

    message.className = "message";
    message.textContent = "";


    try {

        const response = await fetch(
            `${API_URL}/auth/forgot-password`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    email
                })
            }
        );


        const data = await response.json();


        if (!response.ok) {
            throw new Error(
                data.message ||
                "Unable to process request"
            );
        }


        message.className =
            "message success";

        message.textContent =
            data.message;


    } catch (error) {

        message.className =
            "message error";

        message.textContent =
            error.message;

    }


    button.disabled = false;
    button.textContent = "Reset Password";

});

