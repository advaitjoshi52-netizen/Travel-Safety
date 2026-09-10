// ============================================
// TRIP SAFETY - LIVE TRACKING
// ============================================

// ============================================
// API
// ============================================

const API_HOST =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
        ? "localhost"
        : window.location.hostname;

const API_URL = `http://${API_HOST}:5000/api`;

console.log("TripSafety API:", API_URL);


// ============================================
// GLOBAL VARIABLES
// ============================================

let map = null;

let userMarker = null;
let destinationMarker = null;
let routeLine = null;

let watchId = null;

let currentTripId = null;

let destinationLat = null;
let destinationLng = null;

let gpsStarted = false;
let tripStarted = false;

let lastRouteUpdate = 0;

let lastLatitude = null;
let lastLongitude = null;
let lastAccuracy = null;


// ============================================
// PAGE LOAD
// ============================================

document.addEventListener("DOMContentLoaded", () => {

    const token =
        localStorage.getItem("tripSafetyToken");

    if (!token) {

        alert("Please login first.");

        window.location.href = "index.html";

        return;
    }

    initializeMap();

    setupButtons();

    loadTrip();
});


// ============================================
// MAP
// ============================================

function initializeMap() {

    const mapElement =
        document.getElementById("map");

    if (!mapElement) {

        console.error(
            "Map element not found."
        );

        return;
    }

    if (typeof L === "undefined") {

        console.error(
            "Leaflet is not loaded."
        );

        return;
    }

    map = L.map("map").setView(
        [20.5937, 78.9629],
        5
    );

    L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            maxZoom: 19,
            attribution:
                "&copy; OpenStreetMap contributors"
        }
    ).addTo(map);
}


// ============================================
// LOAD TRIP
// ============================================

async function loadTrip() {

    const token =
        localStorage.getItem("tripSafetyToken");

    if (!token) {

        window.location.href =
            "index.html";

        return;
    }

    try {

        updateGPSStatus(
            "Loading trip..."
        );

        const response =
            await fetch(
                `${API_URL}/trips`,
                {
                    method: "GET",

                    headers: {
                        "Content-Type":
                            "application/json",

                        "Authorization":
                            `Bearer ${token}`
                    }
                }
            );

        const data =
            await response.json();

        console.log(
            "Trips API:",
            data
        );

        if (!response.ok) {

            throw new Error(
                data.message ||
                "Unable to load trips."
            );
        }


        // ========================================
        // HANDLE DIFFERENT API RESPONSE FORMATS
        // ========================================

        const trips =
            Array.isArray(data)
                ? data
                : Array.isArray(data.trips)
                    ? data.trips
                    : Array.isArray(data.data)
                        ? data.data
                        : [];


        // ========================================
        // GET TRIP ID FROM URL
        // ========================================

        const params =
            new URLSearchParams(
                window.location.search
            );

        const requestedTrip =
            params.get("trip");


        let trip = null;


        // ========================================
        // FIND REQUESTED TRIP
        // ========================================

        if (requestedTrip) {

            trip =
                trips.find(
                    item =>
                        String(item.id) ===
                        String(requestedTrip)
                );
        }


        // ========================================
        // FALLBACK ACTIVE TRIP
        // ========================================

        if (!trip) {

            trip =
                trips.find(
                    item =>
                        String(item.status)
                            .toLowerCase() ===
                        "active"
                );
        }


        // ========================================
        // FALLBACK UPCOMING TRIP
        // ========================================

        if (!trip) {

            trip =
                trips.find(
                    item =>
                        String(item.status)
                            .toLowerCase() ===
                        "upcoming"
                );
        }


        // ========================================
        // NO TRIP
        // ========================================

        if (!trip) {

            setText(
                "tripName",
                "No trip found"
            );

            setText(
                "tripRoute",
                "Please register a trip first."
            );

            setText(
                "destination",
                "Unknown"
            );

            setTripStatus(
                "NO TRIP"
            );

            updateGPSStatus(
                "No trip found."
            );

            return;
        }


        // ========================================
        // SAVE CURRENT TRIP
        // ========================================

        currentTripId =
            trip.id;

        console.log(
            "Trip loaded:",
            trip
        );


        // ========================================
        // STATUS
        // ========================================

        const status =
            String(
                trip.status || "upcoming"
            ).toLowerCase();

        tripStarted =
            status === "active";


        // ========================================
        // DISPLAY TRIP
        // ========================================

        setText(
            "tripName",
            trip.trip_name ||
            trip.name ||
            "Trip"
        );


        const source =
            trip.source ||
            trip.source_location ||
            "Starting location";


        const destination =
            trip.destination ||
            "Unknown";


        setText(
            "tripRoute",
            `${source} → ${destination}`
        );


        setText(
            "destination",
            destination
        );


        setTripStatus(
            status.toUpperCase()
        );


        // ========================================
        // FIND DESTINATION
        // ========================================

        await findDestination(
            destination
        );


        // ========================================
        // ACTIVE TRIP
        // ========================================

        if (tripStarted) {

            updateGPSStatus(
                "Trip active. Starting GPS..."
            );

            setTrackingStatus(
                "● GPS Connecting...",
                "#fef3c7",
                "#b45309"
            );

            startGPS();

        } else {

            updateGPSStatus(
                "Trip is upcoming. Click Start GPS Tracking."
            );

            setTrackingStatus(
                "● GPS Ready",
                "#dbeafe",
                "#2563eb"
            );
        }

    } catch (error) {

        console.error(
            "TRIP LOADING ERROR:",
            error
        );

        updateGPSStatus(
            `Trip loading failed: ${error.message}`
        );

        setTripStatus(
            "ERROR"
        );
    }
}


