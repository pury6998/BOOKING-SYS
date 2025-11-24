const API = "YOUR_WEB_APP_URL";

document.getElementById("bookingForm").addEventListener("submit", async e => {
    e.preventDefault();

    let formData = new URLSearchParams();
    formData.append("action", "book");
    formData.append("name", name.value);
    formData.append("email", email.value);
    formData.append("date", date.value);
    formData.append("service", service.value);

    let res = await fetch(API, {
        method: "POST",
        body: formData
    });

    let out = await res.json();
    if (out.success) alert("Booked Successfully!");
});
