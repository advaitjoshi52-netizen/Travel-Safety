const API_BASE = "http://localhost:5000/api";


// ======================================
// LOGIN
// ======================================

async function loginUser(event) {

    event.preventDefault();

    console.log("LOGIN BUTTON CLICKED");


    const email =
        document.getElementById("loginEmail").value.trim();

    const password =
        document.getElementById("loginPassword").value;

    const message =
        document.getElementById("loginMessage");

    const button =
        document.getElementById("loginBtn");


    console.log("Email:", email);


    if (!email || !password) {

        message.textContent =
            "Please enter email and password.";

        message.style.color = "#dc2626";

        return;
    }


    button.disabled = true;

    button.textContent = "Logging in...";

    message.textContent =
        "Connecting to server...";

    message.style.color = "#2563eb";


    try {

        const response = await fetch(
            `${API_BASE}/auth/login`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    email: email,
                    password: password
                })
            }
        );


        console.log(
            "Server response:",
            response.status
        );


        const data =
            await response.json();


        console.log(
            "Login data:",
            data
        );


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Invalid email or password"
            );
        }


        // SAVE TOKEN

        localStorage.setItem(
            "tripSafetyToken",
            data.token
        );


        // SAVE USER

        localStorage.setItem(
            "tripSafetyUser",
            JSON.stringify(data.user)
        );


        message.textContent =
            "Login successful!";

        message.style.color =
            "#16a34a";


        console.log(
            "LOGIN SUCCESSFUL"
        );


        setTimeout(
            function () {

                window.location.href =
                    "dashboard.html";

            },
            700
        );


    } catch (error) {

        console.error(
            "LOGIN ERROR:",
            error
        );


        if (
            error.message ===
            "Failed to fetch"
        ) {

            message.textContent =
                "Cannot connect to server. Start backend with npm run dev.";

        } else {

            message.textContent =
                error.message;

        }


        message.style.color =
            "#dc2626";

    }


    button.disabled = false;

    button.textContent = "Login";

}



// ======================================
// REGISTER
// ======================================

async function registerUser(event) {

    event.preventDefault();


    const name =
        document.getElementById(
            "registerName"
        ).value.trim();


    const email =
        document.getElementById(
            "registerEmail"
        ).value.trim();


    const password =
        document.getElementById(
            "registerPassword"
        ).value;


    const message =
        document.getElementById(
            "registerMessage"
        );


    const button =
        document.getElementById(
            "registerBtn"
        );


    button.disabled = true;

    button.textContent =
        "Creating account...";


    try {

        const response =
            await fetch(
                `${API_BASE}/auth/register`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        name,
                        email,
                        password
                    })
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Registration failed"
            );

        }


        localStorage.setItem(
            "tripSafetyToken",
            data.token
        );


        localStorage.setItem(
            "tripSafetyUser",
            JSON.stringify(data.user)
        );


        message.textContent =
            "Account created successfully!";

        message.style.color =
            "#16a34a";


        setTimeout(
            function () {

                window.location.href =
                    "dashboard.html";

            },
            700
        );


    } catch (error) {

        console.error(
            "REGISTER ERROR:",
            error
        );


        message.textContent =
            error.message;

        message.style.color =
            "#dc2626";

    }


    button.disabled = false;

    button.textContent = "Sign Up";

}
