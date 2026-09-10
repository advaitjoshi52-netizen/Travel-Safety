// ============================================
// TRIPSAFETY - DASHBOARD
// ============================================

const API_URL = "http://localhost:5000/api";


// ============================================
// GET TOKEN
// ============================================

const token =
    localStorage.getItem("tripSafetyToken");


// ============================================
// CHECK LOGIN
// ============================================

if (!token) {
    window.location.href = "index.html";
}


// ============================================
// API REQUEST
// ============================================

async function apiRequest(endpoint, options = {}) {

    const response = await fetch(
        `${API_URL}${endpoint}`,
        {
            ...options,

            headers: {
                "Content-Type": "application/json",

                "Authorization":
                    `Bearer ${token}`,

                ...(options.headers || {})
            }
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Request failed"
        );
    }

    return data;
}


// ============================================
// LOAD DASHBOARD
// ============================================

async function loadDashboard() {

    try {

        // Load trips
        const tripData =
            await apiRequest("/trips");

        // Load contacts
        const contactData =
            await apiRequest("/contacts");


        // ----------------------------------------
        // GET ARRAYS SAFELY
        // ----------------------------------------

        const trips =
            Array.isArray(tripData)
                ? tripData
                : (
                    tripData.trips ||
                    tripData.data ||
                    []
                );


        const contacts =
            Array.isArray(contactData)
                ? contactData
                : (
                    contactData.contacts ||
                    contactData.data ||
                    []
                );


        console.log("Dashboard Trips:", trips);
        console.log("Dashboard Contacts:", contacts);


        // ----------------------------------------
        // COUNT TRIPS
        // ----------------------------------------

        const activeTrips =
            trips.filter(trip =>
                String(trip.status).toLowerCase() === "active"
            );


        const upcomingTrips =
            trips.filter(trip =>
                String(trip.status).toLowerCase() === "upcoming"
            );


        // ----------------------------------------
        // UPDATE COUNTS
        // ----------------------------------------

        const activeCount =
            document.getElementById(
                "activeTripsCount"
            );

        const upcomingCount =
            document.getElementById(
                "upcomingTripsCount"
            );

        const contactsCount =
            document.getElementById(
                "trustedContactsCount"
            );

        const readiness =
            document.getElementById(
                "safetyReadiness"
            );


        if (activeCount) {
            activeCount.textContent =
                activeTrips.length;
        }


        if (upcomingCount) {
            upcomingCount.textContent =
                upcomingTrips.length;
        }


        if (contactsCount) {
            contactsCount.textContent =
                contacts.length;
        }


        // ----------------------------------------
        // SAFETY READINESS
        // ----------------------------------------

        let safetyScore = 0;


        if (contacts.length > 0) {
            safetyScore += 50;
        }


        if (trips.length > 0) {
            safetyScore += 50;
        }


        if (readiness) {
            readiness.textContent =
                `${safetyScore}%`;
        }


        // ----------------------------------------
        // SHOW TRIP
        // ----------------------------------------

        displayTrip(
            activeTrips,
            upcomingTrips,
            trips
        );


    } catch (error) {

        console.error(
            "Dashboard error:",
            error
        );

    }

}


// ============================================
// DISPLAY TRIP
// ============================================

