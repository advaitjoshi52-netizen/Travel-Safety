// ============================================
// TRIP SAFETY - REGISTER TRIP
// ============================================

const API_URL = "http://localhost:5000/api";


// ============================================
// PAGE LOAD
// ============================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const token =
            localStorage.getItem(
                "tripSafetyToken"
            );


        // ------------------------------------
        // CHECK LOGIN
        // ------------------------------------

        if (!token) {

            alert(
                "Please login first."
            );

            window.location.href =
                "index.html";

            return;
        }


        setupDate();

        setupForm();

        setupCancel();

        setupLogout();

    }
);


// ============================================
// SET MINIMUM DATE
// ============================================

function setupDate() {

    const dateInput =
        document.getElementById(
            "trip_date"
        );


    if (!dateInput) {
        return;
    }


    const today =
        new Date();


    const year =
        today.getFullYear();


    const month =
        String(
            today.getMonth() + 1
        ).padStart(
            2,
            "0"
        );


    const day =
        String(
            today.getDate()
        ).padStart(
            2,
            "0"
        );


    const todayString =
        `${year}-${month}-${day}`;


    dateInput.min =
        todayString;

}


// ============================================
// FORM
// ============================================

function setupForm() {

    const form =
        document.getElementById(
            "tripForm"
        );


    if (!form) {
        return;
    }


    form.addEventListener(
        "submit",
        async event => {

            event.preventDefault();


            await createTrip();

        }
    );

}


// ============================================
// CREATE TRIP
// ============================================

async function createTrip() {

    const submitButton =
        document.getElementById(
            "submitTripBtn"
        );


    // ----------------------------------------
    // GET VALUES
    // ----------------------------------------

    const tripName =
        document.getElementById(
            "trip_name"
        )?.value.trim();


    const transport =
        document.getElementById(
            "transport"
        )?.value.trim();


    const source =
        document.getElementById(
            "source_location"
        )?.value.trim();


    const destination =
        document.getElementById(
            "destination"
        )?.value.trim();


    const tripDate =
        document.getElementById(
            "trip_date"
        )?.value;


    const startTime =
        document.getElementById(
            "start_time"
        )?.value;


    const arrivalTime =
        document.getElementById(
            "expected_arrival"
        )?.value;


    const notes =
        document.getElementById(
            "notes"
        )?.value.trim();


    // ----------------------------------------
    // VALIDATION
    // ----------------------------------------

    if (!tripName) {

        showMessage(
            "Please enter a trip name.",
            "error"
        );

        return;
    }


    if (!source) {

        showMessage(
            "Please enter the starting location.",
            "error"
        );

        return;
    }


    if (!destination) {

        showMessage(
            "Please enter the destination.",
            "error"
        );

        return;
    }


    if (!tripDate) {

        showMessage(
            "Please select the trip date.",
            "error"
        );

        return;
    }


    if (!startTime) {

        showMessage(
            "Please select the start time.",
            "error"
        );

        return;
    }


    // ----------------------------------------
    // DATE VALIDATION
    // ----------------------------------------

    const selectedDate =
        new Date(
            `${tripDate}T00:00:00`
        );


    const today =
        new Date();


    today.setHours(
        0,
        0,
        0,
        0
    );


    if (selectedDate < today) {

        showMessage(
            "Trip date cannot be in the past.",
            "error"
        );

        return;
    }


    // ----------------------------------------
    // TIME VALIDATION
    // ----------------------------------------

    if (
        arrivalTime &&
        arrivalTime <= startTime
    ) {

        showMessage(
            "Expected arrival time should be later than the start time.",
            "error"
        );

        return;
    }


    // ----------------------------------------
    // TOKEN
    // ----------------------------------------

    const token =
        localStorage.getItem(
            "tripSafetyToken"
        );


    if (!token) {

        showMessage(
            "Your session has expired. Please login again.",
            "error"
        );

        return;
    }


    // ----------------------------------------
    // DISABLE BUTTON
    // ----------------------------------------

    if (submitButton) {

        submitButton.disabled =
            true;

        submitButton.textContent =
            "Creating Trip...";

    }


    // ----------------------------------------
    // REQUEST
    // ----------------------------------------

    try {

        const response =
            await fetch(
                `${API_URL}/trips`,
                {
                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json",

                        "Authorization":
                            `Bearer ${token}`

                    },

                    body:
                        JSON.stringify({

                            trip_name:
                                tripName,

                            transport:
                                transport || null,

                            source_location:
                                source,

                            destination:
                                destination,

                            trip_date:
                                tripDate,

                            start_time:
                                startTime,

                            expected_arrival:
                                arrivalTime || null,

                            notes:
                                notes || null

                        })

                }
            );


        const data =
            await response.json();


        console.log(
            "Create Trip API:",
            data
        );


        // ------------------------------------
        // ERROR
        // ------------------------------------

        if (!response.ok) {

            throw new Error(
                data.message ||
                "Unable to create trip."
            );

        }


        // ------------------------------------
        // SUCCESS
        // ------------------------------------

        showMessage(
            "✅ Trip created successfully! Redirecting to dashboard...",
            "success"
        );


        // Reset form

        const form =
            document.getElementById(
                "tripForm"
            );


        if (form) {
            form.reset();
        }


        // Redirect

        setTimeout(
            () => {

                window.location.href =
                    "dashboard.html";

            },
            1200
        );


    } catch (error) {

        console.error(
            "Create trip error:",
            error
        );


        showMessage(
            error.message ||
            "Unable to create trip.",
            "error"
        );


        if (submitButton) {

            submitButton.disabled =
                false;

            submitButton.textContent =
                "🛡️ Create Safety Trip";

        }

    }

}


// ============================================
// CANCEL
// ============================================

function setupCancel() {

    const button =
        document.getElementById(
            "cancelBtn"
        );


    if (!button) {
        return;
    }


    button.addEventListener(
        "click",
        () => {

            const confirmed =
                confirm(
                    "Discard this trip information?"
                );


            if (confirmed) {

                window.location.href =
                    "dashboard.html";

            }

        }
    );

}


// ============================================
// LOGOUT
// ============================================

function setupLogout() {

    const button =
        document.getElementById(
            "logoutBtn"
        );


    if (!button) {
        return;
    }


    button.addEventListener(
        "click",
        () => {

            localStorage.removeItem(
                "tripSafetyToken"
            );


            localStorage.removeItem(
                "tripSafetyUser"
            );


            window.location.href =
                "index.html";

        }
    );

}


// ============================================
// MESSAGE
// ============================================

function showMessage(
    message,
    type
) {

    const element =
        document.getElementById(
            "tripMessage"
        );


    if (!element) {
        return;
    }


    element.textContent =
        message;


    element.style.display =
        "block";


    if (type === "success") {

        element.style.background =
            "#dcfce7";

        element.style.color =
            "#166534";

        element.style.border =
            "1px solid #86efac";

    } else {

        element.style.background =
            "#fee2e2";

        element.style.color =
            "#991b1b";

        element.style.border =
            "1px solid #fca5a5";

    }

}