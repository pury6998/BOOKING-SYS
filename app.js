// Configuration
const scriptURL = "https://script.google.com/macros/s/AKfycbycehH5GfUKtJbB1wmGSCb8Wmx8Z6unUM_OaeKSUh67bH_6obgZgZEF3fkmuIjViy_G/exec";

const pricing = {
    "Silent Yoga Retreat 6D/6N": { "Private": 479 },
    "Yoga and Ayurvedic Massage 2D/2N": { "Private": 179, "Double": 149, "Dormitory": 119 },
    "Introductory Hatha Yoga 4D/4N": { "Private": 319, "Double": 259, "Dormitory": 199 },
    "Yogic Cleansing and Stretching 2D/2N": { "Private": 159, "Double": 129, "Dormitory": 99 },
    "One-Day Yoga and Meditation 1DAY": { "Dormitory": 79 },
    "Fasting and Gastro-Cleansing 7D/7N": { "Private": 559, "Double": 455, "Dormitory": 349 },
    "Yoga and Juice Fasting 4D/4N": { "Private": 319, "Double": 259, "Dormitory": 199 },
    "Silent Detox Retreat in Nepal 6D/6N": { "Private": 479, "Double": 389 },
    "Standard Hatha Yoga 7D/7N": { "Private": 559, "Double": 455, "Dormitory": 349 }
};

const retreatDuration = {
    "Silent Yoga Retreat 6D/6N": 6,
    "Yoga and Ayurvedic Massage 2D/2N": 2,
    "Introductory Hatha Yoga 4D/4N": 4,
    "Yogic Cleansing and Stretching 2D/2N": 2,
    "One-Day Yoga and Meditation 1DAY": 1,
    "Fasting and Gastro-Cleansing 7D/7N": 7,
    "Yoga and Juice Fasting 4D/4N": 4,
    "Silent Detox Retreat in Nepal 6D/6N": 6,
    "Standard Hatha Yoga 7D/7N": 7
};

// Initialize the application
function initApp() {
    if (document.getElementById('bookingForm')) {
        initBookingForm();
    }
    if (document.getElementById('adminPanel')) {
        setupSearchAndSort();
    }
}

// Initialize booking form functionality
function initBookingForm() {
    const retreatSelect = document.getElementById("retreatPackage");
    const roomSelect = document.getElementById("roomType");
    const priceInput = document.getElementById("price");
    const priceDisplay = document.getElementById("priceDisplay");
    const arrivalInput = document.querySelector('input[name="arrival_date"]');
    const departureInput = document.querySelector('input[name="departure_date"]');
    const countryCodeSelect = document.getElementById("countryCode");
    const phoneNumberInput = document.getElementById("phoneNumber");
    const phoneHiddenInput = document.getElementById("phone");

    // Set minimum date for arrival to today
    const today = new Date().toISOString().split('T')[0];
    if (arrivalInput) arrivalInput.min = today;

    // Event listeners
    if (retreatSelect) {
        retreatSelect.addEventListener("change", () => {
            updateRoomTypes(retreatSelect, roomSelect);
            updateDepartureDate(retreatSelect, arrivalInput, departureInput);
        });
    }

    if (roomSelect) {
        roomSelect.addEventListener("change", () => updatePrice(retreatSelect, roomSelect, priceInput, priceDisplay));
    }

    if (arrivalInput) {
        arrivalInput.addEventListener("change", () => updateDepartureDate(retreatSelect, arrivalInput, departureInput));
    }

    if (countryCodeSelect && phoneNumberInput && phoneHiddenInput) {
        countryCodeSelect.addEventListener("change", () => updatePhoneField(countryCodeSelect, phoneNumberInput, phoneHiddenInput));
        phoneNumberInput.addEventListener("input", () => updatePhoneField(countryCodeSelect, phoneNumberInput, phoneHiddenInput));
    }

    // Booking form submission
    const bookingForm = document.getElementById("bookingForm");
    if (bookingForm) {
        bookingForm.addEventListener("submit", handleBookingSubmit);
    }
}