// ============================================
// FIND DESTINATION
// ============================================

async function findDestination(
    destination
) {

    if (!destination) {
        return;
    }

    try {

        const searchQuery =
            `${destination}, Maharashtra, India`;

        const url =
            "https://nominatim.openstreetmap.org/search" +
            "?format=json" +
            "&limit=1" +
            "&countrycodes=in" +
            "&q=" +
            encodeURIComponent(
                searchQuery
            );


        const response =
            await fetch(url);


        if (!response.ok) {

            throw new Error(
                "Destination search failed."
            );
        }


        const results =
            await response.json();


        if (
            !results ||
            results.length === 0
        ) {

            console.warn(
                "Destination not found:",
                searchQuery
            );

            return;
        }


        destinationLat =
            parseFloat(
                results[0].lat
            );

        destinationLng =
            parseFloat(
                results[0].lon
            );


        console.log(
            "Destination coordinates:",
            destinationLat,
            destinationLng
        );


        if (destinationMarker) {

            map.removeLayer(
                destinationMarker
            );
        }


        destinationMarker =
            L.marker([
                destinationLat,
                destinationLng
            ])
            .addTo(map)
            .bindPopup(
                `<b>🎯 Destination</b><br>${escapeHTML(destination)}`
            );


    } catch (error) {

        console.error(
            "DESTINATION ERROR:",
            error
        );
    }
}


// ============================================
// START TRIP
// ============================================

