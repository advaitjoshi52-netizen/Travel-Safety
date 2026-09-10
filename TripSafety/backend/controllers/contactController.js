// ============================================
// TRIP SAFETY - CONTACT CONTROLLER
// ============================================

const db = require("../config/database");


// ============================================
// GET ALL CONTACTS
// GET /api/contacts
// ============================================

exports.getContacts = (req, res) => {

    const userId = req.user.userId;

    const sql = `
        SELECT
            id,
            user_id,
            name,
            phone,
            relationship,
            created_at
        FROM emergency_contacts
        WHERE user_id = ?
        ORDER BY id DESC
    `;

    db.query(
        sql,
        [userId],
        (err, contacts) => {

            if (err) {

                console.error(
                    "❌ GET CONTACTS ERROR:",
                    err
                );

                return res.status(500).json({
                    success: false,
                    message:
                        "Failed to load emergency contacts."
                });
            }

            res.json({
                success: true,
                contacts: contacts
            });
        }
    );
};


// ============================================
// ADD CONTACT
// POST /api/contacts
// ============================================

exports.addContact = (req, res) => {

    const userId = req.user.userId;

    const {
        name,
        phone,
        relationship
    } = req.body;


    // ========================================
    // VALIDATION
    // ========================================

    if (!name || !phone) {

        return res.status(400).json({
            success: false,
            message:
                "Name and phone number are required."
        });
    }


    // ========================================
    // INSERT CONTACT
    // ========================================

    const sql = `
        INSERT INTO emergency_contacts
        (
            user_id,
            name,
            phone,
            relationship
        )
        VALUES (?, ?, ?, ?)
    `;


    db.query(
        sql,
        [
            userId,
            name.trim(),
            phone.trim(),
            relationship
                ? relationship.trim()
                : null
        ],
        (err, result) => {

            if (err) {

                console.error(
                    "❌ ADD CONTACT ERROR:",
                    err
                );

                return res.status(500).json({
                    success: false,
                    message:
                        "Failed to add emergency contact."
                });
            }


            console.log(
                "✅ Contact added:",
                result.insertId
            );


            res.status(201).json({
                success: true,
                message:
                    "Emergency contact added successfully.",
                contactId:
                    result.insertId
            });
        }
    );
};


// ============================================
// UPDATE CONTACT
// PUT /api/contacts/:id
// ============================================

exports.updateContact = (req, res) => {

    const userId = req.user.userId;

    const contactId = req.params.id;

    const {
        name,
        phone,
        relationship
    } = req.body;


    if (!name || !phone) {

        return res.status(400).json({
            success: false,
            message:
                "Name and phone number are required."
        });
    }


    const sql = `
        UPDATE emergency_contacts
        SET
            name = ?,
            phone = ?,
            relationship = ?
        WHERE id = ?
        AND user_id = ?
    `;


    db.query(
        sql,
        [
            name.trim(),
            phone.trim(),
            relationship
                ? relationship.trim()
                : null,
            contactId,
            userId
        ],
        (err, result) => {

            if (err) {

                console.error(
                    "❌ UPDATE CONTACT ERROR:",
                    err
                );

                return res.status(500).json({
                    success: false,
                    message:
                        "Failed to update contact."
                });
            }


            if (
                result.affectedRows === 0
            ) {

                return res.status(404).json({
                    success: false,
                    message:
                        "Emergency contact not found."
                });
            }


            res.json({
                success: true,
                message:
                    "Emergency contact updated successfully."
            });
        }
    );
};


// ============================================
// DELETE CONTACT
// DELETE /api/contacts/:id
// ============================================

exports.deleteContact = (req, res) => {

    const userId = req.user.userId;

    const contactId = req.params.id;


    const sql = `
        DELETE FROM emergency_contacts
        WHERE id = ?
        AND user_id = ?
    `;


    db.query(
        sql,
        [
            contactId,
            userId
        ],
        (err, result) => {

            if (err) {

                console.error(
                    "❌ DELETE CONTACT ERROR:",
                    err
                );

                return res.status(500).json({
                    success: false,
                    message:
                        "Failed to delete contact."
                });
            }


            if (
                result.affectedRows === 0
            ) {

                return res.status(404).json({
                    success: false,
                    message:
                        "Emergency contact not found."
                });
            }


            res.json({
                success: true,
                message:
                    "Emergency contact deleted successfully."
            });
        }
    );
};