function updatePhoneField(countryCodeSelect, phoneNumberInput, phoneHiddenInput) {
    const countryCode = countryCodeSelect.value;
    const phoneNumber = phoneNumberInput.value.replace(/\D/g, '');

    if (countryCode && phoneNumber) {
        phoneHiddenInput.value = `https://wa.me/${countryCode}${phoneNumber}`;
    } else {
        phoneHiddenInput.value = '';
    }
}

function updateRoomTypes(retreatSelect, roomSelect) {
    const retreat = retreatSelect.value;
    roomSelect.innerHTML = "<option value='' disabled selected>Select Room Type</option>";

    if (pricing[retreat]) {
        Object.keys(pricing[retreat]).forEach(rt => {
            const opt = document.createElement("option");
            opt.value = rt;
            opt.textContent = rt;
            roomSelect.appendChild(opt);
        });
    }
}

function updatePrice(retreatSelect, roomSelect, priceInput, priceDisplay) {
    const retreat = retreatSelect.value;
    const room = roomSelect.value;

    if (pricing[retreat] && pricing[retreat][room]) {
        const price = pricing[retreat][room];
        priceInput.value = "$" + price;
        priceDisplay.textContent = "$" + price;
    } else {
        priceInput.value = "";
        priceDisplay.textContent = "$0";
    }
}

function updateDepartureDate(retreatSelect, arrivalInput, departureInput) {
    const retreat = retreatSelect.value;
    const nights = retreatDuration[retreat];

    if (arrivalInput.value && nights) {
        const arrival = new Date(arrivalInput.value);
        const departure = new Date(arrival);
        departure.setDate(arrival.getDate() + nights);
        departureInput.value = departure.toISOString().split('T')[0];
    }
}

// Helper to format dates
function formatDate(dateStr) {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "";
    const day = d.getDate();
    const daySuffix = day % 10 === 1 && day !== 11 ? "st" :
        day % 10 === 2 && day !== 12 ? "nd" :
            day % 10 === 3 && day !== 13 ? "rd" : "th";
    return `${day}${daySuffix} ${d.toLocaleString('en-US', { month: 'long' })} ${d.getFullYear()}`;
}