async function startTrip() {

    if (!currentTripId) {

        alert(
            "No trip selected."
        );

        return;
    }


    const token =
        localStorage.getItem(
            "tripSafetyToken"
        );


    if (!token) {

        alert(
            "Please login again."
        );

        return;
    }


    if (tripStarted) {

        startGPS();

        return;
    }


    try {

        setTrackingStatus(
            "● Starting Trip...",
            "#fef3c7",
            "#b45309"
        );


        updateGPSStatus(
            "Starting trip..."
        );


        const response =
            await fetch(
                `${API_URL}/trips/${currentTripId}/start`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json",

                        "Authorization":
                            `Bearer ${token}`
                    }
                }
            );


        const data =
            await response.json();


        console.log(
            "START TRIP RESPONSE:",
            data
        );


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Unable to start trip."
            );
        }


        tripStarted = true;


        setTripStatus(
            "ACTIVE"
        );


        updateGPSStatus(
            "Trip active. Requesting GPS..."
        );


        setTrackingStatus(
            "● GPS Connecting...",
            "#fef3c7",
            "#b45309"
        );


        startGPS();


        const startButton =
            document.getElementById(
                "startTrackingBtn"
            );


        if (startButton) {

            startButton.textContent =
                "📍 GPS Tracking Active";

            startButton.disabled =
                true;
        }


    } catch (error) {

        console.error(
            "START TRIP ERROR:",
            error
        );


        updateGPSStatus(
            "Unable to start trip."
        );


        setTrackingStatus(
            "● Start Failed",
            "#fee2e2",
            "#dc2626"
        );


        alert(
            error.message
        );
    }
}


// ============================================
// START GPS
// ============================================

function startGPS() {

    if (gpsStarted) {
        return;
    }


    if (!navigator.geolocation) {

        updateGPSStatus(
            "Geolocation is not supported by this browser."
        );

        return;
    }


    gpsStarted = true;


    updateGPSStatus(
        "Requesting GPS location..."
    );


    setTrackingStatus(
        "● GPS Connecting...",
        "#fef3c7",
        "#b45309"
    );


    console.log(
        "Starting real GPS..."
    );


    navigator.geolocation.getCurrentPosition(

        position => {

            console.log(
                "FIRST GPS FIX:",
                position.coords.latitude,
                position.coords.longitude,
                position.coords.accuracy
            );


            handleGPSPosition(
                position
            );


            startWatchingGPS();
        },


        error => {

            handleGPSError(
                error
            );
        },


        {
            enableHighAccuracy: true,
            timeout: 60000,
            maximumAge: 0
        }
    );
}


// ============================================
// CONTINUOUS GPS
// ============================================

function startWatchingGPS() {

    if (watchId !== null) {
        return;
    }


    watchId =
        navigator.geolocation.watchPosition(

            position => {

                console.log(
                    "GPS UPDATE:",
                    position.coords.latitude,
                    position.coords.longitude,
                    position.coords.accuracy
                );


                handleGPSPosition(
                    position
                );
            },


            error => {

                handleGPSError(
                    error
                );
            },


            {
                enableHighAccuracy: true,
                timeout: 60000,
                maximumAge: 5000
            }
        );
}


// ============================================
// HANDLE GPS POSITION
// ============================================

function handleGPSPosition(
    position
) {

    const latitude =
        position.coords.latitude;

    const longitude =
        position.coords.longitude;

    const accuracy =
        position.coords.accuracy;


    lastLatitude =
        latitude;

    lastLongitude =
        longitude;

    lastAccuracy =
        accuracy;


    updateLocation(
        latitude,
        longitude,
        accuracy
    );


    sendLocation(
        latitude,
        longitude,
        accuracy
    );
}


// ============================================
// GPS ERROR
// ============================================

function handleGPSError(
    error
) {

    console.error(
        "GPS ERROR:",
        error.code,
        error.message
    );


    if (error.code === 1) {

        updateGPSStatus(
            "Location permission denied."
        );

    } else if (error.code === 2) {

        updateGPSStatus(
            "Location unavailable."
        );

    } else if (error.code === 3) {

        updateGPSStatus(
            "GPS timeout. Trying again..."
        );

    } else {

        updateGPSStatus(
            "Unable to get GPS location."
        );
    }


    gpsStarted = false;


    setTrackingStatus(
        "● GPS Error",
        "#fee2e2",
        "#dc2626"
    );
}


// ============================================
// UPDATE LOCATION
// ============================================

