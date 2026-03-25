// ================= SCROLL REVEAL =================
function reveal() {
  const reveals = document.querySelectorAll(".reveal");
  const windowHeight = window.innerHeight;
  const elementVisible = 120;

  reveals.forEach(el => {
    const elementTop = el.getBoundingClientRect().top;

    if (elementTop < windowHeight - elementVisible && elementTop > -el.offsetHeight) {
      el.classList.add("active");
    } else {
      el.classList.remove("active");
    }
  });
}

window.addEventListener("scroll", reveal);
window.addEventListener("load", reveal);


// ================= MAIN APP =================
document.addEventListener("DOMContentLoaded", () => {

  const contactSection = document.querySelector("#contact");

  if (!contactSection) {
    console.warn("Contact section not found");
    return;
  }

  const nameInput = contactSection.querySelector("input[type='text']");
  const emailInput = contactSection.querySelector("input[type='email']");
  const messageInput = contactSection.querySelector("textarea");
  const sendButton = contactSection.querySelector("button");

  if (!nameInput || !emailInput || !messageInput || !sendButton) {
    console.warn("Form elements missing");
    return;
  }

  // ✅ FIXED: async function added
  sendButton.addEventListener("click", async (e) => {
    e.preventDefault();

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const message = messageInput.value.trim();

    // ---------- VALIDATION ----------
    if (!name || !email || !message) {
      alert("Please fill all fields ❗");
      return;
    }

    const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,}$/i;
    if (!emailPattern.test(email)) {
      alert("Enter a valid email ❗");
      return;
    }

    // ---------- BUTTON LOADING ----------
    sendButton.innerText = "Sending...";
    sendButton.disabled = true;

    try {
      // ✅ REAL BACKEND CALL (works on Render)
      const res = await fetch("/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: name,
          email: email,
          message: message
        })
      });

      const data = await res.json();

      if (data.success) {
        alert("Message sent successfully ✅");

        // Clear form
        nameInput.value = "";
        emailInput.value = "";
        messageInput.value = "";
      } else {
        alert("Failed to send message ❌");
      }

    } catch (err) {
      console.error(err);
      alert("Server error ❌");
    }

    // Reset button
    sendButton.innerText = "Send Message";
    sendButton.disabled = false;
  });

});