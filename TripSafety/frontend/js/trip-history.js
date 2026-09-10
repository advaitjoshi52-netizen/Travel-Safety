// ============================================
// TRIP SAFETY - TRIP HISTORY
// ============================================

const API_URL =
    "http://localhost:5000/api";


let allTrips = [];

let currentFilter =
    "all";


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


        if (!token) {

            alert(
                "Please login first."
            );


            window.location.href =
                "index.html";


            return;
        }


        setupFilters();

        setupSearch();

        setupLogout();

        loadTripHistory();

    }
);


// ============================================
// HEADERS
// ============================================

function getHeaders() {

    const token =
        localStorage.getItem(
            "tripSafetyToken"
        );


    return {

        "Content-Type":
            "application/json",

        "Authorization":
            `Bearer ${token}`

    };
}


// ============================================
// LOAD TRIPS
// ============================================

async function loadTripHistory() {

    const container =
        document.getElementById(
            "tripsList"
        );


    if (!container) {
        return;
    }


    container.innerHTML = `

        <div class="loading-state">

            <div class="state-icon">
                🔄
            </div>

            <h2>
                Loading trips...
            </h2>

            <p>
                Please wait.
            </p>

        </div>

    `;


    try {

        const response =
            await fetch(
                `${API_URL}/trips`,
                {
                    method: "GET",
                    headers: getHeaders()
                }
            );


        const data =
            await response.json();


        console.log(
            "Trip History API:",
            data
        );


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Unable to load trips"
            );
        }


        // Support multiple response formats

        allTrips =
            Array.isArray(data)
                ? data
                : (
                    data.trips ||
                    data.data ||
                    []
                );


        if (!Array.isArray(allTrips)) {

            allTrips = [];

        }


        console.log(
            "Trips loaded:",
            allTrips
        );


        updateSummary();

        renderTrips();


    } catch (error) {

        console.error(
            "Trip history error:",
            error
        );


        container.innerHTML = `

            <div class="error-state">

                <div class="state-icon">
                    ⚠️
                </div>

                <h2>
                    Unable to load trip history
                </h2>

                <p>
                    ${escapeHTML(
                        error.message
                    )}
                </p>

            </div>

        `;
    }
}


// ============================================
// SUMMARY
// ============================================

function updateSummary() {

    const total =
        allTrips.length;


    const upcoming =
        allTrips.filter(
            trip =>
                normalizeStatus(
                    trip.status
                ) === "upcoming"
        ).length;


    const active =
        allTrips.filter(
            trip =>
                normalizeStatus(
                    trip.status
                ) === "active"
        ).length;


    const completed =
        allTrips.filter(
            trip =>
                normalizeStatus(
                    trip.status
                ) === "completed"
        ).length;


    setText(
        "totalTrips",
        total
    );


    setText(
        "upcomingTrips",
        upcoming
    );


    setText(
        "activeTrips",
        active
    );


    setText(
        "completedTrips",
        completed
    );
}


// ============================================
// FILTERS
// ============================================

function setupFilters() {

    const buttons =
        document.querySelectorAll(
            ".filter-btn"
        );


    buttons.forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    buttons.forEach(
                        btn =>
                            btn.classList.remove(
                                "active"
                            )
                    );


                    button.classList.add(
                        "active"
                    );


                    currentFilter =
                        button.dataset.filter ||
                        "all";


                    renderTrips();
                }
            );
        }
    );
}


// ============================================
// SEARCH
// ============================================

function setupSearch() {

    const search =
        document.getElementById(
            "tripSearch"
        );


    if (!search) {
        return;
    }


    search.addEventListener(
        "input",
        () => {

            renderTrips();

        }
    );
}


// ============================================
// RENDER
// ============================================

