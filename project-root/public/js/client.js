// Load components
async function loadComponents() {
  document.getElementById("header").innerHTML = await fetch("/components/header.html").then(r=>r.text());
  document.getElementById("footer").innerHTML = await fetch("/components/footer.html").then(r=>r.text());
  document.getElementById("form-container").innerHTML = await fetch("/components/booking-form.html").then(r=>r.text());
  initForm();
}

function initForm() {
  const form = document.getElementById("booking-form");
  form.addEventListener("submit", async e => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch("https://script.google.com/macros/s/AKfycbw7o-C-kwTllllZt_Trz4WCXf3uKyAR2ZP_D7u801eiylxtbWLqW_RYLC1nyNqxjLuBSw/exec", {
        method: "POST",
        body: JSON.stringify(data)
      });
      const result = await res.text();
      document.getElementById("form-message").innerText = result;
      form.reset();
    } catch (err) {
      document.getElementById("form-message").innerText = "Error submitting booking!";
      console.error(err);
    }
  });
}

loadComponents();
