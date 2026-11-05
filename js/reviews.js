(() => {
  const STORAGE_KEY = "wanderly-user-reviews-v1";
  const destinations = { kyoto: "Kyoto", amalfi: "Amalfi Coast", marrakech: "Marrakech" };
  const sampleReviews = window.WANDERLY_SAMPLE_REVIEWS || [];
  const hotels = window.WANDERLY_HOTELS || [];
  const packages = window.WANDERLY_PACKAGES || [];
  const $ = (selector) => document.querySelector(selector);
  const destinationFilter = $("#review-destination");
  const categoryFilter = $("#review-category");
  const subjectFilter = $("#review-subject");
  const ratingFilter = $("#review-rating");
  const searchFilter = $("#review-search");
  const sortFilter = $("#review-sort");
  const grid = $("#reviews-grid");
  const emptyState = $("#reviews-empty");
  const dialog = $("#review-dialog");
  const form = $("#review-form");
  const formCategory = $("#form-review-category");
  const formSubject = $("#form-review-subject");
  let userReviews = loadUserReviews();

  function loadUserReviews() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      return Array.isArray(saved) ? saved : [];
    } catch (error) {
      return [];
    }
  }

  function currentReviews() { return [...userReviews, ...sampleReviews]; }
  function subjectKey(review) { return `${review.category.toLowerCase().replaceAll(" ", "-")}:${review.subjectId}`; }
  function displayDate(date) {
    const parsed = new Date(`${date}T12:00:00`);
    return Number.isNaN(parsed.getTime()) ? "Date unavailable" : parsed.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
  }

  function localDateString() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function updateSummary() {
    const reviews = currentReviews();
    const count = reviews.length;
    const average = count ? reviews.reduce((sum, review) => sum + Number(review.rating || 0), 0) / count : 0;
    $("#rating-average").textContent = count ? average.toFixed(1) : "—";
    $("#average-stars").textContent = count ? `${"★".repeat(Math.round(average))}${"☆".repeat(5 - Math.round(average))}` : "☆☆☆☆☆";
    $("#average-stars").setAttribute("aria-label", count ? `Average ${average.toFixed(1)} out of 5 stars` : "No ratings yet");
    $("#rating-total").textContent = count.toLocaleString();
    const breakdown = $("#rating-breakdown");
    breakdown.replaceChildren();
    for (let stars = 5; stars >= 1; stars -= 1) {
      const number = reviews.filter((review) => Number(review.rating) === stars).length;
      const row = document.createElement("div");
      row.className = "rating-row";
      const label = document.createElement("span"); label.textContent = `${stars} star${stars === 1 ? "" : "s"}`;
      const track = document.createElement("span"); track.className = "rating-track";
      const fill = document.createElement("span"); fill.className = "rating-fill"; fill.style.width = `${count ? (number / count) * 100 : 0}%`;
      track.append(fill);
      const tally = document.createElement("span"); tally.className = "rating-tally"; tally.textContent = number;
      row.append(label, track, tally); breakdown.append(row);
    }
  }

  function optionData(category) {
    if (category === "Destination") return Object.entries(destinations).map(([id, name]) => ({ id, name, destinationId: id, destinationName: name }));
    if (category === "Hotel") return hotels.map((item) => ({ id: item.id, name: item.name, destinationId: item.destinationId, destinationName: item.destination }));
    if (category === "Tour Package") return packages.map((item) => ({ id: item.id, name: item.title, destinationId: item.destination.toLowerCase().includes("amalfi") ? "amalfi" : item.destination.toLowerCase(), destinationName: item.destination }));
    return [];
  }

  function fillSelect(select, items, firstLabel) {
    const selected = select.value;
    select.replaceChildren(new Option(firstLabel, ""));
    items.forEach((item) => select.add(new Option(item.name, item.id)));
    if (items.some((item) => item.id === selected)) select.value = selected;
  }

  function updateSubjectFilter() {
    const category = categoryFilter.value;
    const options = category ? optionData(category) : [];
    fillSelect(subjectFilter, options, "All items");
    subjectFilter.disabled = !category;
  }

  function updateFormSubjects() {
    const items = optionData(formCategory.value);
    formSubject.disabled = !items.length;
    fillSelect(formSubject, items, items.length ? "Choose an item" : "Choose a category first");
  }

  function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);
  }

  function reviewCard(review) {
    const card = document.createElement("article");
    card.className = "review-card";
    const demo = review.source === "sample" ? '<span class="review-demo-badge">Demo review</span>' : '<span class="review-community-badge">Community review</span>';
    const stars = "★".repeat(Number(review.rating)) + "☆".repeat(5 - Number(review.rating));
    const initials = escapeHTML(review.initials || review.name.split(/\s+/).map((part) => part[0]).slice(0, 2).join("").toUpperCase());
    card.innerHTML = `<div class="review-card-top"><span class="review-avatar" aria-hidden="true">${initials}</span><div class="review-author"><strong>${escapeHTML(review.name)}</strong><span>${escapeHTML(review.category)}</span></div>${demo}</div><div class="review-card-rating" aria-label="${Number(review.rating)} out of 5 stars">${stars}</div><h3>${escapeHTML(review.title)}</h3><p class="review-card-text">${escapeHTML(review.text)}</p><div class="review-card-footer"><div><strong>${escapeHTML(review.subjectName)}</strong><span>${escapeHTML(review.destinationName)}</span></div><time datetime="${escapeHTML(review.date)}">${displayDate(review.date)}</time></div>`;
    return card;
  }

  function render() {
    updateSummary();
    const term = searchFilter.value.trim().toLowerCase();
    let reviews = currentReviews().filter((review) => {
      const categoryMatches = !categoryFilter.value || review.category === categoryFilter.value;
      const destinationMatches = !destinationFilter.value || review.destinationId === destinationFilter.value;
      const subjectMatches = !subjectFilter.value || subjectKey(review) === `${categoryFilter.value.toLowerCase().replaceAll(" ", "-")}:${subjectFilter.value}`;
      const ratingMatches = !ratingFilter.value || Number(review.rating) === Number(ratingFilter.value);
      const searchMatches = !term || [review.name, review.title, review.text, review.subjectName, review.destinationName].some((value) => value.toLowerCase().includes(term));
      return categoryMatches && destinationMatches && subjectMatches && ratingMatches && searchMatches;
    });
    if (sortFilter.value === "highest") reviews.sort((a, b) => Number(b.rating) - Number(a.rating) || b.date.localeCompare(a.date));
    else if (sortFilter.value === "lowest") reviews.sort((a, b) => Number(a.rating) - Number(b.rating) || b.date.localeCompare(a.date));
    else reviews.sort((a, b) => b.date.localeCompare(a.date));
    grid.replaceChildren(...reviews.map(reviewCard));
    emptyState.hidden = reviews.length > 0;
    $("#reviews-result-count").textContent = `${reviews.length} ${reviews.length === 1 ? "review" : "reviews"} shown`;
  }

  function clearFilters() {
    destinationFilter.value = ""; categoryFilter.value = ""; ratingFilter.value = ""; searchFilter.value = ""; sortFilter.value = "recent";
    updateSubjectFilter(); render();
  }

  function applyQueryFilters() {
    const params = new URLSearchParams(window.location.search);
    const destination = params.get("destination");
    const hotelId = params.get("hotel");
    const packageId = params.get("package");
    if (hotelId) {
      const hotel = hotels.find((item) => item.id === hotelId);
      categoryFilter.value = "Hotel"; updateSubjectFilter(); subjectFilter.value = hotelId;
      if (hotel) destinationFilter.value = hotel.destinationId;
    } else if (packageId) {
      const trip = packages.find((item) => item.id === packageId);
      categoryFilter.value = "Tour Package"; updateSubjectFilter(); subjectFilter.value = packageId;
      if (trip) destinationFilter.value = optionData("Tour Package").find((item) => item.id === packageId)?.destinationId || "";
    } else if (destination && destinations[destination]) destinationFilter.value = destination;
  }

  categoryFilter.addEventListener("change", () => { updateSubjectFilter(); render(); });
  [destinationFilter, subjectFilter, ratingFilter, sortFilter].forEach((control) => control.addEventListener("change", render));
  searchFilter.addEventListener("input", render);
  $("#clear-review-filters").addEventListener("click", clearFilters);
  $("#empty-clear-filters").addEventListener("click", clearFilters);
  $("#open-review-form").addEventListener("click", () => { $("#review-form-message").textContent = ""; dialog.showModal(); });
  $("#close-review-form").addEventListener("click", () => dialog.close());
  $("#cancel-review-form").addEventListener("click", () => dialog.close());
  formCategory.addEventListener("change", updateFormSubjects);
  dialog.addEventListener("click", (event) => { if (event.target === dialog) dialog.close(); });
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const formData = new FormData(form);
    const category = String(formData.get("category"));
    const selected = optionData(category).find((item) => item.id === String(formData.get("subjectId")));
    if (!selected) { $("#review-form-message").textContent = "Choose an item to review."; return; }
    const name = String(formData.get("name")).trim();
    const review = {
      id: `user-${Date.now()}`, name, initials: name.split(/\s+/).map((part) => part[0]).slice(0, 2).join("").toUpperCase(),
      category, subjectId: selected.id, subjectName: selected.name, destinationId: selected.destinationId, destinationName: selected.destinationName,
      rating: Number(formData.get("rating")), title: String(formData.get("title")).trim(), text: String(formData.get("text")).trim(),
      date: localDateString(), source: "local"
    };
    const nextReviews = [review, ...userReviews];
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextReviews));
      userReviews = nextReviews;
    } catch (error) {
      $("#review-form-message").textContent = "This browser could not save your review. Check its local storage settings and try again.";
      return;
    }
    form.reset(); updateFormSubjects(); dialog.close(); render();
    const toast = $("#review-success"); toast.textContent = "Your review has been added."; toast.classList.add("visible");
    window.setTimeout(() => toast.classList.remove("visible"), 3500);
  });

  applyQueryFilters();
  updateFormSubjects();
  render();
  const year = $("#current-year"); if (year) year.textContent = new Date().getFullYear();
})();
