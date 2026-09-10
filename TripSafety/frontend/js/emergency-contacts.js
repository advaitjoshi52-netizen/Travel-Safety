// ============================================
// TRIP SAFETY - EMERGENCY CONTACTS
// ============================================

const API_URL =
    "http://localhost:5000/api";


let allContacts = [];


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


        setupContactForm();

        setupSearch();

        setupCancelEdit();

        setupLogout();

        loadContacts();

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
// LOAD CONTACTS
// ============================================

async function loadContacts() {

    const container =
        document.getElementById(
            "contactsList"
        );


    try {

        const response =
            await fetch(
                `${API_URL}/contacts`,
                {
                    method: "GET",
                    headers: getHeaders()
                }
            );


        const data =
            await response.json();


        console.log(
            "Contacts API:",
            data
        );


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Unable to load contacts"
            );
        }


        allContacts =
            Array.isArray(data)
                ? data
                : (
                    data.contacts ||
                    data.data ||
                    []
                );


        if (!Array.isArray(allContacts)) {

            allContacts = [];

        }


        updateSummary();

        renderContacts();

    } catch (error) {

        console.error(
            "Contacts loading error:",
            error
        );


        if (container) {

            container.innerHTML = `

                <div
                    class="contacts-state"
                    style="grid-column:1/-1;"
                >

                    <div class="state-icon">
                        ⚠️
                    </div>

                    <h3>
                        Unable to load contacts
                    </h3>

                    <p>
                        ${escapeHTML(
                            error.message
                        )}
                    </p>

                </div>

            `;
        }
    }
}


// ============================================
// SUMMARY
// ============================================

function updateSummary() {

    const total =
        allContacts.length;


    setText(
        "totalContacts",
        total
    );


    setText(
        "trustedContacts",
        total
    );


    const percentage =
        total > 0
            ? 100
            : 0;


    setText(
        "emergencyReady",
        `${percentage}%`
    );


    setText(
        "contactCount",
        total
    );
}


// ============================================
// RENDER CONTACTS
// ============================================