function renderTrips() {

    const container =
        document.getElementById(
            "tripsList"
        );


    if (!container) {
        return;
    }


    let trips =
        [...allTrips];


    // ----------------------------------------
    // FILTER
    // ----------------------------------------

    if (
        currentFilter !== "all"
    ) {

        trips =
            trips.filter(
                trip =>
                    normalizeStatus(
                        trip.status
                    ) === currentFilter
            );
    }


    // ----------------------------------------
    // SEARCH
    // ----------------------------------------

    const searchInput =
        document.getElementById(
            "tripSearch"
        );


    const searchTerm =
        searchInput
            ? searchInput.value
                .trim()
                .toLowerCase()
            : "";


    if (searchTerm) {

        trips =
            trips.filter(
                trip => {

                    const text =
                        [
                            trip.trip_name,
                            trip.source,
                            trip.destination,
                            trip.transport,
                            trip.notes,
                            trip.status
                        ]
                        .filter(Boolean)
                        .join(" ")
                        .toLowerCase();


                    return text.includes(
                        searchTerm
                    );
                }
            );
    }


    // ----------------------------------------
    // EMPTY
    // ----------------------------------------

    if (!trips.length) {

        showEmptyState();

        return;
    }


    // ----------------------------------------
    // SORT
    // ----------------------------------------

    trips.sort(
        (a, b) => {

            const dateA =
                new Date(
                    a.trip_date || 0
                ).getTime();


            const dateB =
                new Date(
                    b.trip_date || 0
                ).getTime();


            return dateB - dateA;
        }
    );


    // ----------------------------------------
    // DISPLAY
    // ----------------------------------------

    container.innerHTML =
        trips
            .map(
                trip =>
                    createTripCard(
                        trip
                    )
            )
            .join("");
}


// ============================================
// EMPTY STATE
// ============================================

function showEmptyState() {

    const container =
        document.getElementById(
            "tripsList"
        );


    if (!container) {
        return;
    }


    const message =
        allTrips.length
            ? "No trips match your current filter or search."
            : "You have not registered any trips yet.";


    container.innerHTML = `

        <div class="empty-state">

            <div class="state-icon">
                🚌
            </div>

            <h2>
                ${
                    allTrips.length
                        ? "No Matching Trips"
                        : "No Trips Found"
                }
            </h2>

            <p>
                ${escapeHTML(message)}
            </p>

            ${
                !allTrips.length
                    ? `
                        <a
                            href="register-trip.html"
                            class="register-link"
                        >
                            ➕ Register Your First Trip
                        </a>
                      `
                    : ""
            }

        </div>

    `;
}


// ============================================
// CREATE TRIP CARD
// ============================================

function createTripCard(
    trip
) {

    const status =
        normalizeStatus(
            trip.status
        );


    const statusClass =
        getStatusClass(
            status
        );


    const statusLabel =
        status.toUpperCase();


    const tripName =
        trip.trip_name ||
        trip.name ||
        "Unnamed Trip";


    const source =
        trip.source ||
        trip.source_location ||
        "Starting location";


    const destination =
        trip.destination ||
        "Unknown destination";


    const transport =
        trip.transport ||
        "Not specified";


    const tripDate =
        formatDateOnly(
            trip.trip_date
        );


    const startTime =
        formatTime(
            trip.start_time
        );


    const arrivalTime =
        formatTime(
            trip.arrival_time ||
            trip.expected_arrival
        );


    return `

        <div class="history-card">


            <!-- HEADER -->

            <div class="trip-header">

                <div class="trip-title-area">

                    <div class="trip-icon">
                        ${getTransportIcon(
                            transport
                        )}
                    </div>


                    <div>

                        <h2>
                            ${escapeHTML(
                                tripName
                            )}
                        </h2>


                        <div class="trip-subtitle">
                            Trip ID #${escapeHTML(
                                trip.id
                            )}
                        </div>

                    </div>

                </div>


                <span
                    class="status ${statusClass}"
                >
                    ${statusLabel}
                </span>

            </div>



            <!-- ROUTE -->

            <div class="trip-route">


                <div>

                    <div class="route-label">
                        From
                    </div>

                    <div class="route-value">
                        📍
                        ${escapeHTML(
                            source
                        )}
                    </div>

                </div>


                <div class="route-arrow">
                    →
                </div>


                <div>

                    <div class="route-label">
                        Destination
                    </div>

                    <div class="route-value">
                        🎯
                        ${escapeHTML(
                            destination
                        )}
                    </div>

                </div>


            </div>



            <!-- DETAILS -->

            <div class="trip-details">


                <div class="detail-box">

                    <span class="detail-label">
                        📅 Trip Date
                    </span>

                    <span class="detail-value">
                        ${escapeHTML(
                            tripDate
                        )}
                    </span>

                </div>


                <div class="detail-box">

                    <span class="detail-label">
                        🕐 Start Time
                    </span>

                    <span class="detail-value">
                        ${escapeHTML(
                            startTime
                        )}
                    </span>

                </div>


                <div class="detail-box">

                    <span class="detail-label">
                        🕐 Arrival Time
                    </span>

                    <span class="detail-value">
                        ${escapeHTML(
                            arrivalTime
                        )}
                    </span>

                </div>


                <div class="detail-box">

                    <span class="detail-label">
                        🚗 Transport
                    </span>

                    <span class="detail-value">
                        ${escapeHTML(
                            transport
                        )}
                    </span>

                </div>


            </div>



            <!-- NOTES -->

            ${
                trip.notes
                    ? `

                        <div class="trip-notes">

                            <strong>
                                📝 Notes:
                            </strong>

                            ${escapeHTML(
                                trip.notes
                            )}

                        </div>

                      `
                    : ""
            }



            <!-- ACTIONS -->

            <div class="trip-actions">


                ${
                    status === "active"
                        ? `

                            <a
                                href="tracking.html?trip=${encodeURIComponent(
                                    trip.id
                                )}"
                                class="trip-btn primary-trip-btn"
                            >
                                📍 Open Live Tracking
                            </a>

                          `
                        : ""
                }


                ${
                    status === "upcoming"
                        ? `

                            <a
                                href="tracking.html?trip=${encodeURIComponent(
                                    trip.id
                                )}"
                                class="trip-btn primary-trip-btn"
                            >
                                🚗 Open Trip
                            </a>

                          `
                        : ""
                }


                ${
                    status === "completed"
                        ? `

                            <a
                                href="tracking.html?trip=${encodeURIComponent(
                                    trip.id
                                )}"
                                class="trip-btn secondary-trip-btn"
                            >
                                🗺️ View Trip
                            </a>

                          `
                        : ""
                }


                ${
                    status === "cancelled"
                        ? `
                            <span
                                class="trip-btn secondary-trip-btn"
                                style="cursor:default;"
                            >
                                ❌ Cancelled
                            </span>
                          `
                        : ""
                }

            </div>


        </div>

    `;
}


