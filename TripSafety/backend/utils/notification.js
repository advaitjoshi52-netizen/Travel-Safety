// ============================================
// TRIP SAFETY - NOTIFICATION UTILITY
// ============================================

// No Twilio.
// SMS is opened through the user's mobile
// Messages/SMS application.

// ============================================
// NORMALIZE PHONE NUMBER
// ============================================

function normalizePhone(phone) {
    if (!phone) {
        return "";
    }

    let number = String(phone)
        .trim()
        .replace(/\D/g, "");

    // Indian 10-digit number
    // 9209681853 -> +919209681853
    if (number.length === 10) {
        number = "91" + number;
    }

    // Indian number already containing 91
    if (number.length === 12 && number.startsWith("91")) {
        return "+" + number;
    }

    // Other international number
    if (number.length > 10) {
        return "+" + number;
    }

    return "+" + number;
}


// ============================================
// CREATE SOS SMS MESSAGE
// ============================================

function createSOSMessage({
    userName,
    latitude,
    longitude
}) {

    const locationUrl =
        `https://www.google.com/maps?q=${latitude},${longitude}`;

    return (
        `🚨 TripSafety SOS ALERT!\n\n` +
        `${userName} has activated an emergency SOS alert.\n\n` +
        `📍 Current Location:\n` +
        `${locationUrl}\n\n` +
        `Latitude: ${latitude}\n` +
        `Longitude: ${longitude}\n\n` +
        `Please contact them immediately.`
    );
}


// ============================================
// CREATE SMS LINK
// ============================================

function createSMSLink(phone, message) {

    const cleanPhone = normalizePhone(phone);

    return (
        `sms:${cleanPhone}?body=` +
        encodeURIComponent(message)
    );
}


// ============================================
// EXPORT
// ============================================

module.exports = {
    normalizePhone,
    createSOSMessage,
    createSMSLink
};