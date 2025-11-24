function showPage(pageId) {
    document.querySelectorAll(".page").forEach(p => p.classList.add("hidden"));
    document.getElementById(pageId).classList.remove("hidden");
}

/* REGISTER */
document.getElementById("registerForm").addEventListener("submit", function (e) {
    e.preventDefault();

    let user = document.getElementById("regUser").value;
    let pass = document.getElementById("regPass").value;

    localStorage.setItem("user", user);
    localStorage.setItem("pass", pass);

    alert("Registration successful!");
    showPage("loginPage");
});

/* LOGIN */
document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault();

    let user = document.getElementById("loginUser").value;
    let pass = document.getElementById("loginPass").value;

    if (user === localStorage.getItem("user") && pass === localStorage.getItem("pass")) {
        showPage("bookingPage");
    } else {
        alert("Invalid credentials!");
    }
});

/* BOOKING */
document.getElementById("bookingForm").addEventListener("submit", function (e) {
    e.preventDefault();
    alert("Booking Successful!");
});

/* LOGOUT */
function logout() {
    showPage("loginPage");
}
