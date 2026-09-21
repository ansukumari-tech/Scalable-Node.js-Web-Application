const form = document.getElementById("registerForm");
const message = document.getElementById("message");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();

    if (data.success) {
      message.textContent = data.message;
      message.className = "message success";
      form.reset();
    } else {
      message.textContent = data.message;
      message.className = "message error";
    }
  } catch (error) {
    message.textContent = "Unable to reach the server. Please try again.";
    message.className = "message error";
  }
});
