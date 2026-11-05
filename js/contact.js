(() => {
  const STORAGE_KEY = "wanderly-contact-messages-v1";
  const form = document.querySelector("#contact-form");
  if (!form) return;

  const status = document.querySelector("#contact-form-status");
  const fields = [
    { input: document.querySelector("#contact-name"), error: document.querySelector("#contact-name-error"), requiredMessage: "Enter your full name." },
    { input: document.querySelector("#contact-email"), error: document.querySelector("#contact-email-error"), requiredMessage: "Enter your email address." },
    { input: document.querySelector("#contact-subject"), error: document.querySelector("#contact-subject-error"), requiredMessage: "Enter a subject." },
    { input: document.querySelector("#contact-type"), error: document.querySelector("#contact-type-error"), requiredMessage: "Choose an inquiry type." },
    { input: document.querySelector("#contact-message"), error: document.querySelector("#contact-message-error"), requiredMessage: "Write a short message." }
  ];

  function clearError(field) {
    field.error.textContent = "";
    field.input.removeAttribute("aria-invalid");
  }

  function validateField(field) {
    const value = field.input.value.trim();
    let message = "";
    if (!value) message = field.requiredMessage;
    else if (field.input.type === "email" && !field.input.validity.valid) message = "Enter a valid email address, such as you@example.com.";
    else if (field.input.id === "contact-message" && value.length < 10) message = "Please add a little more detail (at least 10 characters).";

    field.error.textContent = message;
    field.input.setAttribute("aria-invalid", String(Boolean(message)));
    return !message;
  }

  function readMessages() {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      return Array.isArray(stored) ? stored.filter((item) => item && typeof item === "object" && !Array.isArray(item)) : [];
    } catch (error) {
      return [];
    }
  }

  fields.forEach((field) => {
    field.input.addEventListener("input", () => { if (field.error.textContent) validateField(field); });
    field.input.addEventListener("change", () => { if (field.error.textContent) validateField(field); });
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    status.textContent = "";
    status.classList.remove("success", "error");
    const valid = fields.map(validateField).every(Boolean);
    if (!valid) {
      fields.find((field) => field.error.textContent)?.input.focus();
      return;
    }

    const message = {
      id: `contact-${Date.now()}`,
      name: document.querySelector("#contact-name").value.trim(),
      email: document.querySelector("#contact-email").value.trim(),
      subject: document.querySelector("#contact-subject").value.trim(),
      type: document.querySelector("#contact-type").value,
      message: document.querySelector("#contact-message").value.trim(),
      createdAt: new Date().toISOString()
    };

    try {
      const savedMessages = readMessages();
      savedMessages.push(message);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedMessages));
    } catch (error) {
      status.textContent = "This browser could not save the demo message. Check local storage settings and try again.";
      status.classList.add("error");
      return;
    }

    form.reset();
    fields.forEach(clearError);
    status.textContent = "Your demo message was saved in this browser. It was not sent to Wanderly.";
    status.classList.add("success");
  });

  const year = document.querySelector("#current-year");
  if (year) year.textContent = new Date().getFullYear();
})();
