// ============================================
// TRIP SAFETY - NOTIFICATIONS
// ============================================

const API_URL =
    "http://localhost:5000/api";


let allNotifications = [];

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

        setupButtons();

        setupLogout();

        loadNotifications();

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
// LOAD NOTIFICATIONS
// ============================================

async function loadNotifications() {

    const container =
        document.getElementById(
            "notificationsList"
        );


    if (!container) {
        return;
    }


    container.innerHTML = `

        <div class="notification-state">

            <div class="state-icon">
                🔄
            </div>

            <h2>
                Loading notifications...
            </h2>

            <p>
                Please wait.
            </p>

        </div>

    `;


    try {

        const response =
            await fetch(
                `${API_URL}/notifications`,
                {
                    method: "GET",
                    headers: getHeaders()
                }
            );


        const data =
            await response.json();


        console.log(
            "Notifications API:",
            data
        );


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Unable to load notifications"
            );
        }


        allNotifications =
            Array.isArray(data)
                ? data
                : (
                    data.notifications ||
                    data.data ||
                    []
                );


        if (!Array.isArray(
            allNotifications
        )) {

            allNotifications = [];

        }


        updateSummary();

        renderNotifications();


    } catch (error) {

        console.error(
            "Notification error:",
            error
        );


        container.innerHTML = `

            <div class="notification-state">

                <div class="state-icon">
                    ⚠️
                </div>

                <h2>
                    Unable to load notifications
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
        allNotifications.length;


    const unread =
        allNotifications.filter(
            notification =>
                !isRead(notification)
        ).length;


    const read =
        total - unread;


    setText(
        "totalNotifications",
        total
    );


    setText(
        "unreadNotifications",
        unread
    );


    setText(
        "readNotifications",
        read
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


                    renderNotifications();

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
            "notificationSearch"
        );


    if (!search) {
        return;
    }


    search.addEventListener(
        "input",
        () => {

            renderNotifications();

        }
    );
}


// ============================================
// BUTTONS
// ============================================

function setupButtons() {

    const refresh =
        document.getElementById(
            "refreshBtn"
        );


    if (refresh) {

        refresh.addEventListener(
            "click",
            async () => {

                refresh.disabled =
                    true;

                refresh.textContent =
                    "🔄 Loading...";


                await loadNotifications();


                refresh.disabled =
                    false;

                refresh.textContent =
                    "🔄 Refresh";

            }
        );
    }


    const markAll =
        document.getElementById(
            "markAllBtn"
        );


    if (markAll) {

        markAll.addEventListener(
            "click",
            markAllAsRead
        );
    }
}


// ============================================
// RENDER
// ============================================

function renderNotifications() {

    const container =
        document.getElementById(
            "notificationsList"
        );


    if (!container) {
        return;
    }


    let notifications =
        [...allNotifications];


    // FILTER

    if (
        currentFilter === "unread"
    ) {

        notifications =
            notifications.filter(
                notification =>
                    !isRead(notification)
            );
    }


    if (
        currentFilter === "read"
    ) {

        notifications =
            notifications.filter(
                notification =>
                    isRead(notification)
            );
    }


    // SEARCH

    const search =
        document.getElementById(
            "notificationSearch"
        );


    const searchTerm =
        search
            ? search.value
                .trim()
                .toLowerCase()
            : "";


    if (searchTerm) {

        notifications =
            notifications.filter(
                notification => {

                    const text =
                        [
                            notification.title,
                            notification.message,
                            notification.type
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


    // EMPTY

    if (!notifications.length) {

        container.innerHTML = `

            <div class="notification-state">

                <div class="state-icon">
                    🔕
                </div>

                <h2>
                    ${
                        allNotifications.length
                            ? "No Matching Notifications"
                            : "No Notifications"
                    }
                </h2>

                <p>
                    ${
                        allNotifications.length
                            ? "Try changing your filter or search."
                            : "You are all caught up."
                    }
                </p>

            </div>

        `;


        return;
    }


    // SORT NEWEST FIRST

    notifications.sort(
        (a, b) => {

            const dateA =
                new Date(
                    a.created_at || 0
                ).getTime();


            const dateB =
                new Date(
                    b.created_at || 0
                ).getTime();


            return dateB - dateA;
        }
    );


    container.innerHTML =
        notifications
            .map(
                notification =>
                    createNotificationCard(
                        notification
                    )
            )
            .join("");
}


// ============================================
// CREATE CARD
// ============================================

function createNotificationCard(
    notification
) {

    const read =
        isRead(
            notification
        );


    const type =
        String(
            notification.type ||
            ""
        ).toLowerCase();


    const iconInfo =
        getNotificationIcon(
            type,
            notification.title
        );


    return `

        <div
            class="notification-card ${
                read
                    ? "read"
                    : "unread"
            }"
        >


            <!-- ICON -->

            <div
                class="notification-icon ${iconInfo.className}"
            >
                ${iconInfo.icon}
            </div>



            <!-- CONTENT -->

            <div class="notification-content">


                <div class="notification-title-row">

                    <span class="notification-title">
                        ${escapeHTML(
                            notification.title ||
                            "TripSafety Notification"
                        )}
                    </span>


                    ${
                        !read
                            ? `
                                <span
                                    class="unread-dot"
                                    title="Unread"
                                ></span>
                              `
                            : ""
                    }

                </div>


                <div class="notification-message">

                    ${escapeHTML(
                        notification.message ||
                        "You have a new TripSafety notification."
                    )}

                </div>


                <div class="notification-time">

                    🕐
                    ${formatDateTime(
                        notification.created_at
                    )}

                </div>


            </div>



            <!-- ACTION -->

            <div class="notification-action">


                ${
                    !read
                        ? `

                            <button
                                class="mark-read-btn"
                                onclick="markNotificationRead(
                                    ${Number(
                                        notification.id
                                    )}
                                )"
                            >
                                ✓ Mark Read
                            </button>

                          `
                        : `

                            <span class="read-label">
                                ✓ Read
                            </span>

                          `
                }

            </div>


        </div>

    `;
}


// ============================================
// MARK ONE READ
// ============================================

async function markNotificationRead(
    id
) {

    try {

        const response =
            await fetch(
                `${API_URL}/notifications/${id}/read`,
                {
                    method: "PUT",
                    headers: getHeaders()
                }
            );


        const data =
            await response.json();


        console.log(
            "Mark read response:",
            data
        );


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Unable to mark notification as read"
            );
        }


        const notification =
            allNotifications.find(
                item =>
                    Number(item.id) ===
                    Number(id)
            );


        if (notification) {

            notification.is_read = 1;

        }


        updateSummary();

        renderNotifications();


    } catch (error) {

        console.error(
            "Mark read error:",
            error
        );


        alert(
            error.message
        );
    }
}


// ============================================
// MARK ALL READ
// ============================================

async function markAllAsRead() {

    const unreadCount =
        allNotifications.filter(
            notification =>
                !isRead(notification)
        ).length;


    if (!unreadCount) {

        alert(
            "All notifications are already read."
        );

        return;
    }


    const confirmed =
        confirm(
            `Mark all ${unreadCount} unread notifications as read?`
        );


    if (!confirmed) {
        return;
    }


    try {

        const response =
            await fetch(
                `${API_URL}/notifications/read-all`,
                {
                    method: "PUT",
                    headers: getHeaders()
                }
            );


        const data =
            await response.json();


        console.log(
            "Mark all response:",
            data
        );


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Unable to mark all notifications as read"
            );
        }


        allNotifications.forEach(
            notification => {

                notification.is_read =
                    1;

            }
        );


        updateSummary();

        renderNotifications();


    } catch (error) {

        console.error(
            "Mark all read error:",
            error
        );


        alert(
            error.message
        );
    }
}


// ============================================
// READ CHECK
// ============================================

function isRead(
    notification
) {

    const value =
        notification.is_read;


    return (
        value === 1 ||
        value === true ||
        value === "1" ||
        value === "true"
    );
}


// ============================================
// ICON
// ============================================

function getNotificationIcon(
    type,
    title
) {

    const text =
        `${type} ${title || ""}`
            .toLowerCase();


    if (
        text.includes("sos") ||
        text.includes("emergency")
    ) {

        return {
            icon: "🚨",
            className: "sos"
        };
    }


    if (
        text.includes("complete") ||
        text.includes("success")
    ) {

        return {
            icon: "✅",
            className: "success"
        };
    }


    if (
        text.includes("warning") ||
        text.includes("alert")
    ) {

        return {
            icon: "⚠️",
            className: "warning"
        };
    }


    if (
        text.includes("trip")
    ) {

        return {
            icon: "🚌",
            className: ""
        };
    }


    return {
        icon: "🔔",
        className: ""
    };
}


// ============================================
// DATE TIME
// ============================================

function formatDateTime(
    value
) {

    if (!value) {

        return "Time unavailable";
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


    return date.toLocaleString(
        "en-IN",
        {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
            hour12: true
        }
    );
}


// ============================================
// LOGOUT
// ============================================

function setupLogout() {

    const logout =
        document.getElementById(
            "logoutBtn"
        );


    if (!logout) {
        return;
    }


    logout.addEventListener(
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