function renderContacts() {

    const container =
        document.getElementById(
            "contactsList"
        );


    if (!container) {
        return;
    }


    const searchInput =
        document.getElementById(
            "contactSearch"
        );


    const searchTerm =
        searchInput
            ? searchInput.value
                .trim()
                .toLowerCase()
            : "";


    let contacts =
        [...allContacts];


    if (searchTerm) {

        contacts =
            contacts.filter(
                contact => {

                    const text =
                        [
                            contact.name,
                            contact.phone,
                            contact.relationship
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


    if (!contacts.length) {

        container.innerHTML = `

            <div
                class="contacts-state"
                style="grid-column:1/-1;"
            >

                <div class="state-icon">
                    ${
                        allContacts.length
                            ? "🔍"
                            : "👥"
                    }
                </div>

                <h3>
                    ${
                        allContacts.length
                            ? "No matching contacts"
                            : "No emergency contacts yet"
                    }
                </h3>

                <p>
                    ${
                        allContacts.length
                            ? "Try a different search."
                            : "Add a trusted person using the form above."
                    }
                </p>

            </div>

        `;

        return;
    }


    container.innerHTML =
        contacts
            .map(
                contact =>
                    createContactCard(
                        contact
                    )
            )
            .join("");
}


// ============================================
// CREATE CONTACT CARD
// ============================================

function createContactCard(
    contact
) {

    const name =
        contact.name ||
        "Unnamed Contact";


    const phone =
        contact.phone ||
        "No phone number";


    const relationship =
        contact.relationship ||
        "Trusted Contact";


    const initial =
        name
            .trim()
            .charAt(0)
            .toUpperCase() ||
        "C";


    return `

        <div
            class="contact-item"
            data-contact-id="${escapeHTML(
                contact.id
            )}"
        >


            <div class="contact-top">


                <div class="contact-person">


                    <div class="contact-avatar">
                        ${escapeHTML(
                            initial
                        )}
                    </div>


                    <div>

                        <div class="contact-name">
                            ${escapeHTML(
                                name
                            )}
                        </div>


                        <div class="contact-relation">
                            ${escapeHTML(
                                relationship
                            )}
                        </div>

                    </div>


                </div>


                <span class="trusted-badge">
                    ✓ TRUSTED
                </span>


            </div>



            <div class="contact-phone">

                📞

                <span>
                    ${escapeHTML(
                        phone
                    )}
                </span>

            </div>



            <div class="contact-actions">


                <a
                    href="tel:${escapeHTML(
                        phone
                    )}"
                    class="contact-action call-btn"
                >
                    📞 Call
                </a>


                <button
                    type="button"
                    class="contact-action edit-btn"
                    onclick="editContact(${Number(
                        contact.id
                    )})"
                >
                    ✏️ Edit
                </button>


                <button
                    type="button"
                    class="contact-action delete-btn"
                    onclick="deleteContact(${Number(
                        contact.id
                    )})"
                >
                    🗑️ Delete
                </button>


            </div>


        </div>

    `;
}


// ============================================
// FORM
// ============================================

function setupContactForm() {

    const form =
        document.getElementById(
            "contactForm"
        );


    if (!form) {
        return;
    }


    form.addEventListener(
        "submit",
        async event => {

            event.preventDefault();


            const id =
                document.getElementById(
                    "contactId"
                ).value;


            const name =
                document.getElementById(
                    "contactName"
                ).value.trim();


            const phone =
                document.getElementById(
                    "contactPhone"
                ).value.trim();


            const relationship =
                document.getElementById(
                    "contactRelationship"
                ).value.trim();


            if (
                !name ||
                !phone ||
                !relationship
            ) {

                showMessage(
                    "Please fill in all fields.",
                    true
                );

                return;
            }


            const button =
                document.getElementById(
                    "submitContactBtn"
                );


            button.disabled = true;


            button.textContent =
                id
                    ? "Updating..."
                    : "Adding...";


            try {

                const url =
                    id
                        ? `${API_URL}/contacts/${id}`
                        : `${API_URL}/contacts`;


                const method =
                    id
                        ? "PUT"
                        : "POST";


                const response =
                    await fetch(
                        url,
                        {
                            method,
                            headers:
                                getHeaders(),

                            body:
                                JSON.stringify({
                                    name,
                                    phone,
                                    relationship
                                })
                        }
                    );


                const data =
                    await response.json();


                console.log(
                    "Contact response:",
                    data
                );


                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        "Unable to save contact"
                    );
                }


                showMessage(
                    id
                        ? "✓ Contact updated successfully."
                        : "✓ Emergency contact added successfully.",
                    false
                );


                resetContactForm();

                await loadContacts();


            } catch (error) {

                console.error(
                    "Contact save error:",
                    error
                );


                showMessage(
                    error.message,
                    true
                );


            } finally {

                button.disabled =
                    false;


                button.textContent =
                    "➕ Add Contact";
            }
        }
    );
}


// ============================================
// EDIT CONTACT
// ============================================

function editContact(
    id
) {

    const contact =
        allContacts.find(
            item =>
                Number(item.id) ===
                Number(id)
        );


    if (!contact) {

        alert(
            "Contact not found."
        );

        return;
    }


    document.getElementById(
        "contactId"
    ).value =
        contact.id;


    document.getElementById(
        "contactName"
    ).value =
        contact.name || "";


    document.getElementById(
        "contactPhone"
    ).value =
        contact.phone || "";


    document.getElementById(
        "contactRelationship"
    ).value =
        contact.relationship || "";


    document.getElementById(
        "formTitle"
    ).textContent =
        "Edit Emergency Contact";


    const submitButton =
        document.getElementById(
            "submitContactBtn"
        );


    submitButton.textContent =
        "💾 Update Contact";


    const cancelButton =
        document.getElementById(
            "cancelEditBtn"
        );


    cancelButton.style.display =
        "inline-block";


    showMessage(
        "Editing contact. Update the information above.",
        false
    );


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


// ============================================
// DELETE CONTACT
// ============================================

async function deleteContact(
    id
) {

    const contact =
        allContacts.find(
            item =>
                Number(item.id) ===
                Number(id)
        );


    const name =
        contact
            ? contact.name
            : "this contact";


    const confirmed =
        confirm(
            `Delete ${name} from your emergency contacts?`
        );


    if (!confirmed) {
        return;
    }


    try {

        const response =
            await fetch(
                `${API_URL}/contacts/${id}`,
                {
                    method: "DELETE",
                    headers: getHeaders()
                }
            );


        const data =
            await response.json();


        console.log(
            "Delete response:",
            data
        );


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Unable to delete contact"
            );
        }


        showMessage(
            "✓ Contact deleted successfully.",
            false
        );


        await loadContacts();


    } catch (error) {

        console.error(
            "Delete contact error:",
            error
        );


        showMessage(
            error.message,
            true
        );
    }
}


// ============================================
// CANCEL EDIT
// ============================================

function setupCancelEdit() {

    const button =
        document.getElementById(
            "cancelEditBtn"
        );


    if (!button) {
        return;
    }


    button.addEventListener(
        "click",
        () => {

            resetContactForm();

            showMessage(
                "",
                false
            );
        }
    );
}


// ============================================
// RESET FORM
// ============================================

function resetContactForm() {

    const form =
        document.getElementById(
            "contactForm"
        );


    if (form) {
        form.reset();
    }


    document.getElementById(
        "contactId"
    ).value = "";


    document.getElementById(
        "formTitle"
    ).textContent =
        "Add Emergency Contact";


    const submitButton =
        document.getElementById(
            "submitContactBtn"
        );


    if (submitButton) {

        submitButton.textContent =
            "➕ Add Contact";
    }


    const cancelButton =
        document.getElementById(
            "cancelEditBtn"
        );


    if (cancelButton) {

        cancelButton.style.display =
            "none";
    }
}


// ============================================
// SEARCH
// ============================================

function setupSearch() {

    const search =
        document.getElementById(
            "contactSearch"
        );


    if (!search) {
        return;
    }


    search.addEventListener(
        "input",
        () => {

            renderContacts();

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
// MESSAGE
// ============================================

function showMessage(
    message,
    isError
) {

    const element =
        document.getElementById(
            "contactMessage"
        );


    if (!element) {
        return;
    }


    element.textContent =
        message;


    element.className =
        "contact-message";


    if (message) {

        element.classList.add(
            isError
                ? "message-error"
                : "message-success"
        );
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