// ============================================
// STATUS
// ============================================

function normalizeStatus(
    status
) {

    const value =
        String(
            status || "upcoming"
        )
        .trim()
        .toLowerCase();


    if (
        value === "active"
    ) {
        return "active";
    }


    if (
        value === "completed" ||
        value === "complete"
    ) {
        return "completed";
    }


    if (
        value === "cancelled" ||
        value === "canceled"
    ) {
        return "cancelled";
    }


    return "upcoming";
}


function getStatusClass(
    status
) {

    if (
        status === "active"
    ) {
        return "status-active";
    }


    if (
        status === "completed"
    ) {
        return "status-completed";
    }


    if (
        status === "cancelled"
    ) {
        return "status-cancelled";
    }


    return "status-upcoming";
}


// ============================================
// TRANSPORT ICON
// ============================================

function getTransportIcon(
    transport
) {

    const value =
        String(
            transport || ""
        ).toLowerCase();


    if (
        value.includes("bus")
    ) {
        return "🚌";
    }


    if (
        value.includes("train")
    ) {
        return "🚆";
    }


    if (
        value.includes("car")
    ) {
        return "🚗";
    }


    if (
        value.includes("bike") ||
        value.includes("motor")
    ) {
        return "🏍️";
    }


    if (
        value.includes("flight") ||
        value.includes("plane")
    ) {
        return "✈️";
    }


    return "🧳";
}


// ============================================
// DATE
// ============================================

function formatDateOnly(
    value
) {

    if (!value) {
        return "Not specified";
    }


    const date =
        new Date(value);


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return String(value);
    }


    return date.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );
}


// ============================================
// TIME
// ============================================

function formatTime(
    value
) {

    if (!value) {
        return "Not specified";
    }


    const valueString =
        String(value);


    const parts =
        valueString.split(":");


    if (
        parts.length < 2
    ) {

        return valueString;
    }


    let hour =
        parseInt(
            parts[0],
            10
        );


    const minute =
        parts[1];


    if (
        Number.isNaN(hour)
    ) {

        return valueString;
    }


    const period =
        hour >= 12
            ? "PM"
            : "AM";


    hour =
        hour % 12 || 12;


    return `${hour}:${minute} ${period}`;
}


// ============================================
// LOGOUT
// ============================================

function setupLogout() {

    const logoutBtn =
        document.getElementById(
            "logoutBtn"
        );


    if (!logoutBtn) {
        return;
    }


    logoutBtn.addEventListener(
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
// SET TEXT
// ============================================

function setText(
    id,
    value
) {

    const element =
        document.getElementById(
            id
        );


    if (element) {

        element.textContent =
            value;
    }
}


// ============================================
// SECURITY
// ============================================

function escapeHTML(
    value
) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";
    }


    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );
}