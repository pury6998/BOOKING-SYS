// Load header/footer
async function loadAdminComponents() {
    document.getElementById("header").innerHTML = await fetch("/components/header.html").then(r => r.text());
    document.getElementById("footer").innerHTML = await fetch("/components/footer.html").then(r => r.text());
    fetchBookings();
}

async function fetchBookings() {
    try {
        const res = await fetch("YOUR_APPS_SCRIPT_URL?action=getBookings");
        const bookings = await res.json();

        let html = `<table border="1">
      <tr><th>Name</th><th>Email</th><th>Phone</th><th>Check-in</th><th>Check-out</th><th>Delete</th></tr>`;

        bookings.forEach(b => {
            html += `<tr>
        <td>${b.name}</td>
        <td>${b.email}</td>
        <td>${b.phone}</td>
        <td>${b.checkin}</td>
        <td>${b.checkout}</td>
        <td><button onclick="deleteBooking('${b.id}')">Delete</button></td>
      </tr>`;
        });

        html += "</table>";
        document.getElementById("bookings-table").innerHTML = html;
    } catch (err) {
        console.error(err);
        document.getElementById("bookings-table").innerText = "Failed to fetch bookings!";
    }
}

async function deleteBooking(id) {
    try {
        await fetch("https://script.google.com/macros/s/AKfycbw7o-C-kwTllllZt_Trz4WCXf3uKyAR2ZP_D7u801eiylxtbWLqW_RYLC1nyNqxjLuBSw/exec", {
            method: "POST",
            body: JSON.stringify({ id })
        });
        fetchBookings(); // refresh
    } catch (err) {
        console.error(err);
    }
}

loadAdminComponents();