// Create a styled confirmation slip
function createStyledConfirmation(data) {
    const width = 1200;
    const height = Math.round(width * 3 / 4);

    const confirmationDiv = document.createElement('div');
    confirmationDiv.style.cssText = `
        width: ${width}px;
        height: ${height}px;
        padding: 40px;
        background: linear-gradient(135deg, #f9f7f2 0%, #ffffff 100%);
        border: 4px solid #506C4A;
        border-radius: 20px;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        color: #192812;
        position: relative;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    `;

    confirmationDiv.innerHTML = `
        <div style="text-align:center;">
            <h1 style="font-size: 42px; margin: 0 0 6px 0; color: #506C4A;">Sadhana Yoga Retreat</h1>
            <h2 style="font-size: 22px; margin: 0 0 12px 0; color: #8DA399;">Booking Confirmation</h2>
            <p style="font-size: 16px; margin: 0; color: #666;">Find peace, balance, and renewal in the heart of nature</p>
        </div>

        <div style="display:flex; gap:18px; margin-top:20px;">
            <div style="flex:1;">
                <div style="padding:12px 16px; border-radius:10px; background:rgba(80,108,74,0.04); border-left:4px solid #506C4A;">
                    <div style="font-size:14px; color:#506C4A; font-weight:700;">Guest</div>
                    <div style="font-size:18px; margin-top:8px; font-weight:600;">${data.guest_name}</div>
                    <div style="font-size:14px; margin-top:6px;">${data.country}</div>
                    <div style="font-size:14px; margin-top:6px;">${data.email || ''}</div>
                </div>
            </div>

            <div style="flex:1;">
                <div style="padding:12px 16px; border-radius:10px; background:rgba(80,108,74,0.04); border-left:4px solid #506C4A;">
                    <div style="font-size:14px; color:#506C4A; font-weight:700;">Booking</div>
                    <div style="font-size:18px; margin-top:8px; font-weight:600;">${data.package}</div>
                    <div style="font-size:14px; margin-top:6px;">Room: ${data.room_type}</div>
                    <div style="font-size:14px; margin-top:6px;">Code: <strong>${data.booking_code}</strong></div>
                </div>
            </div>
        </div>

        <div style="display:flex; gap:18px; margin-top:20px;">
            <div style="flex:1; padding:12px 16px; border-radius:10px; background:rgba(201,169,110,0.08); border:2px solid #C9A96E; text-align:center;">
                <div style="font-size:14px; color:#666;">Arrival</div>
                <div style="font-size:20px; font-weight:700; color:#506C4A; margin-top:6px;">${formatDate(data.arrival_date)} at 3 PM</div>
            </div>
            <div style="flex:1; padding:12px 16px; border-radius:10px; background:rgba(201,169,110,0.08); border:2px solid #C9A96E; text-align:center;">
                <div style="font-size:14px; color:#666;">Departure</div>
                <div style="font-size:20px; font-weight:700; color:#506C4A; margin-top:6px;">${formatDate(data.departure_date)} at 11 AM</div>
            </div>
        </div>

        <div style="margin-top:20px; display:flex; gap:18px; align-items:center;">
            <div style="flex:1;">
                <div style="font-size:14px; color:#666; margin-bottom:8px;">Remarks</div>
                <div style="padding:12px; background:rgba(80,108,74,0.04); border-radius:10px; min-height:54px;">${data.remarks || 'No special requests'}</div>
            </div>
            <div style="width:320px; text-align:center;">
                <div style="font-size:14px; color:#666;">Total Amount</div>
                <div style="font-size:36px; font-weight:800; color:#506C4A; margin-top:6px;">${data.price}</div>
            </div>
        </div>

        <div style="margin-top:20px; font-size:14px; color:#666;">
            <p style="margin:6px 0;">Thank you for choosing Sadhana Yoga Retreat. We look forward to welcoming you!</p>
            <p style="margin:6px 0; font-weight:700; color:#c04a4a;">Please show this slip at the reception. Without the booking code you may face uncertainty in your room types and services.</p>
        </div>
    `;

    return confirmationDiv;
}

// Download confirmation as JPEG
function downloadConfirmationAsImage(data) {
    const confirmationDiv = createStyledConfirmation(data);

    confirmationDiv.style.position = 'fixed';
    confirmationDiv.style.left = '50%';
    confirmationDiv.style.top = '50%';
    confirmationDiv.style.transform = 'translate(-50%, -50%)';
    confirmationDiv.style.zIndex = 9999;
    document.body.appendChild(confirmationDiv);

    html2canvas(confirmationDiv, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#FFFFFF"
    }).then(canvas => {
        const link = document.createElement('a');
        link.download = 'Sadhana Booking Confirmation Slip.jpg';
        link.href = canvas.toDataURL('image/jpeg', 0.92);
        link.click();

        document.body.removeChild(confirmationDiv);
    }).catch(err => {
        console.error('html2canvas error:', err);
        if (confirmationDiv.parentNode) confirmationDiv.parentNode.removeChild(confirmationDiv);
    });
}

// Show success message
function showSuccessMessage() {
    const successDiv = document.createElement('div');
    successDiv.className = 'status-message status-success';
    successDiv.innerHTML = `
        <h3 style="color: #506C4A; margin-bottom: 10px;">✓ Booking Successfully Submitted!</h3>
        <p>Your booking confirmation has been downloaded. We look forward to welcoming you to Sadhana Yoga Retreat!</p>
    `;

    const bookingForm = document.getElementById('bookingForm');
    bookingForm.parentNode.insertBefore(successDiv, bookingForm.nextSibling);

    setTimeout(() => {
        successDiv.remove();
    }, 5000);
}

