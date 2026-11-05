(() => {
  const ACCOUNTS_KEY = "wanderly-demo-accounts-v1";
  const SESSION_KEY = "wanderly-demo-session-v1";
  // This fixed seed is for demonstrations only. Never use client-side roles for real authorization.
  const DEMO_ADMIN = {
    id: "wanderly-demo-admin",
    fullName: "Wanderly Demo Admin",
    email: "admin@wanderly.demo",
    passwordHash: "d5c23a63521447eade7d67e59340d297e63d2961e7897b6708a03d2cb0181575",
    role: "admin",
    createdAt: "2026-01-01T00:00:00.000Z"
  };

  function readAccounts() {
    try {
      const rawValue = localStorage.getItem(ACCOUNTS_KEY);
      const stored = JSON.parse(rawValue || "[]");
      const accounts = Array.isArray(stored)
        ? stored.filter((account) => account && typeof account.id === "string" && typeof account.fullName === "string" && typeof account.email === "string" && typeof account.passwordHash === "string")
        .map((account) => account.id === DEMO_ADMIN.id && account.email === DEMO_ADMIN.email
          ? { ...DEMO_ADMIN }
          : { id: account.id, fullName: account.fullName, email: account.email, passwordHash: account.passwordHash, role: "user", createdAt: typeof account.createdAt === "string" ? account.createdAt : "" })
        : [];
      if (!accounts.some((account) => account.id === DEMO_ADMIN.id && account.email === DEMO_ADMIN.email)) accounts.push({ ...DEMO_ADMIN });
      if (JSON.stringify(accounts) !== rawValue) localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
      return accounts;
    } catch (error) {
      return [{ ...DEMO_ADMIN }];
    }
  }

  function readSession() {
    try {
      const session = JSON.parse(sessionStorage.getItem(SESSION_KEY) || "null");
      return session && typeof session.userId === "string" ? session : null;
    } catch (error) {
      try { sessionStorage.removeItem(SESSION_KEY); } catch (storageError) { /* Keep the invalid session unusable. */ }
      return null;
    }
  }

  function activeUser() {
    const session = readSession();
    if (!session) return null;
    const user = readAccounts().find((account) => account.id === session.userId && account.email === session.email);
    if (!user) {
      try { sessionStorage.removeItem(SESSION_KEY); } catch (error) { /* The session still fails the account check. */ }
    }
    return user || null;
  }

  function updateNavigation() {
    const user = activeUser();
    document.querySelectorAll("[data-auth-link]").forEach((link) => {
      const kind = link.dataset.authLink;
      const visible = user ? kind === "account" || (kind === "admin" && user.role === "admin") : kind === "login" || kind === "register";
      link.hidden = !visible;
      if (visible && ((kind === "login" && location.pathname.endsWith("login.html")) || (kind === "register" && location.pathname.endsWith("register.html")) || (kind === "account" && location.pathname.endsWith("account.html")) || (kind === "admin" && location.pathname.endsWith("admin.html")))) {
        link.classList.add("active");
        link.setAttribute("aria-current", "page");
      }
    });
  }

  // The same responsive navigation appears on every customer-facing page.
  const menuButton = document.querySelector(".menu-toggle");
  const primaryNav = document.querySelector(".primary-nav");
  if (menuButton && primaryNav) {
    menuButton.addEventListener("click", () => {
      const isOpen = menuButton.getAttribute("aria-expanded") === "true";
      menuButton.setAttribute("aria-expanded", String(!isOpen));
      menuButton.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
      primaryNav.classList.toggle("open", !isOpen);
    });

    primaryNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.setAttribute("aria-label", "Open navigation");
        primaryNav.classList.remove("open");
      });
    });
  }

  async function hashPassword(password) {
    if (!window.crypto?.subtle || !window.isSecureContext) {
      throw new Error("Secure Web Crypto is unavailable. Open Wanderly through HTTPS or localhost to use the authentication demo.");
    }
    const bytes = new TextEncoder().encode(password);
    const digest = await window.crypto.subtle.digest("SHA-256", bytes);
    return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
  }

  function createId() {
    return window.crypto?.randomUUID ? window.crypto.randomUUID() : `user-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  function clearSession() {
    try { sessionStorage.removeItem(SESSION_KEY); } catch (error) { /* Continue to the logged-out view. */ }
    updateNavigation();
  }

  window.WanderlyAuth = { readAccounts, activeUser, hashPassword, createId, ACCOUNTS_KEY, SESSION_KEY, updateNavigation, clearSession, DEMO_ADMIN_ID: DEMO_ADMIN.id };
  updateNavigation();
})();