function displayTrip(
    activeTrips,
    upcomingTrips,
    allTrips
) {

    const container =
        document.getElementById(
            "activeTripContainer"
        );

    const statusBadge =
        document.getElementById(
            "activeTripStatus"
        );


    if (!container) {
        return;
    }


    // ----------------------------------------
    // SELECT TRIP
    // ----------------------------------------

    let trip = null;
    let tripType = "";


    // First priority: active trip

    if (activeTrips.length > 0) {

        trip = activeTrips[0];

        tripType = "Active";

    }

    // Second priority: upcoming trip

    else if (upcomingTrips.length > 0) {

        trip = upcomingTrips[0];

        tripType = "Upcoming";

    }

    // Third priority: any trip

    else if (allTrips.length > 0) {

        trip = allTrips[0];

        tripType =
            trip.status || "Registered";

    }


    // ----------------------------------------
    // NO TRIPS
    // ----------------------------------------

    if (!trip) {

        if (statusBadge) {
            statusBadge.textContent =
                "No Trip";
        }


        container.innerHTML = `

            <div class="no-trip">

                <div class="no-trip-icon">
                    🧳
                </div>

                <h3>
                    No registered trip
                </h3>

                <p>
                    Register a trip to start your journey.
                </p>

                <a
                    href="register-trip.html"
                    class="primary-link"
                >
                    Register a Trip →
                </a>

            </div>

        `;

        return;
    }


    // ----------------------------------------
    // UPDATE STATUS
    // ----------------------------------------

    if (statusBadge) {

        statusBadge.textContent =
            tripType;

    }


    // ----------------------------------------
    // TRIP DATA
    // ----------------------------------------

    const tripName =
        trip.trip_name ||
        trip.name ||
        "My Trip";


    const source =
        trip.source ||
        trip.source_location ||
        "Not specified";


    const destination =
        trip.destination ||
        "Not specified";


    const transport =
        trip.transport ||
        "Not specified";


    const tripDate =
        trip.trip_date
            ? formatDate(trip.trip_date)
            : "Not specified";


    const arrival =
        trip.arrival_time ||
        trip.expected_arrival ||
        "";


    // ----------------------------------------
    // TRIP CARD
    // ----------------------------------------

    container.innerHTML = `

        <div style="
            padding: 8px 0 25px;
        ">

            <!-- TRIP NAME -->

            <div style="
                display:flex;
                align-items:center;
                justify-content:space-between;
                gap:15px;
                margin-bottom:20px;
            ">

                <div>

                    <div style="
                        color:#2563eb;
                        font-size:11px;
                        font-weight:700;
                        text-transform:uppercase;
                        letter-spacing:1px;
                        margin-bottom:5px;
                    ">
                        ${escapeHTML(tripType)} Trip
                    </div>

                    <h3 style="
                        margin:0;
                        font-size:20px;
                        color:#172033;
                    ">
                        ${escapeHTML(tripName)}
                    </h3>

                </div>

                <div style="
                    width:45px;
                    height:45px;
                    border-radius:12px;
                    background:#eef4ff;
                    display:flex;
                    align-items:center;
                    justify-content:center;
                    font-size:22px;
                ">
                    🧳
                </div>

            </div>


            <!-- ROUTE -->

            <div style="
                display:grid;
                grid-template-columns:1fr 45px 1fr;
                align-items:center;
                gap:10px;
                margin-bottom:22px;
            ">

                <div>

                    <div style="
                        font-size:10px;
                        color:#8b95a5;
                        margin-bottom:5px;
                        text-transform:uppercase;
                    ">
                        From
                    </div>

                    <strong style="
                        font-size:15px;
                        color:#172033;
                    ">
                        ${escapeHTML(source)}
                    </strong>

                </div>


                <div style="
                    text-align:center;
                    font-size:22px;
                ">
                    →
                </div>


                <div>

                    <div style="
                        font-size:10px;
                        color:#8b95a5;
                        margin-bottom:5px;
                        text-transform:uppercase;
                    ">
                        To
                    </div>

                    <strong style="
                        font-size:15px;
                        color:#172033;
                    ">
                        ${escapeHTML(destination)}
                    </strong>

                </div>

            </div>


            <!-- DETAILS -->

            <div style="
                display:grid;
                grid-template-columns:
                    repeat(3, 1fr);
                gap:10px;
                margin-bottom:22px;
            ">

                <div style="
                    padding:12px;
                    background:#f8fafc;
                    border-radius:10px;
                ">

                    <div style="
                        font-size:10px;
                        color:#8b95a5;
                    ">
                        DATE
                    </div>

                    <strong style="
                        display:block;
                        margin-top:5px;
                        font-size:12px;
                        color:#263247;
                    ">
                        📅 ${escapeHTML(tripDate)}
                    </strong>

                </div>


                <div style="
                    padding:12px;
                    background:#f8fafc;
                    border-radius:10px;
                ">

                    <div style="
                        font-size:10px;
                        color:#8b95a5;
                    ">
                        TRANSPORT
                    </div>

                    <strong style="
                        display:block;
                        margin-top:5px;
                        font-size:12px;
                        color:#263247;
                    ">
                        🚗 ${escapeHTML(transport)}
                    </strong>

                </div>


                <div style="
                    padding:12px;
                    background:#f8fafc;
                    border-radius:10px;
                ">

                    <div style="
                        font-size:10px;
                        color:#8b95a5;
                    ">
                        ARRIVAL
                    </div>

                    <strong style="
                        display:block;
                        margin-top:5px;
                        font-size:12px;
                        color:#263247;
                    ">
                        🕐 ${escapeHTML(arrival || "—")}
                    </strong>

                </div>

            </div>


            <!-- BUTTON -->

            ${
                String(trip.status).toLowerCase() === "active"
                ?
                `
                <a
                    href="tracking.html?trip=${trip.id}"
                    style="
                        display:block;
                        width:100%;
                        padding:13px;
                        text-align:center;
                        border-radius:10px;
                        background:#2563eb;
                        color:white;
                        text-decoration:none;
                        font-size:13px;
                        font-weight:700;
                    "
                >
                    📍 Open Live Tracking
                </a>
                `
                :
                `
                <a
                    href="tracking.html?trip=${trip.id}"
                    style="
                        display:block;
                        width:100%;
                        padding:13px;
                        text-align:center;
                        border-radius:10px;
                        background:#2563eb;
                        color:white;
                        text-decoration:none;
                        font-size:13px;
                        font-weight:700;
                    "
                >
                    🚗 Open Trip
                </a>
                `
            }

        </div>

    `;

}


// ============================================
// FORMAT DATE
// ============================================

function formatDate(dateString) {

    try {

        const date =
            new Date(dateString);

        if (isNaN(date.getTime())) {
            return dateString;
        }

        return date.toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );

    } catch {

        return dateString;

    }

}


// ============================================
// ESCAPE HTML
// ============================================

function escapeHTML(value) {

    if (value === null ||
        value === undefined) {

        return "";

    }

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


// ============================================
// LOGOUT
// ============================================

const logoutBtn =
    document.getElementById("logoutBtn");


if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        function () {

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
// START
// ============================================

loadDashboard();