function updateLocation(
    latitude,
    longitude,
    accuracy
) {

    setText(
        "currentLatitude",
        latitude.toFixed(6)
    );


    setText(
        "currentLongitude",
        longitude.toFixed(6)
    );


    setText(
        "gpsAccuracy",
        Math.round(accuracy) + " m"
    );


    updateGPSStatus(
        "GPS connected ✓"
    );


    setTrackingStatus(
        "● GPS Connected",
        "#dcfce7",
        "#16a34a"
    );


    // ========================================
    // USER MARKER
    // ========================================

    if (!userMarker) {

        userMarker =
            L.marker([
                latitude,
                longitude
            ])
            .addTo(map)
            .bindPopup(
                "📍 Your Current Location"
            );

    } else {

        userMarker.setLatLng([
            latitude,
            longitude
        ]);
    }


    // ========================================
    // MAP VIEW
    // ========================================

    map.setView(
        [
            latitude,
            longitude
        ],
        15
    );


    // ========================================
    // DISTANCE
    // ========================================

    if (
        destinationLat !== null &&
        destinationLng !== null
    ) {

        const distance =
            calculateDistance(
                latitude,
                longitude,
                destinationLat,
                destinationLng
            );


        setText(
            "distance",
            formatDistance(distance)
        );


        calculateETA(
            distance
        );


        const now =
            Date.now();


        if (
            now - lastRouteUpdate >
            15000
        ) {

            lastRouteUpdate =
                now;

            drawRoute(
                latitude,
                longitude
            );
        }
    }
}


// ============================================
// DISTANCE CALCULATION
// ============================================

function calculateDistance(
    lat1,
    lon1,
    lat2,
    lon2
) {

    const R = 6371;


    const dLat =
        degreesToRadians(
            lat2 - lat1
        );


    const dLon =
        degreesToRadians(
            lon2 - lon1
        );


    const a =
        Math.sin(dLat / 2) *
        Math.sin(dLat / 2) +
        Math.cos(
            degreesToRadians(lat1)
        ) *
        Math.cos(
            degreesToRadians(lat2)
        ) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);


    const c =
        2 *
        Math.atan2(
            Math.sqrt(a),
            Math.sqrt(1 - a)
        );


    return R * c;
}


// ============================================
// RADIANS
// ============================================

function degreesToRadians(
    degrees
) {

    return (
        degrees *
        Math.PI /
        180
    );
}


// ============================================
// FORMAT DISTANCE
// ============================================

function formatDistance(
    distance
) {

    if (distance < 1) {

        return (
            Math.round(
                distance * 1000
            ) +
            " m"
        );
    }


    return (
        distance.toFixed(2) +
        " km"
    );
}


// ============================================
// ETA
// ============================================

function calculateETA(
    distance
) {

    // Average estimated driving speed
    const speed = 40;


    const minutes =
        Math.round(
            (distance / speed) * 60
        );


    const eta =
        document.getElementById(
            "eta"
        );


    if (!eta) {
        return;
    }


    if (minutes < 60) {

        eta.textContent =
            minutes + " min";

    } else {

        const hours =
            Math.floor(
                minutes / 60
            );

        const remainingMinutes =
            minutes % 60;


        eta.textContent =
            `${hours}h ${remainingMinutes}min`;
    }
}


// ============================================
// DRAW DRIVING ROUTE
// ============================================

