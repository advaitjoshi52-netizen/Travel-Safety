// ============================================
// TRIP SAFETY - SETTINGS
// ============================================

const API_URL = "http://localhost:5000/api";


// ============================================
// DEFAULT SETTINGS
// ============================================

const defaultSettings = {
    darkMode: false,

    pushNotifications: true,
    smsAlerts: true,
    tripNotifications: true,
    emergencyNotifications: true,

    shakeDetection: false,
    voiceDetection: false,
    automaticTracking: true,

    language: "en"
};


// ============================================
// PAGE LOAD
// ============================================

document.addEventListener("DOMContentLoaded", () => {

    const token =
        localStorage.getItem("tripSafetyToken");


    if (!token) {

        alert("Please login first.");

        window.location.href =
            "index.html";

        return;
    }


    loadProfile();

    loadSettings();

    setupSettingsEvents();

    setupPasswordForm();

    setupLogout();

});


// ============================================
// LOAD PROFILE
// ============================================

async function loadProfile() {

    try {

        const token =
            localStorage.getItem(
                "tripSafetyToken"
            );


        const response =
            await fetch(
                `${API_URL}/auth/me`,
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


        if (!response.ok) {
            throw new Error(
                "Unable to load profile"
            );
        }


        const data =
            await response.json();


        console.log(
            "Profile:",
            data
        );


        const user =
            data.user ||
            data.data ||
            data;


        const name =
            user.name ||
            "User";


        const email =
            user.email ||
            "No email";


        setText(
            "profileName",
            name
        );


        setText(
            "profileEmail",
            email
        );


        const avatar =
            document.getElementById(
                "profileAvatar"
            );


        if (avatar) {

            avatar.textContent =
                name
                    .charAt(0)
                    .toUpperCase();
        }


    } catch (error) {

        console.error(
            "Profile loading error:",
            error
        );


        // Fallback to localStorage

        try {

            const user =
                JSON.parse(
                    localStorage.getItem(
                        "tripSafetyUser"
                    ) || "{}"
                );


            const name =
                user.name ||
                "User";


            const email =
                user.email ||
                "No email";


            setText(
                "profileName",
                name
            );


            setText(
                "profileEmail",
                email
            );


            const avatar =
                document.getElementById(
                    "profileAvatar"
                );


            if (avatar) {

                avatar.textContent =
                    name
                        .charAt(0)
                        .toUpperCase();

            }

        } catch (fallbackError) {

            console.error(
                "Profile fallback error:",
                fallbackError
            );

        }

    }

}


// ============================================
// LOAD SETTINGS
// ============================================

function loadSettings() {

    let saved = null;


    try {

        saved =
            JSON.parse(
                localStorage.getItem(
                    "tripSafetySettings"
                ) || "null"
            );

    } catch (error) {

        console.error(
            "Settings parse error:",
            error
        );

    }


    const settings =
        saved
            ? {
                ...defaultSettings,
                ...saved
            }
            : {
                ...defaultSettings
            };


    // ----------------------------------------
    // DARK MODE
    // ----------------------------------------

    setCheckbox(
        "darkModeToggle",
        settings.darkMode
    );


    // ----------------------------------------
    // NOTIFICATIONS
    // ----------------------------------------

    setCheckbox(
        "pushNotifications",
        settings.pushNotifications
    );


    setCheckbox(
        "smsAlerts",
        settings.smsAlerts
    );


    setCheckbox(
        "tripNotifications",
        settings.tripNotifications
    );


    setCheckbox(
        "emergencyNotifications",
        settings.emergencyNotifications
    );


    // ----------------------------------------
    // SAFETY
    // ----------------------------------------

    setCheckbox(
        "shakeDetection",
        settings.shakeDetection
    );


    setCheckbox(
        "voiceDetection",
        settings.voiceDetection
    );


    setCheckbox(
        "automaticTracking",
        settings.automaticTracking
    );


    // ----------------------------------------
    // LANGUAGE
    // ----------------------------------------

    const language =
        document.getElementById(
            "languageSelect"
        );


    if (language) {

        language.value =
            settings.language;

    }


    // ----------------------------------------
    // APPLY
    // ----------------------------------------

    applyDarkMode(
        settings.darkMode
    );


    applyLanguage(
        settings.language
    );

}


// ============================================
// CHECKBOX
// ============================================

function setCheckbox(
    id,
    value
) {

    const element =
        document.getElementById(id);


    if (element) {

        element.checked =
            Boolean(value);

    }

}


// ============================================
// GET CHECKBOX
// ============================================

function getCheckboxValue(
    id
) {

    const element =
        document.getElementById(id);


    return element
        ? element.checked
        : false;

}


// ============================================
// SAVE SETTINGS
// ============================================

function saveSettings() {

    const language =
        document.getElementById(
            "languageSelect"
        );


    const settings = {

        darkMode:
            getCheckboxValue(
                "darkModeToggle"
            ),

        pushNotifications:
            getCheckboxValue(
                "pushNotifications"
            ),

        smsAlerts:
            getCheckboxValue(
                "smsAlerts"
            ),

        tripNotifications:
            getCheckboxValue(
                "tripNotifications"
            ),

        emergencyNotifications:
            getCheckboxValue(
                "emergencyNotifications"
            ),

        shakeDetection:
            getCheckboxValue(
                "shakeDetection"
            ),

        voiceDetection:
            getCheckboxValue(
                "voiceDetection"
            ),

        automaticTracking:
            getCheckboxValue(
                "automaticTracking"
            ),

        language:
            language
                ? language.value
                : "en"

    };


    localStorage.setItem(
        "tripSafetySettings",
        JSON.stringify(settings)
    );


    console.log(
        "Settings saved:",
        settings
    );


    return settings;

}


// ============================================
// SETTINGS EVENTS
// ============================================

function setupSettingsEvents() {

    // ----------------------------------------
    // DARK MODE
    // ----------------------------------------

    const darkMode =
        document.getElementById(
            "darkModeToggle"
        );


    if (darkMode) {

        darkMode.addEventListener(
            "change",
            () => {

                applyDarkMode(
                    darkMode.checked
                );


                saveSettings();


                showMessage(
                    darkMode.checked
                        ? "Dark mode enabled."
                        : "Dark mode disabled.",
                    "success"
                );

            }
        );

    }


    // ----------------------------------------
    // ALL TOGGLES
    // ----------------------------------------

    const toggleIds = [

        "pushNotifications",

        "smsAlerts",

        "tripNotifications",

        "emergencyNotifications",

        "shakeDetection",

        "voiceDetection",

        "automaticTracking"

    ];


    toggleIds.forEach(
        id => {

            const checkbox =
                document.getElementById(id);


            if (!checkbox) {
                return;
            }


            checkbox.addEventListener(
                "change",
                () => {

                    saveSettings();


                    showMessage(
                        "Settings saved successfully.",
                        "success"
                    );

                }
            );

        }
    );


    // ----------------------------------------
    // LANGUAGE
    // ----------------------------------------

    const language =
        document.getElementById(
            "languageSelect"
        );


    if (language) {

        language.addEventListener(
            "change",
            () => {

                const selectedLanguage =
                    language.value;


                applyLanguage(
                    selectedLanguage
                );


                saveSettings();


                if (
                    selectedLanguage === "mr"
                ) {

                    showMessage(
                        "भाषा मराठीत बदलली.",
                        "success"
                    );

                } else if (
                    selectedLanguage === "hi"
                ) {

                    showMessage(
                        "भाषा हिन्दी में बदल दी गई।",
                        "success"
                    );

                } else {

                    showMessage(
                        "Language changed to English.",
                        "success"
                    );

                }

            }
        );

    }

}


// ============================================
// DARK MODE
// ============================================

function applyDarkMode(
    enabled
) {

    if (enabled) {

        document.body.classList.add(
            "dark-mode"
        );

    } else {

        document.body.classList.remove(
            "dark-mode"
        );

    }

}


// ============================================
// LANGUAGE
// ============================================

function applyLanguage(
    language
) {

    if (language === "mr") {

        translateMarathi();

    } else if (
        language === "hi"
    ) {

        translateHindi();

    } else {

        translateEnglish();

    }

}


// ============================================
// ENGLISH
// ============================================

function translateEnglish() {

    setText(
        "pageTitle",
        "⚙️ Settings"
    );


    setText(
        "pageDescription",
        "Manage your TripSafety preferences and account."
    );

}


// ============================================
// MARATHI
// ============================================

function translateMarathi() {

    setText(
        "pageTitle",
        "⚙️ सेटिंग्ज"
    );


    setText(
        "pageDescription",
        "तुमच्या TripSafety पसंती आणि खात्याचे व्यवस्थापन करा."
    );

}


// ============================================
// HINDI
// ============================================

function translateHindi() {

    setText(
        "pageTitle",
        "⚙️ सेटिंग्स"
    );


    setText(
        "pageDescription",
        "अपनी TripSafety प्राथमिकताओं और खाते को प्रबंधित करें।"
    );

}


// ============================================
// PASSWORD FORM
// ============================================

function setupPasswordForm() {

    const form =
        document.getElementById(
            "passwordForm"
        );


    if (!form) {
        return;
    }


    form.addEventListener(
        "submit",
        async event => {

            event.preventDefault();


            const currentPassword =
                document.getElementById(
                    "currentPassword"
                )?.value
                .trim();


            const newPassword =
                document.getElementById(
                    "newPassword"
                )?.value
                .trim();


            const confirmPassword =
                document.getElementById(
                    "confirmPassword"
                )?.value
                .trim();


            // --------------------------------
            // VALIDATION
            // --------------------------------

            if (!currentPassword) {

                showMessage(
                    "Please enter your current password.",
                    "error"
                );

                return;
            }


            if (!newPassword) {

                showMessage(
                    "Please enter a new password.",
                    "error"
                );

                return;
            }


            if (
                newPassword.length < 6
            ) {

                showMessage(
                    "New password must contain at least 6 characters.",
                    "error"
                );

                return;
            }


            if (
                newPassword !==
                confirmPassword
            ) {

                showMessage(
                    "New password and confirm password do not match.",
                    "error"
                );

                return;
            }


            if (
                currentPassword ===
                newPassword
            ) {

                showMessage(
                    "New password must be different from current password.",
                    "error"
                );

                return;
            }


            const button =
                document.getElementById(
                    "changePasswordBtn"
                );


            if (button) {

                button.disabled =
                    true;

                button.textContent =
                    "Changing Password...";

            }


            try {

                const token =
                    localStorage.getItem(
                        "tripSafetyToken"
                    );


                if (!token) {

                    throw new Error(
                        "Your session has expired. Please login again."
                    );

                }


                const response =
                    await fetch(
                        `${API_URL}/auth/change-password`,
                        {
                            method: "PUT",

                            headers: {

                                "Content-Type":
                                    "application/json",

                                "Authorization":
                                    `Bearer ${token}`

                            },

                            body:
                                JSON.stringify({

                                    currentPassword:
                                        currentPassword,

                                    newPassword:
                                        newPassword

                                })

                        }
                    );


                const data =
                    await response.json();


                console.log(
                    "Password API:",
                    data
                );


                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        "Password change failed."
                    );

                }


                showMessage(
                    "Password changed successfully.",
                    "success"
                );


                form.reset();


            } catch (error) {

                console.error(
                    "Password change error:",
                    error
                );


                showMessage(
                    error.message,
                    "error"
                );

            } finally {

                if (button) {

                    button.disabled =
                        false;

                    button.textContent =
                        "🔑 Change Password";

                }

            }

        }
    );

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


            localStorage.removeItem(
                "tripSafetySettings"
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
            "settingsMessage"
        );


    if (!element) {
        return;
    }


    element.textContent =
        message;


    element.style.display =
        "block";


    element.style.padding =
        "10px 12px";


    element.style.borderRadius =
        "8px";


    element.style.marginTop =
        "5px";


    if (type === "success") {

        element.style.background =
            "#dcfce7";

        element.style.color =
            "#166534";

    } else {

        element.style.background =
            "#fee2e2";

        element.style.color =
            "#991b1b";

    }


    clearTimeout(
        window.settingsMessageTimer
    );


    window.settingsMessageTimer =
        setTimeout(
            () => {

                element.style.display =
                    "none";

            },
            4000
        );

}


// ============================================
// TEXT HELPER
// ============================================

function setText(
    id,
    text
) {

    const element =
        document.getElementById(
            id
        );


    if (element) {

        element.textContent =
            text;

    }

}