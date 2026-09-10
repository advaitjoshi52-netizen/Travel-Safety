const mysql = require("mysql2");

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Advait@555",
    database: "trip_safety"
});

db.connect((error) => {

    if (error) {

        console.error(
            "❌ MySQL connection failed:",
            error.message
        );

        return;
    }

    console.log(
        "✅ MySQL connected successfully"
    );

    console.log(
        "📁 Database: trip_safety"
    );

});

module.exports = db;