async function drawRoute(
    latitude,
    longitude
) {

    if (
        destinationLat === null ||
        destinationLng === null
    ) {

        return;
    }


    try {

        const start =
            `${longitude},${latitude}`;


        const destination =
            `${destinationLng},${destinationLat}`;


        const url =
            `https://router.project-osrm.org/route/v1/driving/` +
            `${start};${destination}` +
            `?overview=full` +
            `&geometries=geojson` +
            `&steps=true`;


        console.log(
            "ROUTE REQUEST:",
            url
        );


        const response =
            await fetch(url);


        if (!response.ok) {

            throw new Error(
                "Route service unavailable."
            );
        }


        const data =
            await response.json();


        if (
            data.code !== "Ok" ||
            !data.routes ||
            data.routes.length === 0
        ) {

            console.warn(
                "No driving route found."
            );

            return;
        }


        const route =
            data.routes[0];


        const coordinates =
            route.geometry.coordinates.map(
                point => [
                    point[1],
                    point[0]
                ]
            );


        if (
            coordinates.length < 2
        ) {

            return;
        }


        // ========================================
        // REMOVE OLD ROUTE
        // ========================================

        if (routeLine) {

            map.removeLayer(
                routeLine
            );

            routeLine = null;
        }


        // ========================================
        // DRAW ROUTE
        // ========================================

        routeLine =
            L.polyline(
                coordinates,
                {
                    color: "#2563eb",
                    weight: 6,
                    opacity: 0.9,
                    lineCap: "round",
                    lineJoin: "round"
                }
            ).addTo(map);


        // ========================================
        // ROAD DISTANCE
        // ========================================

        if (
            typeof route.distance ===
            "number"
        ) {

            const routeDistance =
                route.distance / 1000;


            setText(
                "distance",
                formatDistance(
                    routeDistance
                )
            );
        }


        // ========================================
        // ROAD ETA
        // ========================================

        if (
            typeof route.duration ===
            "number"
        ) {

            const routeMinutes =
                Math.round(
                    route.duration / 60
                );


            const eta =
                document.getElementById(
                    "eta"
                );


            if (eta) {

                if (
                    routeMinutes < 60
                ) {

                    eta.textContent =
                        `${routeMinutes} min`;

                } else {

                    const hours =
                        Math.floor(
                            routeMinutes / 60
                        );

                    const minutes =
                        routeMinutes % 60;


                    eta.textContent =
                        `${hours}h ${minutes}min`;
                }
            }
        }


        // ========================================
        // FIT MAP TO ROUTE
        // ========================================

        const routeBounds =
            L.latLngBounds(
                coordinates
            );


        routeBounds.extend([
            latitude,
            longitude
        ]);


        routeBounds.extend([
            destinationLat,
            destinationLng
        ]);


        map.fitBounds(
            routeBounds,
            {
                padding: [
                    50,
                    50
                ],
                maxZoom: 14
            }
        );


    } catch (error) {

        console.error(
            "ROUTE ERROR:",
            error
        );
    }
}


// ============================================
// SEND LOCATION TO DATABASE
// ============================================

async function sendLocation(
    latitude,
    longitude,
    accuracy
) {

    if (!currentTripId) {
        return;
    }


    const token =
        localStorage.getItem(
            "tripSafetyToken"
        );


    if (!token) {
        return;
    }


    try {

        const response =
            await fetch(
                `${API_URL}/tracking/${currentTripId}/location`,
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
                            latitude,
                            longitude,
                            accuracy
                        })
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            console.error(
                "Location save failed:",
                data
            );

            return;
        }


        console.log(
            "Location saved:",
            data
        );


    } catch (error) {

        console.error(
            "Location upload error:",
            error
        );
    }
}


// ============================================
// STOP GPS
// ============================================

function stopGPS() {

    if (watchId !== null) {

        navigator.geolocation.clearWatch(
            watchId
        );

        watchId = null;
    }


    gpsStarted = false;


    updateGPSStatus(
        "GPS tracking stopped."
    );


    setTrackingStatus(
        "● GPS Stopped",
        "#fee2e2",
        "#dc2626"
    );


    const startButton =
        document.getElementById(
            "startTrackingBtn"
        );


    if (startButton) {

        startButton.disabled =
            false;

        startButton.textContent =
            "📍 Start GPS Tracking";
    }
}


// ============================================
// BUTTONS
// ============================================

