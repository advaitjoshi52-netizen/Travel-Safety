// ============================================
// TRIP SAFETY - API
// ============================================

const API_HOST =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
        ? "localhost"
        : window.location.hostname;

const API_BASE = `http://${API_HOST}:5000/api`;


// ============================================
// TOKEN
// ============================================

function getToken() {
    return localStorage.getItem("tripSafetyToken");
}


function saveToken(token) {
    localStorage.setItem("tripSafetyToken", token);
}


function removeToken() {
    localStorage.removeItem("tripSafetyToken");
}


// ============================================
// API REQUEST
// ============================================

async function apiRequest(endpoint, options = {}) {

    const headers = {
        "Content-Type": "application/json",
        ...(options.headers || {})
    };

    const token = getToken();

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(
        `${API_BASE}${endpoint}`,
        {
            ...options,
            headers
        }
    );

    let data;

    try {
        data = await response.json();
    } catch {
        data = {
            success: false,
            message: "Invalid server response"
        };
    }

    if (!response.ok) {
        throw new Error(
            data.message || "Request failed"
        );
    }

    return data;
}