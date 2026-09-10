# 🛡️ TripSafety

# Real-Time Travel Safety and Emergency Tracking System

TripSafety is a full-stack web application designed to improve traveler safety by providing trip registration, real-time GPS tracking, route monitoring, emergency contacts, notifications, and an SOS emergency alert system.

The application allows users to register their journey, track their current location, view distance and ETA to their destination, manage trusted emergency contacts, and activate an SOS alert during an emergency.

---

## 📌 Table of Contents

- [Project Overview](#-project-overview)
- [Problem Statement](#-problem-statement)
- [Objectives](#-objectives)
- [Features](#-features)
- [Technology Stack](#-technology-stack)
- [System Architecture](#-system-architecture)
- [Project Structure](#-project-structure)
- [Database Design](#-database-design)
- [Application Modules](#-application-modules)
- [Authentication System](#-authentication-system)
- [Trip Management](#-trip-management)
- [GPS Tracking](#-gps-tracking)
- [Map and Route System](#-map-and-route-system)
- [SOS Emergency System](#-sos-emergency-system)
- [Emergency Contacts](#-emergency-contacts)
- [Notifications](#-notifications)
- [Password Reset](#-password-reset)
- [API Documentation](#-api-documentation)
- [Installation](#-installation)
- [MySQL Setup](#-mysql-setup)
- [Environment Variables](#-environment-variables)
- [Running the Backend](#-running-the-backend)
- [Running the Frontend](#-running-the-frontend)
- [Mobile Testing](#-mobile-testing)
- [Testing](#-testing)
- [Security](#-security)
- [Limitations](#-limitations)
- [Future Enhancements](#-future-enhancements)
- [Project Status](#-project-status)
- [Academic Information](#-academic-information)
- [License](#-license)

---

# 📖 Project Overview

Traveling alone or without a proper safety system can create problems during emergencies.

A traveler may experience:

- Getting lost
- Unexpected delays
- Vehicle breakdown
- Accidents
- Medical emergencies
- Unsafe situations
- Communication problems

TripSafety provides a centralized web-based safety system to help users monitor their journey and quickly access emergency functionality.

The system combines:

```text
User Authentication
        +
Trip Registration
        +
Real-Time GPS Tracking
        +
Interactive Maps
        +
Route Calculation
        +
Emergency Contacts
        +
Notifications
        +
SOS Emergency System
        +
MySQL Database
```

---

# ❗ Problem Statement

Traditional travel planning applications mainly focus on navigation and transportation.

They may not provide a complete safety system that combines:

- Trip registration
- Real-time tracking
- Emergency contacts
- SOS alerts
- Location history
- Safety notifications

TripSafety addresses this problem by providing a dedicated travel safety platform.

---

# 🎯 Objectives

The main objectives of TripSafety are:

1. Provide secure user registration and login.
2. Allow users to register travel plans.
3. Track the user's real-time GPS location.
4. Display the user's current location on a map.
5. Display the destination on a map.
6. Calculate distance to the destination.
7. Calculate estimated arrival time.
8. Display the actual driving route.
9. Store GPS locations in MySQL.
10. Allow users to manage emergency contacts.
11. Provide an SOS emergency system.
12. Store SOS alerts in the database.
13. Generate emergency location links.
14. Open the mobile SMS application with a pre-filled emergency message.
15. Provide trip history.
16. Provide notifications.
17. Provide password change and password reset functionality.
18. Provide a responsive interface for desktop and mobile devices.

---

# 🚀 Features

## 🔐 User Authentication

- User registration
- User login
- JWT authentication
- Secure password hashing
- Logout
- User profile
- Change password
- Forgot password
- Password reset
- Token expiration

---

## 🧳 Trip Registration

Users can register a trip using:

- Trip name
- Source
- Destination
- Trip date
- Start time
- Expected arrival time
- Transport type
- Notes

Trip status:

```text
UPCOMING
ACTIVE
COMPLETED
```

---

## 📍 Real-Time GPS Tracking

The application uses the browser Geolocation API.

It displays:

```text
Current Latitude
Current Longitude
GPS Accuracy
Distance
ETA
Destination
GPS Status
```

The user's location is continuously updated while tracking is active.

---

## 🗺️ Interactive Map

The application uses Leaflet and OpenStreetMap.

The map displays:

- Current location
- Destination
- Driving route
- Map zoom controls

---

## 🚗 Driving Route

TripSafety uses OSRM to calculate the driving route.

The route includes:

- Road-based route
- Route distance
- Route duration
- Visual route line

---

## 👥 Emergency Contacts

Users can manage trusted contacts.

Each contact contains:

```text
Name
Phone
Relationship
```

Operations:

```text
Add Contact
View Contact
Edit Contact
Delete Contact
```

---

## 🚨 SOS Emergency

The SOS system allows the user to create an emergency alert.

When the user activates SOS:

```text
SOS Button
     ↓
Confirm Emergency
     ↓
Get Latest GPS Location
     ↓
Send SOS Request
     ↓
Save SOS in MySQL
     ↓
Find Emergency Contacts
     ↓
Create Notification
     ↓
Create SMS Link
     ↓
Open Mobile Messages App
     ↓
User Presses SEND
```

The system also generates a Google Maps location link.

---

## 🔔 Notifications

The application stores notifications in MySQL.

Examples:

```text
SOS Emergency Activated
Trip Started
Trip Completed
Emergency Alert
General Safety Notification
```

---

## 🕘 Trip History

Users can view previous trips.

Trip history includes:

- Trip name
- Source
- Destination
- Travel date
- Transport
- Status
- Trip information

---

## ⚙️ Settings

The settings page provides:

- User profile
- Dark mode
- Push notification preference
- SMS alert preference
- Trip notification preference
- Emergency notification preference
- Shake detection preference
- Voice detection preference
- Automatic tracking preference
- Language selection
- Password change

---

# 💻 Technology Stack

## Frontend

```text
HTML5
CSS3
JavaScript
Leaflet.js
OpenStreetMap
Browser Geolocation API
```

## Backend

```text
Node.js
Express.js
REST API
JWT
bcryptjs
dotenv
CORS
Nodemailer
```

## Database

```text
MySQL
mysql2
```

## External Services

```text
OpenStreetMap
Nominatim
OSRM
Google Maps
```

## Development Tools

```text
Visual Studio Code
MySQL Workbench
Git
GitHub
Live Server
Nodemon
Google Chrome
Microsoft Edge
```

---

# 🏗️ System Architecture

```text
                         ┌──────────────────────┐
                         │        USER          │
                         │ Desktop / Mobile     │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │      FRONTEND        │
                         │                      │
                         │ HTML                 │
                         │ CSS                  │
                         │ JavaScript           │
                         └──────────┬───────────┘
                                    │
                                    │ REST API
                                    ▼
                         ┌──────────────────────┐
                         │       BACKEND        │
                         │                      │
                         │ Node.js              │
                         │ Express.js           │
                         │ JWT                  │
                         │ bcrypt                │
                         └──────────┬───────────┘
                                    │
                                    │ SQL
                                    ▼
                         ┌──────────────────────┐
                         │        MySQL         │
                         │     trip_safety      │
                         └──────────────────────┘
```

---

# 🌐 External Services Architecture

```text
                        TripSafety Frontend
                                │
             ┌──────────────────┼──────────────────┐
             │                  │                  │
             ▼                  ▼                  ▼
        OpenStreetMap        Nominatim            OSRM
        Map Tiles            Geocoding          Route API
             │                  │                  │
             └──────────────────┼──────────────────┘
                                │
                                ▼
                           Leaflet Map
```

---

# 📁 Project Structure

```text
TripSafety/
│
├── frontend/
│   │
│   ├── index.html
│   ├── dashboard.html
│   ├── register-trip.html
│   ├── tracking.html
│   ├── trip-history.html
│   ├── emergency-contacts.html
│   ├── notifications.html
│   └── settings.html
│
│   ├── css/
│   │   ├── global.css
│   │   ├── auth.css
│   │   ├── dashboard.css
│   │   ├── trip.css
│   │   ├── tracking.css
│   │   └── responsive.css
│   │
│   ├── js/
│   │   ├── api.js
│   │   ├── auth.js
│   │   ├── dashboard.js
│   │   ├── register-trip.js
│   │   ├── tracking.js
│   │   ├── trip-history.js
│   │   ├── emergency-contacts.js
│   │   ├── notifications.js
│   │   └── settings.js
│   │
│   └── assets/
│
├── backend/
│   │
│   ├── server.js
│   ├── package.json
│   ├── .env
│   │
│   ├── config/
│   │   └── database.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── tripController.js
│   │   ├── trackingController.js
│   │   ├── contactController.js
│   │   ├── notificationController.js
│   │   └── sosController.js
│   │
│   ├── middleware/
│   │   └── authMiddleware.js
│   │
│   ├── models/
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── tripRoutes.js
│   │   ├── trackingRoutes.js
│   │   ├── contactRoutes.js
│   │   ├── notificationRoutes.js
│   │   └── sosRoutes.js
│   │
│   └── utils/
│       ├── jwt.js
│       ├── email.js
│       └── notification.js
│
├── database/
│   ├── schema.sql
│   └── seed.sql
│
├── README.md
│
└── .gitignore
```

---

# 🗄️ Database Design

Database name:

```text
trip_safety
```

The application contains the following main tables:

```text
users
trips
emergency_contacts
locations
notifications
sos_alerts
password_reset_tokens
```

---

# 👤 Users Table

Stores user account information.

```text
users
│
├── id
├── name
├── email
├── password
└── created_at
```

---

# 🧳 Trips Table

Stores registered trips.

```text
trips
│
├── id
├── user_id
├── trip_name
├── source
├── destination
├── trip_date
├── start_time
├── arrival_time
├── transport
├── notes
├── status
└── created_at
```

Relationship:

```text
users
  │
  │ 1
  │
  │
  │ many
  ▼
trips
```

---

# 👥 Emergency Contacts Table

Stores trusted emergency contacts.

```text
emergency_contacts
│
├── id
├── user_id
├── name
├── phone
└── relationship
```

Relationship:

```text
users
  │
  │ 1
  │
  │ many
  ▼
emergency_contacts
```

---

# 📍 Locations Table

Stores GPS tracking information.

```text
locations
│
├── id
├── trip_id
├── latitude
├── longitude
├── accuracy
└── recorded_at
```

Relationship:

```text
trips
  │
  │ 1
  │
  │ many
  ▼
locations
```

---

# 🔔 Notifications Table

Stores user notifications.

```text
notifications
│
├── id
├── user_id
├── title
├── message
├── type
├── is_read
└── created_at
```

Relationship:

```text
users
  │
  │ 1
  │
  │ many
  ▼
notifications
```

---

# 🚨 SOS Alerts Table

Stores emergency alerts.

```text
sos_alerts
│
├── id
├── user_id
├── trip_id
├── latitude
├── longitude
├── accuracy
├── message
├── status
├── created_at
└── resolved_at
```

Relationship:

```text
users
  │
  ├───────────────┐
  │               │
  ▼               ▼
trips          sos_alerts
```

---

# 🔑 Password Reset Tokens Table

Stores password reset information.

```text
password_reset_tokens
│
├── id
├── user_id
├── token_hash
├── expires_at
└── used
```

Password reset tokens are stored as hashes rather than storing the raw reset token.

---

# 📊 Entity Relationship Overview

```text
                         ┌───────────────┐
                         │     USERS     │
                         ├───────────────┤
                         │ id            │
                         │ name          │
                         │ email         │
                         │ password      │
                         └───────┬───────┘
                                 │
              ┌──────────────────┼──────────────────┐
              │                  │                  │
              │                  │                  │
              ▼                  ▼                  ▼
       ┌────────────┐    ┌─────────────────┐  ┌───────────────┐
       │   TRIPS    │    │    CONTACTS     │  │NOTIFICATIONS  │
       └─────┬──────┘    └─────────────────┘  └───────────────┘
             │
             │
       ┌─────┴─────────┐
       │               │
       ▼               ▼
 ┌───────────┐   ┌──────────────┐
 │ LOCATIONS │   │  SOS ALERTS  │
 └───────────┘   └──────────────┘

                         │
                         ▼
                ┌─────────────────────┐
                │ PASSWORD RESET      │
                │ TOKENS              │
                └─────────────────────┘
```

---

# 🧩 Application Modules

TripSafety is divided into the following modules:

```text
Module 1
Authentication

Module 2
Dashboard

Module 3
Trip Registration

Module 4
Live GPS Tracking

Module 5
Map and Route

Module 6
Emergency Contacts

Module 7
SOS Emergency

Module 8
Notifications

Module 9
Trip History

Module 10
Settings
```

---

# 🔐 Authentication System

TripSafety uses JWT-based authentication.

Authentication flow:

```text
                 USER
                   │
                   ▼
               REGISTER
                   │
                   ▼
              BACKEND API
                   │
                   ▼
          Password Hashing
             bcryptjs
                   │
                   ▼
             MySQL Database
```

Login:

```text
                 USER
                   │
                   ▼
                LOGIN
                   │
                   ▼
              BACKEND API
                   │
                   ▼
            Verify Password
                   │
                   ▼
              Generate JWT
                   │
                   ▼
             Browser Storage
```

Protected API request:

```text
Browser
   │
   │ Authorization: Bearer TOKEN
   ▼
Express Middleware
   │
   ▼
JWT Verification
   │
   ▼
Protected Controller
   │
   ▼
MySQL
```

---

# 🧳 Trip Management

A user can create a trip.

Example:

```text
Trip Name:
College Trip

Source:
Sanjivani University

Destination:
Shrirampur

Transport:
Car

Status:
Upcoming
```

When the user starts the trip:

```text
UPCOMING
    ↓
ACTIVE
```

When the user completes the trip:

```text
ACTIVE
    ↓
COMPLETED
```

---

# 📍 GPS Tracking

The browser Geolocation API is used to retrieve the user's current location.

Example location:

```text
Latitude:
19.901707

Longitude:
74.494788

Accuracy:
114 meters
```

GPS flow:

```text
Start GPS Tracking
        │
        ▼
Browser Permission
        │
        ▼
Geolocation API
        │
        ▼
Latitude / Longitude
        │
        ├───────────────┐
        │               │
        ▼               ▼
   Update Map       Send to API
                        │
                        ▼
                      MySQL
```

---

# 📏 Distance Calculation

The application calculates the distance between the user's current GPS location and the destination.

The Haversine formula is used for straight-line distance calculation.

For road distance, OSRM route information can be used.

Displayed example:

```text
Distance:
36.03 km
```

---

# ⏱️ ETA Calculation

The application calculates estimated arrival time.

Example:

```text
Distance:
36.03 km

Estimated Time:
54 min
```

When OSRM returns route duration, the application can use the road-based duration for a more useful ETA.

---

# 🗺️ Map and Route System

TripSafety uses:

```text
Leaflet
OpenStreetMap
Nominatim
OSRM
```

Map process:

```text
Trip Destination
       │
       ▼
Nominatim
       │
       ▼
Destination Coordinates
       │
       ▼
Leaflet Map
       │
       ▼
OSRM
       │
       ▼
Driving Route
```

The map displays:

```text
📍 Current Location

🎯 Destination

🔵 Driving Route
```

---

# 🚨 SOS Emergency System

The SOS system is one of the main safety features.

When SOS is activated:

```text
                SOS BUTTON
                    │
                    ▼
             Confirmation
                    │
                    ▼
            Latest GPS Data
                    │
                    ▼
              POST /api/sos
                    │
                    ▼
             SOS Controller
                    │
          ┌─────────┴─────────┐
          │                   │
          ▼                   ▼
      Save SOS          Find Contacts
          │                   │
          │                   ▼
          │              SMS Links
          │                   │
          ▼                   ▼
    Notifications       Mobile Messages
```

The SOS database record contains:

```text
User ID
Trip ID
Latitude
Longitude
Accuracy
Message
Status
Created Time
```

---

# 📱 Free SMS System

TripSafety does not require Twilio for the basic mobile SMS flow.

Instead, the application creates an SMS URL.

Example:

```text
sms:+919209681853?body=Emergency%20message
```

On a compatible mobile device:

```text
Web Application
      │
      ▼
sms: link
      │
      ▼
Mobile Messages App
      │
      ▼
Pre-filled Message
      │
      ▼
User presses SEND
```

### Important

A normal browser-based application cannot silently send an SMS for free.

The user must manually press **Send** in the Messages application.

Automatic SMS delivery would require an SMS service/provider.

---

# 📍 Emergency Location

The SOS system generates a Google Maps location URL.

Example:

```text
https://www.google.com/maps?q=19.901707,74.494788
```

The emergency message can contain:

```text
TripSafety SOS ALERT!

User has activated an emergency SOS alert.

Current Location:
Google Maps location

Latitude:
19.901707

Longitude:
74.494788

Please contact them immediately.
```

---

# 👥 Emergency Contacts

Emergency contacts are associated with the logged-in user.

Example:

```text
Name:
Emergency Contact

Phone:
+91XXXXXXXXXX

Relationship:
Parent
```

A user can:

```text
ADD
EDIT
DELETE
VIEW
```

contacts.

---

# 🔔 Notifications

Notifications are stored in MySQL.

Example notification:

```text
Title:
SOS Emergency Activated

Message:
Your SOS alert has been activated successfully.

Type:
sos
```

Notification flow:

```text
Application Event
       │
       ▼
Notification Controller
       │
       ▼
MySQL
       │
       ▼
Notifications Page
```

---

# 🔑 Password Reset

TripSafety provides a secure password reset system.

Flow:

```text
Forgot Password
       │
       ▼
Enter Email
       │
       ▼
Find User
       │
       ▼
Generate Random Token
       │
       ▼
Hash Token
       │
       ▼
Save Token in MySQL
       │
       ▼
Send Reset Email
       │
       ▼
User Opens Link
       │
       ▼
Enter New Password
       │
       ▼
Verify Token
       │
       ▼
Hash New Password
       │
       ▼
Update Password
       │
       ▼
Mark Token Used
```

The reset token includes an expiration time.

---

# 🌐 API Documentation

Base URL:

```text
http://localhost:5000/api
```

---

# 🔐 Authentication API

## Register

```http
POST /api/auth/register
```

Example request:

```json
{
    "name": "Test User",
    "email": "user@example.com",
    "password": "password123"
}
```

---

## Login

```http
POST /api/auth/login
```

Example:

```json
{
    "email": "user@example.com",
    "password": "password123"
}
```

---

## Get Current User

```http
GET /api/auth/me
```

Authentication:

```text
Bearer Token Required
```

---

## Change Password

```http
PUT /api/auth/change-password
```

Authentication:

```text
Bearer Token Required
```

---

## Forgot Password

```http
POST /api/auth/forgot-password
```

Example:

```json
{
    "email": "user@example.com"
}
```

---

## Reset Password

```http
POST /api/auth/reset-password
```

Example:

```json
{
    "token": "RESET_TOKEN",
    "password": "newPassword123"
}
```

---

# 🧳 Trip API

## Get Trips

```http
GET /api/trips
```

---

## Get Single Trip

```http
GET /api/trips/:id
```

---

## Create Trip

```http
POST /api/trips
```

Example:

```json
{
    "trip_name": "College Trip",
    "source_location": "Sanjivani University",
    "destination": "Shrirampur",
    "trip_date": "2026-09-10",
    "start_time": "09:00",
    "expected_arrival": "10:00",
    "transport": "Car",
    "notes": "College journey"
}
```

---

## Start Trip

```http
PUT /api/trips/:id/start
```

---

## Complete Trip

```http
PUT /api/trips/:id/complete
```

---

## Update Trip

```http
PUT /api/trips/:id
```

---

## Delete Trip

```http
DELETE /api/trips/:id
```

---

# 📍 Tracking API

## Save Location

```http
POST /api/tracking/:tripId/location
```

Example:

```json
{
    "latitude": 19.901707,
    "longitude": 74.494788,
    "accuracy": 114
}
```

---

## Get Trip Locations

```http
GET /api/tracking/:tripId/locations
```

---

# 👥 Emergency Contact API

## Get Contacts

```http
GET /api/contacts
```

---

## Add Contact

```http
POST /api/contacts
```

Example:

```json
{
    "name": "Emergency Contact",
    "phone": "+919209681853",
    "relationship": "Parent"
}
```

---

## Update Contact

```http
PUT /api/contacts/:id
```

---

## Delete Contact

```http
DELETE /api/contacts/:id
```

---

# 🔔 Notification API

## Get Notifications

```http
GET /api/notifications
```

---

## Mark Notification as Read

```http
PUT /api/notifications/:id/read
```

---

# 🚨 SOS API

## Activate SOS

```http
POST /api/sos
```

Example:

```json
{
    "trip_id": 17,
    "latitude": 19.901707,
    "longitude": 74.494788,
    "accuracy": 114,
    "message": "Emergency SOS activated from TripSafety."
}
```

---

## Get Active SOS

```http
GET /api/sos/active
```

---

## Resolve SOS

```http
PUT /api/sos/:id/resolve
```

---

# ⚙️ Installation

## Requirements

Install the following software:

```text
Node.js
MySQL
MySQL Workbench
Visual Studio Code
Git
GitHub
```

Recommended Node.js version:

```text
Node.js 18+
```

---

# 1️⃣ Clone the Repository

```bash
git clone <YOUR-GITHUB-REPOSITORY-URL>
```

Enter the project:

```bash
cd TripSafety
```

---

# 2️⃣ Install Backend Dependencies

Go to backend:

```bash
cd backend
```

Install packages:

```bash
npm install
```

Required packages:

```text
express
mysql2
cors
dotenv
bcryptjs
jsonwebtoken
nodemailer
```

Development package:

```text
nodemon
```

Install manually if required:

```bash
npm install express mysql2 cors dotenv bcryptjs jsonwebtoken nodemailer
```

Install Nodemon:

```bash
npm install --save-dev nodemon
```

---

# 🗄️ MySQL Setup

Open MySQL Workbench.

Create the database:

```sql
CREATE DATABASE trip_safety;
```

Select the database:

```sql
USE trip_safety;
```

Run the database schema:

```text
database/schema.sql
```

Optional seed data:

```text
database/seed.sql
```

---

# 📋 Verify Database

Run:

```sql
USE trip_safety;

SHOW TABLES;
```

Expected tables:

```text
users
trips
emergency_contacts
locations
notifications
sos_alerts
password_reset_tokens
```

---

# 🔐 Environment Variables

Create:

```text
backend/.env
```

Example:

```env
PORT=5000

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=YOUR_MYSQL_PASSWORD
DB_NAME=trip_safety

JWT_SECRET=YOUR_SECRET_KEY

FRONTEND_URL=http://localhost:5500/TripSafety/frontend
```

For email password reset functionality, configure the email settings required by your email utility.

Do not publish real passwords, API keys, tokens, or secret credentials.

---

# 🚫 .gitignore

The project should include a `.gitignore` file.

Example:

```gitignore
node_modules/
.env
.env.*
!.env.example

*.log

.DS_Store
Thumbs.db
```

Never upload:

```text
backend/.env
```

to GitHub.

---

# ▶️ Running the Backend

Go to:

```bash
cd backend
```

Development mode:

```bash
npm run dev
```

Production-style start:

```bash
npm start
```

The server runs on:

```text
http://localhost:5000
```

---

# 🧪 Backend Test

Open:

```text
http://localhost:5000/
```

Expected response:

```json
{
    "success": true,
    "message": "TripSafety API is running 🚀"
}
```

Database test:

```text
http://localhost:5000/api/test-db
```

---

# 🌐 Running the Frontend

Open the project in Visual Studio Code.

Install the:

```text
Live Server
```

extension.

Right-click:

```text
frontend/index.html
```

Select:

```text
Open with Live Server
```

The frontend normally runs at:

```text
http://127.0.0.1:5500/TripSafety/frontend/
```

---

# 💻 Desktop Testing

Login page:

```text
http://127.0.0.1:5500/TripSafety/frontend/index.html
```

Dashboard:

```text
http://127.0.0.1:5500/TripSafety/frontend/dashboard.html
```

Live Tracking:

```text
http://127.0.0.1:5500/TripSafety/frontend/tracking.html
```

---

# 📱 Mobile Testing

For mobile testing, connect the phone and computer to the same Wi-Fi network.

Find the computer IPv4 address.

Example:

```text
10.207.140.55
```

The frontend can then be opened on the phone using:

```text
http://10.207.140.55:5500/TripSafety/frontend/
```

Tracking page:

```text
http://10.207.140.55:5500/TripSafety/frontend/tracking.html?trip=17
```

Backend:

```text
http://10.207.140.55:5000/
```

---

# 🌐 Network Backend Configuration

For mobile access, the Express server should listen on all network interfaces.

Example:

```javascript
const PORT = process.env.PORT || 5000;

app.listen(
    PORT,
    "0.0.0.0",
    () => {
        console.log(
            `TripSafety server running on port ${PORT}`
        );
    }
);
```

---

# 🪟 Windows Firewall

If the phone cannot connect to the backend:

1. Open Windows Defender Firewall.
2. Check Windows Defender Firewall settings.
3. Allow Node.js through the firewall.
4. Allow access on the Private network.
5. Make sure the computer and phone are on the same Wi-Fi.

Test from the phone:

```text
http://10.207.140.55:5000/
```

---

# 📍 Mobile GPS Testing

When opening Live Tracking on mobile:

1. Open the tracking page.
2. Allow location permission.
3. Start GPS Tracking.
4. Wait for GPS Connected.
5. Check latitude.
6. Check longitude.
7. Check GPS accuracy.
8. Check distance.
9. Check ETA.
10. Check route.

Example:

```text
GPS Status:
GPS connected ✓

Latitude:
19.901707

Longitude:
74.494788

Accuracy:
114 m
```

GPS accuracy depends on the mobile device and environment.

---

# 🚨 Mobile SOS Testing

Test SOS on a mobile device.

Procedure:

```text
1. Login
2. Open Dashboard
3. Open Live Tracking
4. Select active trip
5. Start GPS Tracking
6. Wait for GPS Connected
7. Press SOS EMERGENCY
8. Confirm SOS
9. Check SOS response
10. Confirm emergency contact
11. Open Messages
12. Check pre-filled message
13. Press SEND
```

Expected flow:

```text
SOS Activated
      ↓
Location Saved
      ↓
Emergency Contact Found
      ↓
SMS Link Generated
      ↓
Messages Application
      ↓
User Presses SEND
```

---

# 🧪 Testing Checklist

## Authentication

```text
[ ] Register user
[ ] Login user
[ ] Invalid login
[ ] Logout
[ ] Get current user
[ ] Change password
[ ] Forgot password
[ ] Receive reset email
[ ] Reset password
[ ] Expired reset token
```

---

# 🧳 Trip Testing

```text
[ ] Create trip
[ ] View trips
[ ] View single trip
[ ] Update trip
[ ] Delete trip
[ ] Start trip
[ ] Complete trip
[ ] View trip history
```

---

# 📍 GPS Testing

```text
[ ] GPS permission
[ ] Get latitude
[ ] Get longitude
[ ] Get accuracy
[ ] Start tracking
[ ] Stop tracking
[ ] Save GPS location
[ ] Update GPS location
```

---

# 🗺️ Map Testing

```text
[ ] Map loads
[ ] Current location marker
[ ] Destination marker
[ ] Route displayed
[ ] Distance displayed
[ ] ETA displayed
[ ] Map zoom
[ ] Mobile map
```

---

# 👥 Emergency Contact Testing

```text
[ ] Add contact
[ ] View contact
[ ] Edit contact
[ ] Delete contact
[ ] Multiple contacts
```

---

# 🚨 SOS Testing

```text
[ ] SOS button
[ ] Confirmation dialog
[ ] GPS validation
[ ] SOS database entry
[ ] Emergency contact lookup
[ ] Notification creation
[ ] Location URL
[ ] SMS link
[ ] Mobile Messages application
[ ] SOS resolution
```

---

# 🔔 Notification Testing

```text
[ ] Load notifications
[ ] Display notification
[ ] Mark as read
[ ] SOS notification
```

---

# ⚙️ Settings Testing

```text
[ ] Load profile
[ ] Dark mode
[ ] Push notification setting
[ ] SMS setting
[ ] Trip notification setting
[ ] Emergency notification setting
[ ] Language selection
[ ] Change password
```

---

# 🔒 Security

TripSafety implements several security practices.

## Password Security

Passwords are hashed using:

```text
bcryptjs
```

Passwords should never be stored as plain text.

---

## JWT Authentication

Protected endpoints require:

```text
Authorization: Bearer <TOKEN>
```

JWT tokens are verified by authentication middleware.

---

## User Data Protection

API operations should be restricted to the authenticated user.

For example:

```text
User A
  ↓
Only User A's trips

User B
  ↓
Only User B's trips
```

Users should not be able to access another user's:

```text
Trips
Locations
Contacts
Notifications
SOS Alerts
```

---

# 🔐 Password Reset Security

Password reset uses:

```text
Random Token
       ↓
SHA-256 Hash
       ↓
Database
       ↓
Expiration Time
       ↓
Used Flag
```

The reset token expires after a limited period.

After successful password reset:

```text
used = true
```

---

# 🌍 CORS

During development, CORS can be configured to allow frontend requests.

For production, CORS should be restricted to the actual frontend domain.

---

# 🔑 Environment Security

Sensitive information must be stored in:

```text
.env
```

Examples:

```text
Database Password
JWT Secret
Email Password
API Credentials
```

These should never be committed to GitHub.

---

# ⚠️ Limitations

## GPS Accuracy

GPS accuracy depends on:

- Mobile hardware
- GPS signal
- Internet connection
- Browser
- Indoor/outdoor environment
- Weather and surrounding buildings

---

## SMS

The free SMS implementation uses the mobile device's SMS application.

The web application does not directly send SMS.

The user must press:

```text
SEND
```

in the mobile Messages application.

---

## Internet

The following features require internet access:

```text
OpenStreetMap
Nominatim
OSRM
Google Maps links
```

---

## Browser Permissions

GPS tracking requires browser location permission.

If permission is denied:

```text
GPS tracking will not work.
```

---

# 🔮 Future Enhancements

Possible future improvements include:

## 📱 Mobile Application

Develop a dedicated:

```text
Android Application
iOS Application
```

---

## 📡 Automatic SMS

Integrate a legal SMS provider for automatic emergency SMS delivery.

---

## 🔔 Push Notifications

Add:

```text
Web Push Notifications
Firebase Cloud Messaging
Mobile Push Notifications
```

---

## 👨‍👩‍👧 Family Tracking

Allow authorized family members to view a traveler's live location.

---

## 🗺️ Geofencing

Create geographical safety zones.

Example:

```text
Safe Zone
     ↓
User enters zone
     ↓
Notification
```

---

## 🚧 Route Deviation Detection

Detect when a traveler significantly leaves the planned route.

```text
Planned Route
     │
     ▼
Current GPS
     │
     ▼
Compare
     │
     ▼
Route Deviation
     │
     ▼
Safety Notification
```

---

## 🚨 Automatic Accident Detection

Future versions could use:

- Accelerometer
- Gyroscope
- Mobile sensors
- Sudden movement detection

to detect possible accidents.

---

## 🎤 Voice SOS

Future feature:

```text
"TripSafety SOS"
```

could activate emergency functionality.

---

## 📳 Shake Detection

A future mobile application could activate SOS when the device is shaken in a predefined pattern.

---

## 🔴 Real-Time WebSockets

WebSockets could be added for:

```text
Real-Time Location
Real-Time Notifications
Family Tracking
Emergency Updates
```

---

## ☁️ Cloud Deployment

Future deployment could use:

```text
Frontend
   ↓
Vercel / Netlify

Backend
   ↓
Cloud Server

Database
   ↓
Cloud MySQL
```

---

# 📊 Project Status

Current development status:

```text
🟢 User Registration        Completed
🟢 User Login              Completed
🟢 JWT Authentication       Completed
🟢 Dashboard               Completed
🟢 Trip Registration       Completed
🟢 Trip Management         Completed
🟢 Trip History            Completed
🟢 Emergency Contacts      Completed
🟢 Notifications           Completed
🟢 Settings                Completed
🟢 Password Change         Completed
🟢 Password Reset          Completed
🟢 Real GPS Tracking       Completed
🟢 GPS Location Database   Completed
🟢 Leaflet Map             Completed
🟢 OpenStreetMap           Completed
🟢 Destination Geocoding   Completed
🟢 Driving Route           Completed
🟢 Distance Calculation    Completed
🟢 ETA Calculation         Completed
🟢 SOS Backend             Completed
🟢 SOS Database            Completed
🟢 SMS Link Generation     Completed
🟡 Mobile SMS Testing      Testing
🟡 Security Hardening      In Progress
🟡 Deployment              Pending
```

---

# 🎓 Academic Information

## Project Title

```text
TripSafety
Real-Time Travel Safety and Emergency Tracking System
```

---

## Project Type

```text
Full-Stack Web Application
```

---

## Project Domain

```text
Travel Safety
Emergency Management
GPS Tracking
Web Development
```

---

## Frontend Technologies

```text
HTML5
CSS3
JavaScript
Leaflet
OpenStreetMap
```

---

## Backend Technologies

```text
Node.js
Express.js
REST API
JWT
bcryptjs
Nodemailer
```

---

## Database

```text
MySQL
```

---

## APIs

```text
REST API
Geolocation API
Nominatim API
OSRM API
```

---

# 🎤 Viva Questions

## What is TripSafety?

TripSafety is a full-stack travel safety application that provides trip management, real-time GPS tracking, emergency contacts, notifications, and SOS emergency functionality.

---

## Why did you use Node.js?

Node.js provides a fast and scalable environment for developing REST APIs using JavaScript.

---

## Why did you use Express.js?

Express.js simplifies the development of REST APIs and backend routes.

---

## Why did you use MySQL?

MySQL is a relational database suitable for structured data such as users, trips, contacts, GPS locations, notifications, and SOS alerts.

---

## Why did you use JWT?

JWT is used to authenticate users and protect API endpoints.

---

## Why did you use bcrypt?

bcrypt is used to securely hash user passwords before storing them in the database.

---

## Why did you use Leaflet?

Leaflet is a lightweight JavaScript library for creating interactive maps.

---

## Why did you use OpenStreetMap?

OpenStreetMap provides map data that can be displayed using Leaflet.

---

## How does GPS tracking work?

The browser Geolocation API obtains the user's latitude and longitude. The frontend displays the location and sends it to the backend, where it can be stored in MySQL.

---

## How does SOS work?

When SOS is activated, the latest GPS location is sent to the backend. The backend stores the SOS alert, finds emergency contacts, creates notifications, and generates SMS links.

---

## Can the website automatically send SMS for free?

No. A normal browser application cannot silently send SMS for free. TripSafety opens the mobile Messages application with a pre-filled message, and the user presses Send.

---

# 📜 License

This project is developed for educational and academic purposes.

---

# 🙏 Acknowledgements

TripSafety uses the following open-source technologies and services:

```text
Node.js
Express.js
MySQL
Leaflet
OpenStreetMap
Nominatim
OSRM
```

---

# ⭐ Project Summary

TripSafety combines multiple technologies into a single travel safety platform.

```text
                    🛡️ TRIPSAFETY
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
        ▼                 ▼                 ▼
   🔐 AUTH             🧳 TRIPS          📍 GPS
        │                 │                 │
        └─────────────────┼─────────────────┘
                          │
                          ▼
                     🗺️ MAP
                          │
              ┌───────────┴───────────┐
              │                       │
              ▼                       ▼
       👥 EMERGENCY              🚨 SOS
         CONTACTS                  ALERT
              │                       │
              └───────────┬───────────┘
                          │
                          ▼
                    🔔 NOTIFICATIONS
                          │
                          ▼
                      🗄️ MYSQL
```

---

# 🛡️ TripSafety

## Travel Safer. Stay Connected. Get Help When It Matters.

```text
🛡️ TripSafety
Real-Time Travel Safety and Emergency Tracking System
```