function setupButtons() {

    // ========================================
    // START
    // ========================================

    const startButton =
        document.getElementById(
            "startTrackingBtn"
        );


    if (startButton) {

        startButton.addEventListener(
            "click",
            startTrip
        );
    }


    // ========================================
    // STOP
    // ========================================

    const stopButton =
        document.getElementById(
            "stopTrackingBtn"
        );


    if (stopButton) {

        stopButton.addEventListener(
            "click",
            stopGPS
        );
    }


    // ========================================
    // COMPLETE
    // ========================================

    const completeButton =
        document.getElementById(
            "completeTripBtn"
        );


    if (completeButton) {

        completeButton.addEventListener(
            "click",
            completeTrip
        );
    }


    // ========================================
    // LOGOUT
    // ========================================

    const logoutButton =
        document.getElementById(
            "logoutBtn"
        );


    if (logoutButton) {

        logoutButton.addEventListener(
            "click",
            () => {

                stopGPS();

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


    // ========================================
    // SOS
    // ========================================

    const sosButton =
        document.getElementById(
            "sosBtn"
        );


    if (sosButton) {

        sosButton.addEventListener(
            "click",
            activateSOS
        );
    }
}


// ============================================
// SOS
// ============================================

async function activateSOS() {

    // ========================================
    // CHECK TRIP
    // ========================================

    if (!currentTripId) {

        alert(
            "Please select a trip first."
        );

        return;
    }


    // ========================================
    // CHECK GPS
    // ========================================

    if (
        lastLatitude === null ||
        lastLongitude === null
    ) {

        alert(
            "SOS cannot start yet.\n\n" +
            "Please wait until GPS Connected appears."
        );

        return;
    }


    // ========================================
    // CONFIRM
    // ========================================

    const confirmed =
        confirm(
            "🚨 EMERGENCY SOS\n\n" +
            "Your latest GPS location will be saved " +
            "and an emergency alert will be created.\n\n" +
            "Do you want to continue?"
        );


    if (!confirmed) {
        return;
    }


    const token =
        localStorage.getItem(
            "tripSafetyToken"
        );


    if (!token) {

        alert(
            "Please login again."
        );

        return;
    }


    const latitude =
        lastLatitude;

    const longitude =
        lastLongitude;

    const accuracy =
        lastAccuracy;


    const sosButton =
        document.getElementById(
            "sosBtn"
        );


    if (sosButton) {

        sosButton.disabled =
            true;

        sosButton.textContent =
            "🚨 Activating SOS...";
    }


    updateGPSStatus(
        "🚨 Sending SOS alert..."
    );


    try {

        const response =
            await fetch(
                `${API_URL}/sos`,
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

                            trip_id:
                                Number(
                                    currentTripId
                                ),

                            latitude:
                                latitude,

                            longitude:
                                longitude,

                            accuracy:
                                accuracy,

                            message:
                                "Emergency SOS activated from Live Tracking"
                        })
                }
            );


        const data =
            await response.json();


        console.log(
            "SOS RESPONSE:",
            data
        );


        if (
            !response.ok ||
            !data.success
        ) {

            throw new Error(
                data.message ||
                "SOS activation failed."
            );
        }


        // ========================================
        // UPDATE UI
        // ========================================

        updateGPSStatus(
            "🚨 SOS ACTIVE"
        );


        setTrackingStatus(
            "🚨 SOS ACTIVE",
            "#fee2e2",
            "#dc2626"
        );


        // ========================================
        // SMS CONTACTS
        // ========================================

        const smsContacts =
            Array.isArray(
                data.smsContacts
            )
                ? data.smsContacts
                : [];


        // ========================================
        // NO CONTACTS
        // ========================================

        if (
            smsContacts.length === 0
        ) {

            alert(
                "🚨 SOS ACTIVATED!\n\n" +
                "Emergency location saved successfully.\n\n" +
                "No emergency contacts found."
            );

            return;
        }


        // ========================================
        // FIRST CONTACT
        // ========================================

        const contact =
            smsContacts[0];


        if (
            !contact ||
            !contact.smsLink
        ) {

            alert(
                "🚨 SOS ACTIVATED!\n\n" +
                "Emergency location saved successfully.\n\n" +
                "SMS link could not be created."
            );

            return;
        }


        // ========================================
        // OPEN SMS
        // ========================================

        const openSMS =
            confirm(
                "🚨 SOS ACTIVATED!\n\n" +
                "Emergency location saved successfully.\n\n" +
                "Emergency contact:\n" +
                `${contact.name}\n` +
                `${contact.phone}\n\n` +
                "Open Messages and send the emergency message?"
            );


        if (openSMS) {

            console.log(
                "Opening SMS:",
                contact.smsLink
            );

            // Use location.href.
            // This allows the phone to open
            // the native SMS application.

            window.location.href =
                contact.smsLink;
        }


    } catch (error) {

        console.error(
            "SOS ERROR:",
            error
        );


        updateGPSStatus(
            "❌ SOS activation failed"
        );


        alert(
            "SOS activation failed.\n\n" +
            error.message
        );


    } finally {

        if (sosButton) {

            sosButton.disabled =
                false;

            sosButton.textContent =
                "🆘 SOS EMERGENCY";
        }
    }
}