// Handle booking submission
async function handleBookingSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const bookingCode = Math.floor(1000000 + Math.random() * 9000000);

    const data = {
        guest_name: form.guest_name.value,
        country: form.country.value,
        email: form.email.value,
        phone: document.getElementById('phone').value,
        package: form.package.value,
        room_type: form.room_type.value,
        price: document.getElementById('price').value,
        arrival_date: form.arrival_date.value,
        departure_date: form.departure_date.value,
        remarks: form.remarks.value,
        booking_code: bookingCode,
        timestamp: new Date().toISOString()
    };

    try {
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = "Submitting...";
        submitBtn.disabled = true;

        const response = await fetch(scriptURL, {
            method: "POST",
            headers: {
                "Content-Type": "text/plain;charset=UTF-8"
            },
            body: JSON.stringify(data)
        });

        const responseText = await response.text();

        if (response.ok) {
            downloadConfirmationAsImage(data);
            showSuccessMessage();
            form.reset();

            const roomSelect = document.getElementById("roomType");
            if (roomSelect) {
                roomSelect.innerHTML = "<option value='' disabled selected>Select Room Type</option>";
            }

            const priceInput = document.getElementById("price");
            const priceDisplay = document.getElementById("priceDisplay");
            if (priceInput && priceDisplay) {
                priceInput.value = "";
                priceDisplay.textContent = "$0";
            }
        } else {
            throw new Error('Failed to submit booking. Server returned status ' + response.status + ': ' + responseText);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to submit booking. Check console for details.(' + (error.message || error) + ')');
    } finally {
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.textContent = "Submit Booking";
            submitBtn.disabled = false;
        }
    }
}

// Admin: fetch bookings
async function loadAdminData() {
    try {
        const response = await fetch(scriptURL);
        const bookings = await response.json();

        if (Array.isArray(bookings)) {
            updateDashboardCards(bookings);
            renderTables(bookings);
        } else {
            console.error('Invalid data format received:', bookings);
        }
    } catch (error) {
        console.error('Error loading admin data:', error);
    }
}

