(() => {
  const auth = window.WanderlyAuth;
  const form = document.querySelector("#register-form");
  const status = document.querySelector("#register-status");
  const nameInput = document.querySelector("#register-name");
  const emailInput = document.querySelector("#register-email");
  const passwordInput = document.querySelector("#register-password");
  const confirmInput = document.querySelector("#register-confirm-password");
  const termsInput = document.querySelector("#register-terms");
  const fields = [
    { input: nameInput, error: document.querySelector("#register-name-error"), message: "Enter your full name." },
    { input: emailInput, error: document.querySelector("#register-email-error"), message: "Enter a valid email address." },
    { input: passwordInput, error: document.querySelector("#register-password-error"), message: "Create a password with at least 8 characters." },
    { input: confirmInput, error: document.querySelector("#register-confirm-error"), message: "Confirm your password." },
    { input: termsInput, error: document.querySelector("#register-terms-error"), message: "Please accept the demo terms to continue." }
  ];
  const submitButton = form.querySelector('button[type="submit"]');
  let isSubmitting = false;

  function validate(field) {
    const value = field.input.type === "checkbox" ? field.input.checked : field.input.value.trim();
    let message = "";
    if (!value) message = field.message;
    else if (field.input === emailInput && !field.input.validity.valid) message = "Enter a valid email address.";
    else if (field.input === passwordInput && field.input.value.length < 8) message = "Use at least 8 characters for your password.";
    else if (field.input === confirmInput && field.input.value !== passwordInput.value) message = "Your passwords do not match.";
    field.error.textContent = message;
    field.input.setAttribute("aria-invalid", String(Boolean(message)));
    return !message;
  }

  fields.forEach((field) => {
    field.input.addEventListener(field.input.type === "checkbox" ? "change" : "input", () => { if (field.error.textContent) validate(field); });
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (isSubmitting) return;
    status.textContent = "";
    status.className = "auth-status";
    if (!fields.map(validate).every(Boolean)) {
      fields.find((field) => field.error.textContent)?.input.focus();
      return;
    }

    isSubmitting = true;
    submitButton.disabled = true;
    const email = emailInput.value.trim().toLowerCase();
    let accounts;
    try {
      accounts = auth.readAccounts();
      if (accounts.some((account) => account.email.toLowerCase() === email)) {
        document.querySelector("#register-email-error").textContent = "An account already uses this email. Try logging in instead.";
        emailInput.setAttribute("aria-invalid", "true");
        emailInput.focus();
        return;
      }
      status.textContent = "Creating your demo account…";
      const passwordHash = await auth.hashPassword(passwordInput.value);
      const account = { id: auth.createId(), fullName: nameInput.value.trim(), email, passwordHash, role: "user", createdAt: new Date().toISOString() };
      accounts.push(account);
      localStorage.setItem(auth.ACCOUNTS_KEY, JSON.stringify(accounts));
    } catch (error) {
      status.textContent = error.message || "This browser could not save your demo account. Check local storage settings and try again.";
      status.classList.add("error");
    } finally {
      isSubmitting = false;
      submitButton.disabled = false;
    }

    if (status.classList.contains("error") || document.querySelector("#register-email-error").textContent) return;

    form.reset();
    fields.forEach((field) => { field.error.textContent = ""; field.input.removeAttribute("aria-invalid"); });
    status.textContent = "Your demo account is ready. You can now log in.";
    status.classList.add("success");
  });

  const year = document.querySelector("#current-year");
  if (year) year.textContent = new Date().getFullYear();
})();
