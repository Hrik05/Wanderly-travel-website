(() => {
  const auth = window.WanderlyAuth;
  const form = document.querySelector("#login-form");
  const email = document.querySelector("#login-email");
  const password = document.querySelector("#login-password");
  const status = document.querySelector("#login-status");
  const submitButton = form.querySelector('button[type="submit"]');
  let isSubmitting = false;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (isSubmitting) return;
    status.textContent = "";
    status.className = "auth-status";
    const emailValue = email.value.trim().toLowerCase();
    let valid = true;
    document.querySelector("#login-email-error").textContent = "";
    document.querySelector("#login-password-error").textContent = "";
    if (!emailValue) { document.querySelector("#login-email-error").textContent = "Enter your email address."; valid = false; }
    else if (!email.validity.valid) { document.querySelector("#login-email-error").textContent = "Enter a valid email address."; valid = false; }
    if (!password.value) { document.querySelector("#login-password-error").textContent = "Enter your password."; valid = false; }
    if (!valid) { (!emailValue || !email.validity.valid ? email : password).focus(); return; }

    isSubmitting = true;
    submitButton.disabled = true;
    status.textContent = "Checking your demo account…";
    try {
      const passwordHash = await auth.hashPassword(password.value);
      const user = auth.readAccounts().find((account) => account.email.toLowerCase() === emailValue && account.passwordHash === passwordHash);
      if (!user) {
        status.textContent = "We couldn’t match that email and password. Check your details or create a demo account.";
        status.classList.add("error");
        password.focus();
        return;
      }
      sessionStorage.setItem(auth.SESSION_KEY, JSON.stringify({ userId: user.id, email: user.email, loggedInAt: new Date().toISOString() }));
      status.textContent = "Signed in. Opening your account…";
      status.classList.add("success");
      const requestedPage = new URLSearchParams(window.location.search).get("next");
      window.location.assign(user.role === "admin" && requestedPage === "admin" ? "admin.html" : "account.html");
    } catch (error) {
      status.textContent = error.message || "This browser could not check the demo account.";
      status.classList.add("error");
    } finally {
      isSubmitting = false;
      submitButton.disabled = false;
    }
  });

  const year = document.querySelector("#current-year");
  if (year) year.textContent = new Date().getFullYear();
})();