// Update dashboard cards
function updateDashboardCards(bookings) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    function parseSheetDate(dateStr) {
        if (!dateStr) return null;
        const date = new Date(dateStr);
        return isNaN(date.getTime()) ? null : date;
    }

    // Arriving today
    const arrivingToday = bookings.filter(b => {
        const arrivalDate = parseSheetDate(b['Arrival Date'] || b['Arrival date'] || b['Arrival date ']);
        if (!arrivalDate) return false;
        arrivalDate.setHours(0, 0, 0, 0);
        return arrivalDate.getTime() === today.getTime();
    });

    // Departing today
    const departingToday = bookings.filter(b => {
        const departureDate = parseSheetDate(b['Departure Date'] || b['Departure date'] || b['Departure date ']);
        if (!departureDate) return false;
        departureDate.setHours(0, 0, 0, 0);
        return departureDate.getTime() === today.getTime();
    }).length;

    // Weekly bookings (next 7 days)
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    const weeklyBookings = bookings.filter(b => {
        const arrivalDate = parseSheetDate(b['Arrival Date'] || b['Arrival date'] || b['Arrival date ']);
        if (!arrivalDate) return false;
        return arrivalDate >= today && arrivalDate <= nextWeek;
    }).length;

    // Monthly estimate (completed bookings this month)
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const monthlyEstimate = bookings
        .filter(b => {
            const departureDate = parseSheetDate(b['Departure Date'] || b['Departure date'] || b['Departure date ']);
            if (!departureDate) return false;
            return departureDate >= firstDayOfMonth && departureDate <= today;
        })
        .reduce((total, b) => {
            const priceStr = b['Price'] || b[' price'] || '0';
            const price = parseFloat(priceStr.toString().replace("$", "")) || 0;
            return total + price;
        }, 0);

    // Update dashboard cards
    const arrivingTodayEl = document.getElementById("arrivingToday");
    const departingTodayEl = document.getElementById("departingToday");
    const weeklyBookingsEl = document.getElementById("weeklyBookings");
    const monthlyEstimateEl = document.getElementById("monthlyEstimate");

    if (arrivingTodayEl) arrivingTodayEl.textContent = arrivingToday.length;
    if (departingTodayEl) departingTodayEl.textContent = departingToday;
    if (weeklyBookingsEl) weeklyBookingsEl.textContent = weeklyBookings;
    if (monthlyEstimateEl) monthlyEstimateEl.textContent = "$" + monthlyEstimate;

    // Render arriving today table
    const arrivingTodayTbody = document.querySelector("#arrivingTodayTable tbody");
    if (arrivingTodayTbody) {
        arrivingTodayTbody.innerHTML = "";

        arrivingToday.forEach(b => {
            const phoneRaw = b['Whatsapp/ Phone ( with country code )'] || b['WhatsApp / Phone'] || b['WhatsApp / Phone '] || b['WhatsApp / Phone'] || b['Phone'] || b['phone'] || b['WhatsApp'] || '';
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${b['Guest Name'] || b['Guest'] || ''}</td>
                <td>${b['Retreat Package'] || b['Retreat Package '] || b['Retreat Package'] || ''}</td>
                <td>${phoneRaw ? `<a class="whatsapp-link" href="${phoneRaw}" target="_blank" rel="noopener noreferrer">WhatsApp</a>` : ''}</td>
                <td>${formatDate(b['Arrival Date'] || b['Arrival date'] || b['Arrival date '])}</td>
                <td>${formatDate(b['Departure Date'] || b['Departure date'] || b['Departure date '])}</td>
                <td>${b['Price'] || ''}</td>
            `;
            arrivingTodayTbody.appendChild(tr);
        });
    }
}

function renderTables(bookings) {
    const now = new Date();

    function parseSheetDate(dateStr) {
        if (!dateStr) return new Date(0);
        const date = new Date(dateStr);
        return isNaN(date.getTime()) ? new Date(0) : date;
    }

    // Filter upcoming bookings
    const upcoming = bookings
        .filter(b => {
            const arrivalDate = parseSheetDate(b['Arrival Date'] || b['Arrival date'] || b['Arrival date ']);
            return arrivalDate >= now;
        })
        .sort((a, b) => {
            const dateA = parseSheetDate(a['Arrival Date'] || a['Arrival date'] || a['Arrival date ']);
            const dateB = parseSheetDate(b['Arrival Date'] || b['Arrival date'] || b['Arrival date ']);
            return dateA - dateB;
        });

    // Render upcoming bookings table
    const upcomingTbody = document.querySelector("#upcomingTable tbody");
    if (upcomingTbody) {
        upcomingTbody.innerHTML = "";

        upcoming.forEach(b => {
            const phoneRaw = b['Whatsapp/ Phone ( with country code )'] || b['WhatsApp / Phone'] || b['WhatsApp / Phone '] || b['WhatsApp / Phone'] || b['Phone'] || b['phone'] || b['WhatsApp'] || '';
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${b['Guest Name'] || ''}</td>
                <td>${b['Retreat Package'] || b['Retreat Package '] || ''}</td>
                <td>${phoneRaw ? `<a class="whatsapp-link" href="${phoneRaw}" target="_blank" rel="noopener noreferrer">WhatsApp</a>` : ''}</td>
                <td>${formatDate(b['Arrival Date'] || b['Arrival date'] || b['Arrival date '])}</td>
                <td>${formatDate(b['Departure Date'] || b['Departure date'] || b['Departure date '])}</td>
                <td>${b['Price'] || ''}</td>
            `;
            upcomingTbody.appendChild(tr);
        });
    }

    // Render all bookings table
    const allTbody = document.querySelector("#allBookingsTable tbody");
    if (allTbody) {
        allTbody.innerHTML = "";

        bookings.forEach(b => {
            const phoneRaw = b['Whatsapp/ Phone ( with country code )'] || b['WhatsApp / Phone'] || b['WhatsApp / Phone '] || b['WhatsApp / Phone'] || b['Phone'] || b['phone'] || b['WhatsApp'] || '';
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${b['Guest Name'] || ''}</td>
                <td>${b['Retreat Package'] || b['Retreat Package '] || ''}</td>
                <td>${phoneRaw ? `<a class="whatsapp-link" href="${phoneRaw}" target="_blank" rel="noopener noreferrer">WhatsApp</a>` : ''}</td>
                <td>${formatDate(b['Arrival Date'] || b['Arrival date'] || b['Arrival date '])}</td>
                <td>${formatDate(b['Departure Date'] || b['Departure date'] || b['Departure date '])}</td>
                <td>${b['Price'] || ''}</td>
            `;
            allTbody.appendChild(tr);
        });
    }
}

// Search and sort functionality
function setupSearchAndSort() {
    // Search functionality
    const upcomingSearch = document.getElementById("upcomingSearch");
    const allBookingsSearch = document.getElementById("allBookingsSearch");

    if (upcomingSearch) {
        upcomingSearch.addEventListener("input", () => {
            filterTable("upcomingTable", upcomingSearch.value);
        });
    }

    if (allBookingsSearch) {
        allBookingsSearch.addEventListener("input", () => {
            filterTable("allBookingsTable", allBookingsSearch.value);
        });
    }

    // Clear search buttons
    const clearUpcomingSearch = document.getElementById("clearUpcomingSearch");
    const clearAllSearch = document.getElementById("clearAllSearch");

    if (clearUpcomingSearch) {
        clearUpcomingSearch.addEventListener("click", () => {
            if (upcomingSearch) upcomingSearch.value = "";
            filterTable("upcomingTable", "");
        });
    }

    if (clearAllSearch) {
        clearAllSearch.addEventListener("click", () => {
            if (allBookingsSearch) allBookingsSearch.value = "";
            filterTable("allBookingsTable", "");
        });
    }

    // Sort functionality
    document.querySelectorAll("th[data-sort]").forEach(th => {
        th.addEventListener("click", () => {
            const tableId = th.closest("table").id;
            const sortKey = th.getAttribute("data-sort");
            sortTable(tableId, sortKey);
        });
    });
}

function filterTable(tableId, searchTerm) {
    const table = document.getElementById(tableId);
    if (!table) return;

    const rows = table.querySelectorAll("tbody tr");
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm.toLowerCase()) ? "" : "none";
    });
}

function sortTable(tableId, sortKey) {
    const table = document.getElementById(tableId);
    if (!table) return;

    const tbody = table.querySelector("tbody");
    const rows = Array.from(tbody.querySelectorAll("tr"));

    const fieldMap = {
        "guest_name": 0,
        "package": 1,
        "whatsapp": 2,
        "arrival_date": 3,
        "departure_date": 4,
        "price": 5
    };

    const columnIndex = fieldMap[sortKey];

    rows.sort((a, b) => {
        const aValue = a.cells[columnIndex].textContent;
        const bValue = b.cells[columnIndex].textContent;

        if (sortKey.includes("date")) {
            return new Date(aValue) - new Date(bValue);
        }

        if (sortKey === "price") {
            const aNum = parseFloat(aValue.replace("$", "")) || 0;
            const bNum = parseFloat(bValue.replace("$", "")) || 0;
            return aNum - bNum;
        }

        return aValue.localeCompare(bValue);
    });

    tbody.innerHTML = "";
    rows.forEach(row => tbody.appendChild(row));
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);