// ============================================
// COMPLETE TRIP
// ============================================

async function completeTrip() {

    if (!currentTripId) {

        alert(
            "No trip selected."
        );

        return;
    }


    const confirmed =
        confirm(
            "Mark this trip as completed?"
        );


    if (!confirmed) {
        return;
    }


    const token =
        localStorage.getItem(
            "tripSafetyToken"
        );


    if (!token) {

        alert(
            "Please login again."
        );

        return;
    }


    try {

        const response =
            await fetch(
                `${API_URL}/trips/${currentTripId}/complete`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json",

                        "Authorization":
                            `Bearer ${token}`
                    }
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Unable to complete trip."
            );
        }


        stopGPS();


        setTripStatus(
            "COMPLETED"
        );


        alert(
            "✅ Trip completed successfully!"
        );


        window.location.href =
            "dashboard.html";


    } catch (error) {

        console.error(
            "Complete trip error:",
            error
        );


        alert(
            error.message
        );
    }
}


// ============================================
// TRIP STATUS
// ============================================

function setTripStatus(
    status
) {

    const element =
        document.getElementById(
            "tripStatus"
        );


    if (!element) {
        return;
    }


    element.textContent =
        status;


    const normalized =
        String(status)
            .toLowerCase();


    if (
        normalized === "upcoming"
    ) {

        element.style.background =
            "#dcfce7";

        element.style.color =
            "#15803d";

    } else if (
        normalized === "active"
    ) {

        element.style.background =
            "#dbeafe";

        element.style.color =
            "#2563eb";

    } else if (
        normalized === "completed"
    ) {

        element.style.background =
            "#f1f5f9";

        element.style.color =
            "#64748b";

    } else if (
        normalized === "no trip" ||
        normalized === "error"
    ) {

        element.style.background =
            "#fee2e2";

        element.style.color =
            "#dc2626";

    } else {

        element.style.background =
            "#f1f5f9";

        element.style.color =
            "#64748b";
    }
}


// ============================================
// SET TEXT
// ============================================

function setText(
    id,
    value
) {

    const element =
        document.getElementById(id);


    if (element) {

        element.textContent =
            value;
    }
}


// ============================================
// GPS STATUS
// ============================================

function updateGPSStatus(
    message
) {

    const element =
        document.getElementById(
            "gpsStatus"
        );


    if (element) {

        element.textContent =
            message;
    }
}


// ============================================
// TOP STATUS
// ============================================

function setTrackingStatus(
    text,
    background,
    color
) {

    const element =
        document.getElementById(
            "trackingStatus"
        );


    if (!element) {
        return;
    }


    element.textContent =
        text;


    element.style.background =
        background;


    element.style.color =
        color;
}


// ============================================
// ESCAPE HTML
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