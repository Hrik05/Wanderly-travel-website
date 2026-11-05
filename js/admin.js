(() => {
  const auth = window.WanderlyAuth;
  const user = auth?.activeUser();
  if (!user || user.role !== "admin") {
    window.location.replace(user ? "account.html" : "login.html?next=admin");
    return;
  }

  const PACKAGE_KEY = "wanderly-admin-packages-v1";
  const BOOKING_KEY = "wanderly-demo-bookings-v1";
  const app = document.querySelector("#admin-app");
  const dialog = document.querySelector("#package-dialog");
  const form = document.querySelector("#package-form");
  const feedback = document.querySelector("#admin-feedback");
  const toast = document.querySelector("#admin-toast");
  const destinations = { Kyoto: "Japan", "Amalfi Coast": "Italy", Marrakech: "Morocco" };
  const demoBookings = [
    { id: "demo-package-001", reference: "DEMO-0318", customerName: "Avery Morgan", type: "Tour Package", item: "Kyoto, at your own pace", date: "2026-10-21", status: "Requested", source: "demo" },
    { id: "demo-hotel-002", reference: "DEMO-0284", customerName: "Jordan Ellis", type: "Hotel", item: "Vista di Amalfi · Amalfi Coast", date: "2026-10-13", status: "In review", source: "demo" },
    { id: "demo-flight-003", reference: "DEMO-0207", customerName: "Riley Chen", type: "Flight", item: "Kolkata → Kyoto", date: "2026-09-30", status: "Cancelled", source: "demo" }
  ];

  let accounts = auth.readAccounts();
  let packages = Array.isArray(window.WANDERLY_PACKAGES) ? [...window.WANDERLY_PACKAGES] : [];
  let bookings = readBookings();
  let toastTimer;
  let lastActiveElement;

  document.querySelector("#admin-name").textContent = user.fullName;
  document.querySelector("#admin-initials").textContent = user.fullName.split(/\s+/).map((part) => part[0]).slice(0, 2).join("").toUpperCase();
  app.hidden = false;

  function readBookings() {
    try {
      const raw = localStorage.getItem(BOOKING_KEY);
      if (raw === null) return demoBookings.map((booking) => ({ ...booking }));
      const saved = JSON.parse(raw);
      return Array.isArray(saved) ? saved.filter((booking) => booking && typeof booking.id === "string" && typeof booking.reference === "string" && typeof booking.customerName === "string" && typeof booking.type === "string" && typeof booking.item === "string" && typeof booking.date === "string" && typeof booking.status === "string") : demoBookings.map((booking) => ({ ...booking }));
    } catch (error) {
      return demoBookings.map((booking) => ({ ...booking }));
    }
  }

  function saveBookings() {
    try { localStorage.setItem(BOOKING_KEY, JSON.stringify(bookings)); return true; }
    catch (error) { showFeedback("The browser could not save booking changes. Check local storage settings.", true); return false; }
  }

  function savePackages() {
    try {
      localStorage.setItem(PACKAGE_KEY, JSON.stringify(packages));
      window.WANDERLY_PACKAGES = packages;
      return true;
    } catch (error) {
      showFeedback("The browser could not save the package catalog. Check local storage settings.", true);
      return false;
    }
  }

  function showFeedback(message, isError = false) {
    feedback.textContent = message;
    feedback.classList.toggle("error", isError);
    feedback.classList.toggle("success", !isError);
  }

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("visible");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove("visible"), 3200);
  }

  function createCell(text, className = "") {
    const cell = document.createElement("td");
    if (className) cell.className = className;
    cell.textContent = text;
    return cell;
  }

  function formatDate(value) {
    const date = new Date(`${value}T12:00:00`);
    return Number.isNaN(date.getTime()) ? "—" : date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
  }

  function formatPrice(price) { return `$${Number(price).toLocaleString("en-US")}`; }

  function makeAction(label, action, id, disabled = false) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `admin-row-action ${action.startsWith("delete-") ? "is-danger" : ""}`;
    button.textContent = label;
    button.dataset.action = action;
    button.dataset.id = id;
    button.disabled = disabled;
    if (disabled) button.title = "You cannot delete the administrator account you are currently using.";
    return button;
  }

  function renderStats() {
    document.querySelector("#stat-users").textContent = accounts.length;
    document.querySelector("#stat-packages").textContent = packages.length;
    document.querySelector("#stat-bookings").textContent = bookings.length;
  }

  function renderRecentBookings() {
    const body = document.querySelector("#recent-bookings-body");
    const recent = [...bookings].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);
    body.replaceChildren();
    recent.forEach((booking) => {
      const row = document.createElement("tr");
      row.append(createCell(booking.reference, "admin-reference-cell"), createCell(booking.customerName), createCell(booking.type), createCell(booking.item), createCell(formatDate(booking.date)), statusCell(booking.status));
      body.append(row);
    });
    document.querySelector("#recent-bookings-empty").hidden = recent.length > 0;
  }

  function renderUsers() {
    const query = document.querySelector("#user-search").value.trim().toLowerCase();
    const role = document.querySelector("#user-role-filter").value;
    const results = accounts.filter((account) => (!role || account.role === role) && (!query || `${account.fullName} ${account.email}`.toLowerCase().includes(query)));
    const body = document.querySelector("#users-table-body");
    body.replaceChildren();
    results.forEach((account) => {
      const row = document.createElement("tr");
      const roleCell = document.createElement("td");
      const badge = document.createElement("span"); badge.className = `admin-role-badge ${account.role === "admin" ? "is-admin" : ""}`; badge.textContent = account.role === "admin" ? "Administrator" : "Traveler"; roleCell.append(badge);
      const actions = document.createElement("td"); actions.append(makeAction("Delete", "delete-user", account.id, account.id === user.id));
      const createdAt = typeof account.createdAt === "string" ? account.createdAt.slice(0, 10) : "";
      row.append(createCell(account.fullName), createCell(account.email), createCell(formatDate(createdAt)), roleCell, actions);
      body.append(row);
    });
    document.querySelector("#users-count").textContent = `${accounts.length} ${accounts.length === 1 ? "account" : "accounts"}`;
    document.querySelector("#users-empty").hidden = results.length > 0;
  }

  function renderPackages() {
    const query = document.querySelector("#package-search").value.trim().toLowerCase();
    const destination = document.querySelector("#package-destination-filter").value;
    const results = packages.filter((trip) => (!destination || trip.destination === destination) && (!query || `${trip.title} ${trip.destination} ${trip.description}`.toLowerCase().includes(query)));
    const body = document.querySelector("#packages-table-body");
    body.replaceChildren();
    results.forEach((trip) => {
      const row = document.createElement("tr");
      const packageName = document.createElement("td"); packageName.className = "admin-package-name";
      const image = document.createElement("img"); image.src = trip.image; image.alt = ""; image.loading = "lazy";
      const title = document.createElement("span"); title.textContent = trip.title; packageName.append(image, title);
      const actions = document.createElement("td"); actions.className = "admin-actions-cell"; actions.append(makeAction("Edit", "edit-package", trip.id), makeAction("Delete", "delete-package", trip.id));
      row.append(packageName, createCell(trip.destination), createCell(trip.duration), createCell(`${trip.priceLabel || formatPrice(trip.price)} USD`), actions);
      body.append(row);
    });
    document.querySelector("#packages-empty").hidden = results.length > 0;
  }

  function statusCell(status) {
    const cell = document.createElement("td");
    const badge = document.createElement("span");
    badge.className = `admin-status-badge status-${status.toLowerCase().replaceAll(" ", "-")}`;
    badge.textContent = status;
    cell.append(badge);
    return cell;
  }

  function renderBookings() {
    const query = document.querySelector("#booking-search").value.trim().toLowerCase();
    const type = document.querySelector("#booking-type-filter").value;
    const status = document.querySelector("#booking-status-filter").value;
    const results = bookings.filter((booking) => (!type || booking.type === type) && (!status || booking.status === status) && (!query || `${booking.customerName} ${booking.reference} ${booking.item}`.toLowerCase().includes(query)));
    const body = document.querySelector("#bookings-table-body");
    body.replaceChildren();
    results.forEach((booking) => {
      const row = document.createElement("tr");
      const reference = document.createElement("td"); reference.className = "admin-reference-cell"; reference.textContent = booking.reference;
      if (booking.source === "demo") { const tag = document.createElement("small"); tag.className = "admin-demo-record-tag"; tag.textContent = "Demo"; reference.append(tag); }
      const typeCell = document.createElement("td"); typeCell.textContent = booking.type;
      const itemCell = document.createElement("td"); itemCell.textContent = booking.item;
      const statusSelect = document.createElement("select"); statusSelect.className = "admin-status-select"; statusSelect.setAttribute("aria-label", `Status for ${booking.reference}`); statusSelect.dataset.action = "booking-status"; statusSelect.dataset.id = booking.id;
      ["Requested", "In review", "Cancelled"].forEach((value) => statusSelect.add(new Option(value, value)));
      statusSelect.value = ["Requested", "In review", "Cancelled"].includes(booking.status) ? booking.status : "Requested";
      const statusWrap = document.createElement("td"); statusWrap.append(statusSelect);
      const actions = document.createElement("td"); actions.append(makeAction("Delete", "delete-booking", booking.id));
      row.append(reference, createCell(booking.customerName), typeCell, itemCell, createCell(formatDate(booking.date)), statusWrap, actions);
      body.append(row);
    });
    document.querySelector("#bookings-empty").hidden = results.length > 0;
  }

  function renderAll() {
    renderStats(); renderRecentBookings(); renderUsers(); renderPackages(); renderBookings();
  }

  function resetPackageForm() {
    form.reset();
    document.querySelector("#package-edit-id").value = "";
    document.querySelector("#package-form-error").textContent = "";
  }

  function openPackageEditor(trip = null) {
    lastActiveElement = document.activeElement;
    resetPackageForm();
    document.querySelector("#package-dialog-title").textContent = trip ? "Edit package" : "Add a package";
    if (trip) {
      document.querySelector("#package-edit-id").value = trip.id;
      document.querySelector("#package-title-input").value = trip.title;
      document.querySelector("#package-destination-input").value = trip.destination;
      document.querySelector("#package-duration-input").value = trip.duration;
      document.querySelector("#package-price-input").value = trip.price;
      document.querySelector("#package-description-input").value = trip.description;
      document.querySelector("#package-image-input").value = trip.image;
      document.querySelector("#package-highlights-input").value = (trip.highlights || []).join("\n");
    }
    dialog.showModal();
  }

  function packageFromForm(existing) {
    const title = document.querySelector("#package-title-input").value.trim();
    const destination = document.querySelector("#package-destination-input").value;
    const duration = document.querySelector("#package-duration-input").value.trim();
    const durationDays = Number((duration.match(/\d+/) || [])[0]);
    const price = Number(document.querySelector("#package-price-input").value);
    const description = document.querySelector("#package-description-input").value.trim();
    const image = document.querySelector("#package-image-input").value.trim();
    const highlights = document.querySelector("#package-highlights-input").value.split("\n").map((line) => line.trim()).filter(Boolean);
    if (!title || !destination || !duration || !Number.isFinite(durationDays) || durationDays < 1 || !Number.isFinite(price) || price <= 0 || !description || !image || !highlights.length) throw new Error("Complete all package fields. Duration must include a number, price must be above zero, and add at least one highlight.");
    let imageUrl;
    try { imageUrl = new URL(image); } catch (error) { throw new Error("Enter a complete image URL beginning with https:// or http://."); }
    if (!["https:", "http:"].includes(imageUrl.protocol)) throw new Error("Use an http or https image URL.");
    const imageAlt = `${title} in ${destination}`;
    const currentImages = existing?.images?.length ? existing.images : [{ src: image, alt: imageAlt }];
    const images = [{ ...currentImages[0], src: image, alt: imageAlt }, ...currentImages.slice(1)];
    let id = existing?.id;
    if (!id) {
      const base = `${destination}-${title}`.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      id = base;
      let suffix = 2;
      while (packages.some((trip) => trip.id === id)) { id = `${base}-${suffix}`; suffix += 1; }
    }
    return { ...(existing || {}), id, title, destination, country: destinations[destination], duration, durationDays, price, priceLabel: formatPrice(price), description, image, imageAlt, images, highlights, activities: existing?.activities || [] };
  }

  function closePackageEditor() {
    dialog.close();
    lastActiveElement?.focus();
  }

  document.querySelector("#admin-logout").addEventListener("click", () => {
    auth.clearSession();
    window.location.replace("index.html");
  });

  document.querySelectorAll("[data-admin-section]").forEach((link) => link.addEventListener("click", () => {
    document.querySelectorAll(".admin-side-link").forEach((item) => item.classList.toggle("active", item.dataset.adminSection === link.dataset.adminSection));
  }));

  document.querySelector("#user-search").addEventListener("input", renderUsers);
  document.querySelector("#user-role-filter").addEventListener("change", renderUsers);
  document.querySelector("#package-search").addEventListener("input", renderPackages);
  document.querySelector("#package-destination-filter").addEventListener("change", renderPackages);
  ["#booking-search", "#booking-type-filter", "#booking-status-filter"].forEach((selector) => {
    document.querySelector(selector).addEventListener("input", renderBookings);
    document.querySelector(selector).addEventListener("change", renderBookings);
  });
  document.querySelector("#add-package-button").addEventListener("click", () => openPackageEditor());
  document.querySelector("#close-package-dialog").addEventListener("click", closePackageEditor);
  document.querySelector("#cancel-package-dialog").addEventListener("click", closePackageEditor);
  dialog.addEventListener("click", (event) => { if (event.target === dialog) closePackageEditor(); });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const errorMessage = document.querySelector("#package-form-error");
    errorMessage.textContent = "";
    if (!form.reportValidity()) return;
    const editId = document.querySelector("#package-edit-id").value;
    const existing = packages.find((trip) => trip.id === editId);
    try {
      const updated = packageFromForm(existing);
      const nextPackages = existing ? packages.map((trip) => trip.id === editId ? updated : trip) : [...packages, updated];
      const previousPackages = packages;
      packages = nextPackages;
      if (!savePackages()) { packages = previousPackages; return; }
      closePackageEditor(); renderAll(); showToast(existing ? "Package changes saved." : "Package added to the catalog.");
    } catch (error) {
      errorMessage.textContent = error.message;
    }
  });

  document.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-action]");
    if (!button) return;
    const { action, id } = button.dataset;
    if (action === "delete-user") {
      if (id === user.id) { showFeedback("You cannot delete the administrator account currently in use.", true); return; }
      const account = accounts.find((item) => item.id === id);
      if (!account || !window.confirm(`Delete the demo account for ${account.fullName}?`)) return;
      const nextAccounts = accounts.filter((item) => item.id !== id);
      try { localStorage.setItem(auth.ACCOUNTS_KEY, JSON.stringify(nextAccounts)); accounts = nextAccounts; renderAll(); showToast("Demo account deleted."); }
      catch (error) { showFeedback("The browser could not save this account change.", true); }
    } else if (action === "edit-package") {
      const trip = packages.find((item) => item.id === id);
      if (trip) openPackageEditor(trip);
    } else if (action === "delete-package") {
      const trip = packages.find((item) => item.id === id);
      if (!trip || !window.confirm(`Delete “${trip.title}” from the sample package catalog?`)) return;
      const previousPackages = packages;
      packages = packages.filter((item) => item.id !== id);
      if (savePackages()) { renderAll(); showToast("Package removed from the public catalog."); }
      else packages = previousPackages;
    } else if (action === "delete-booking") {
      const booking = bookings.find((item) => item.id === id);
      if (!booking || !window.confirm(`Delete demo booking record ${booking.reference}?`)) return;
      const previousBookings = bookings;
      bookings = bookings.filter((item) => item.id !== id);
      if (saveBookings()) { renderAll(); showToast("Demo booking record deleted."); }
      else bookings = previousBookings;
    }
  });

  document.querySelector("#bookings-table-body").addEventListener("change", (event) => {
    const select = event.target.closest('select[data-action="booking-status"]');
    if (!select) return;
    const booking = bookings.find((item) => item.id === select.dataset.id);
    if (!booking) return;
    const previous = booking.status;
    booking.status = select.value;
    if (!saveBookings()) booking.status = previous;
    renderRecentBookings(); renderBookings(); renderStats();
    if (booking.status !== previous) showToast("Demo record status updated.");
  });

  renderAll();
})();
