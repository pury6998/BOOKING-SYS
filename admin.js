const API = "YOUR_WEB_APP_URL";

async function loadBookings() {
    let res = await fetch(API + "?action=getBookings");
    let list = await res.json();

    let tbody = document.getElementById("tbody");
    tbody.innerHTML = "";

    list.forEach(b => {
        tbody.innerHTML += `
        <tr>
            <td><input id="name-${b.id}" value="${b.name}"></td>
            <td><input id="email-${b.id}" value="${b.email}"></td>
            <td><input id="date-${b.id}" type="date" value="${b.date}"></td>
            <td><input id="service-${b.id}" value="${b.service}"></td>

            <td>
                <button onclick="updateBooking(${b.id})">Update</button>
                <button onclick="deleteBooking(${b.id})">Delete</button>
            </td>
        </tr>
        `;
    });
}
loadBookings();

async function updateBooking(id) {
    let data = new URLSearchParams();
    data.append("action", "updateBooking");
    data.append("id", id);
    data.append("name", document.getElementById(`name-${id}`).value);
    data.append("email", document.getElementById(`email-${id}`).value);
    data.append("date", document.getElementById(`date-${id}`).value);
    data.append("service", document.getElementById(`service-${id}`).value);

    await fetch(API, { method: "POST", body: data });
    loadBookings();
}

async function deleteBooking(id) {
    let data = new URLSearchParams();
    data.append("action", "deleteBooking");
    data.append("id", id);

    await fetch(API, { method: "POST", body: data });
    loadBookings();
}
