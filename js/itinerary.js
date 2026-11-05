// A small local itinerary editor. All plans stay in this browser's localStorage.
const STORAGE_KEY = "wanderly-itineraries-v1";
const destinationNames = { kyoto: "Kyoto", amalfi: "Amalfi Coast", marrakech: "Marrakech" };
const metadataForm = document.querySelector("#itinerary-metadata-form");
const savedList = document.querySelector("#saved-itinerary-list");
const savedEmpty = document.querySelector("#saved-itinerary-empty");
const welcomePanel = document.querySelector("#itinerary-welcome");
const editorPanel = document.querySelector("#itinerary-editor-content");
const daysContainer = document.querySelector("#itinerary-days");
const formMessage = document.querySelector("#itinerary-form-message");
const saveFeedback = document.querySelector("#itinerary-save-feedback");
const daysGuidance = document.querySelector("#days-guidance");
const nameField = document.querySelector("#trip-name");
const destinationField = document.querySelector("#trip-destination");
const startField = document.querySelector("#trip-start-date");
const endField = document.querySelector("#trip-end-date");
const travelersField = document.querySelector("#trip-travelers");
const descriptionField = document.querySelector("#trip-description");

let itineraries = loadItineraries();
let currentItinerary = null;
let baselineItinerary = null;
let currentIsSaved = false;

function makeId() {
  if (window.crypto && typeof window.crypto.randomUUID === "function") return window.crypto.randomUUID();
  return `trip-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function loadItineraries() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    if (!Array.isArray(stored)) return [];
    return stored.filter((trip) => trip && typeof trip.id === "string" && Array.isArray(trip.days));
  } catch {
    return [];
  }
}

function persistItineraries() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(itineraries));
    return true;
  } catch {
    return false;
  }
}

function formatDate(dateString, options = { day: "numeric", month: "short", year: "numeric" }) {
  if (!dateString) return "Dates not set";
  return new Intl.DateTimeFormat("en", options).format(new Date(`${dateString}T12:00:00`));
}

function dateRange(start, end) {
  if (!start || !end || end < start) return [];
  const dates = [];
  const cursor = new Date(`${start}T12:00:00`);
  const finalDate = new Date(`${end}T12:00:00`);
  while (cursor <= finalDate && dates.length < 366) {
    const year = cursor.getFullYear();
    const month = String(cursor.getMonth() + 1).padStart(2, "0");
    const day = String(cursor.getDate()).padStart(2, "0");
    dates.push(`${year}-${month}-${day}`);
    cursor.setDate(cursor.getDate() + 1);
  }
  return dates;
}

function createBlankItinerary(prefill = {}) {
  const trip = {
    id: makeId(),
    name: prefill.name || "",
    destination: prefill.destination || "",
    startDate: "",
    endDate: "",
    travelers: 2,
    description: prefill.description || "",
    days: []
  };
  currentItinerary = trip;
  baselineItinerary = clone(trip);
  currentIsSaved = false;
  showEditor();
}

function showEditor() {
  welcomePanel.hidden = Boolean(currentItinerary);
  editorPanel.hidden = !currentItinerary;
  if (!currentItinerary) return;

  nameField.value = currentItinerary.name;
  destinationField.value = currentItinerary.destination;
  startField.value = currentItinerary.startDate;
  endField.value = currentItinerary.endDate;
  travelersField.value = String(currentItinerary.travelers || 1);
  descriptionField.value = currentItinerary.description || "";
  endField.min = startField.value || "";
  formMessage.textContent = "";
  saveFeedback.textContent = "";
  updateDraftBadge();
  renderDays();
}

function showWelcome() {
  currentItinerary = null;
  baselineItinerary = null;
  currentIsSaved = false;
  welcomePanel.hidden = false;
  editorPanel.hidden = true;
}

function itineraryHasUnsavedChanges() {
  return currentItinerary && baselineItinerary && JSON.stringify(currentItinerary) !== JSON.stringify(baselineItinerary);
}

function canLeaveCurrentItinerary() {
  if (!itineraryHasUnsavedChanges()) return true;
  return window.confirm("You have unsaved changes. Discard them and continue?");
}

function updateDraftBadge() {
  const badge = document.querySelector("#draft-badge");
  const heading = document.querySelector("#editor-heading");
  const dirty = itineraryHasUnsavedChanges();
  badge.textContent = dirty ? "UNSAVED CHANGES" : (currentIsSaved ? "SAVED PLAN" : "NEW PLAN");
  badge.classList.toggle("draft-badge-dirty", dirty);
  heading.textContent = currentItinerary.name || "Plan your trip.";
}

function renderSavedList() {
  savedList.replaceChildren();
  savedEmpty.hidden = itineraries.length > 0;

  itineraries.forEach((trip) => {
    const item = document.createElement("article");
    item.className = "saved-trip-item";
    if (currentItinerary?.id === trip.id) item.classList.add("saved-trip-item-active");

    const openButton = document.createElement("button");
    openButton.className = "saved-trip-open";
    openButton.type = "button";
    const title = document.createElement("strong");
    title.textContent = trip.name || "Untitled trip";
    const destination = document.createElement("span");
    destination.textContent = `${destinationNames[trip.destination] || "Choose a destination"} · ${formatDate(trip.startDate, { day: "numeric", month: "short" })}`;
    openButton.append(title, destination);
    openButton.addEventListener("click", () => openSavedItinerary(trip.id));

    const deleteButton = document.createElement("button");
    deleteButton.className = "saved-trip-delete";
    deleteButton.type = "button";
    deleteButton.setAttribute("aria-label", `Delete ${trip.name || "untitled trip"}`);
    deleteButton.textContent = "×";
    deleteButton.addEventListener("click", () => deleteItinerary(trip.id));

    item.append(openButton, deleteButton);
    savedList.append(item);
  });
}

function openSavedItinerary(id) {
  if (!canLeaveCurrentItinerary()) return;
  const trip = itineraries.find((savedTrip) => savedTrip.id === id);
  if (!trip) return;
  currentItinerary = clone(trip);
  baselineItinerary = clone(trip);
  currentIsSaved = true;
  showEditor();
  renderSavedList();
}

function deleteItinerary(id) {
  const trip = itineraries.find((savedTrip) => savedTrip.id === id);
  if (!trip || !canLeaveCurrentItinerary()) return;
  if (!window.confirm(`Delete “${trip.name || "Untitled trip"}”? This cannot be undone.`)) return;

  const previousItineraries = itineraries;
  itineraries = itineraries.filter((savedTrip) => savedTrip.id !== id);
  if (!persistItineraries()) {
    itineraries = previousItineraries;
    saveFeedback.textContent = "This browser could not update saved trips. Check local storage permissions and try again.";
    return;
  }
  if (currentItinerary?.id === id) showWelcome();
  renderSavedList();
}

function syncMetadataFromForm() {
  if (!currentItinerary) return;
  currentItinerary.name = nameField.value.trim();
  currentItinerary.destination = destinationField.value;
  currentItinerary.startDate = startField.value;
  currentItinerary.endDate = endField.value;
  currentItinerary.travelers = Number(travelersField.value);
  currentItinerary.description = descriptionField.value.trim();
  endField.min = startField.value || "";
  updateDraftBadge();
}

function updateDaysGuidance() {
  if (!currentItinerary?.startDate || !currentItinerary?.endDate || currentItinerary.endDate < currentItinerary.startDate) {
    daysGuidance.textContent = "Add valid trip dates to start laying out the days.";
    return;
  }
  const totalDays = dateRange(currentItinerary.startDate, currentItinerary.endDate).length;
  daysGuidance.textContent = `${currentItinerary.days.length} of ${totalDays} ${totalDays === 1 ? "day" : "days"} planned. Add a day, then fill it with the things you’d love to do.`;
}

function renderDays() {
  if (!currentItinerary) return;
  currentItinerary.days.sort((a, b) => a.date.localeCompare(b.date));
  daysContainer.replaceChildren();
  updateDaysGuidance();

  if (!currentItinerary.days.length) {
    const empty = document.createElement("div");
    empty.className = "day-empty-state";
    empty.innerHTML = '<span aria-hidden="true">◷</span><p>No days planned yet. Add a day to give your trip a little shape.</p>';
    daysContainer.append(empty);
    return;
  }

  currentItinerary.days.forEach((day, index) => daysContainer.append(createDayCard(day, index)));
}

function createDayCard(day, index) {
  const card = document.createElement("article");
  card.className = "itinerary-day-card";
  const heading = document.createElement("div");
  heading.className = "itinerary-day-heading";
  const dayNumber = document.createElement("span");
  dayNumber.className = "itinerary-day-number";
  dayNumber.textContent = `DAY ${String(index + 1).padStart(2, "0")}`;
  const dayDate = document.createElement("h3");
  dayDate.textContent = formatDate(day.date, { weekday: "long", day: "numeric", month: "long" });
  const deleteDay = document.createElement("button");
  deleteDay.type = "button";
  deleteDay.className = "itinerary-delete-day";
  deleteDay.textContent = "Delete day";
  deleteDay.addEventListener("click", () => {
    if (!window.confirm(`Delete this day and its ${day.activities.length} ${day.activities.length === 1 ? "activity" : "activities"}?`)) return;
    currentItinerary.days = currentItinerary.days.filter((item) => item.id !== day.id);
    renderDays();
    updateDraftBadge();
  });
  const dayHeadingText = document.createElement("div");
  dayHeadingText.append(dayNumber, dayDate);
  heading.append(dayHeadingText, deleteDay);

  const activityList = document.createElement("div");
  activityList.className = "day-activities-list";
  if (day.activities.length) {
    day.activities.forEach((activity, activityIndex) => activityList.append(createActivityCard(day, activity, activityIndex)));
  } else {
    const empty = document.createElement("p");
    empty.className = "day-no-activities";
    empty.textContent = "An open day. Add an activity whenever inspiration strikes.";
    activityList.append(empty);
  }

  const addButton = document.createElement("button");
  addButton.type = "button";
  addButton.className = "add-activity-button";
  addButton.innerHTML = '<span aria-hidden="true">+</span> Add activity';

  const formWrap = document.createElement("div");
  formWrap.className = "activity-form-wrap";
  formWrap.hidden = true;
  const form = createActivityForm(day, formWrap);
  addButton.addEventListener("click", () => showActivityForm(form, formWrap));
  card.append(heading, activityList, addButton, formWrap);
  formWrap.append(form);
  return card;
}

function createActivityCard(day, activity, index) {
  const card = document.createElement("article");
  card.className = "itinerary-activity-card";
  const time = document.createElement("span");
  time.className = "activity-time-label";
  time.textContent = activity.time;
  const content = document.createElement("div");
  content.className = "activity-content";
  const title = document.createElement("h4");
  title.textContent = activity.name;
  const location = document.createElement("p");
  location.className = "activity-location";
  location.textContent = activity.location;
  content.append(title, location);
  if (activity.note) {
    const note = document.createElement("p");
    note.className = "activity-note";
    note.textContent = activity.note;
    content.append(note);
  }

  const actions = document.createElement("div");
  actions.className = "activity-actions";
  const editButton = createSmallButton("Edit", "activity-edit-button");
  editButton.addEventListener("click", () => {
    const dayCard = card.closest(".itinerary-day-card");
    const formWrap = dayCard.querySelector(".activity-form-wrap");
    const form = formWrap.querySelector("form");
    showActivityForm(form, formWrap, activity);
  });
  const earlierButton = createSmallButton("↑", "activity-move-button");
  earlierButton.setAttribute("aria-label", "Move activity earlier");
  earlierButton.disabled = index === 0;
  earlierButton.addEventListener("click", () => moveActivity(day, index, -1));
  const laterButton = createSmallButton("↓", "activity-move-button");
  laterButton.setAttribute("aria-label", "Move activity later");
  laterButton.disabled = index === day.activities.length - 1;
  laterButton.addEventListener("click", () => moveActivity(day, index, 1));
  const deleteButton = createSmallButton("Delete", "activity-delete-button");
  deleteButton.addEventListener("click", () => {
    if (!window.confirm(`Delete “${activity.name}”?`)) return;
    day.activities = day.activities.filter((item) => item.id !== activity.id);
    renderDays();
    updateDraftBadge();
  });
  actions.append(editButton, earlierButton, laterButton, deleteButton);
  card.append(time, content, actions);
  return card;
}

function createSmallButton(label, className) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = className;
  button.textContent = label;
  return button;
}

function createActivityForm(day, wrap) {
  const form = document.createElement("form");
  form.className = "activity-form";
  form.innerHTML = `
    <p class="eyebrow"><span class="eyebrow-dash"></span> Add a little detail</p>
    <div class="activity-form-grid">
      <label><span class="filter-label">Activity name</span><input name="name" type="text" maxlength="100" placeholder="Visit Fushimi Inari" required></label>
      <label><span class="filter-label">Location</span><input name="location" type="text" maxlength="120" placeholder="Fushimi Inari Shrine" required></label>
      <label><span class="filter-label">Time</span><input name="time" type="time" required></label>
      <label class="activity-note-field"><span class="filter-label">Description or personal note</span><textarea name="note" rows="2" maxlength="280" placeholder="A small note for later"></textarea></label>
    </div>
    <p class="activity-form-error" aria-live="polite"></p>
    <div class="activity-form-actions"><button class="button detail-home-button activity-save-button" type="submit">Save activity <span aria-hidden="true">↗</span></button><button class="activity-cancel-button" type="button">Cancel</button></div>`;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const nameValue = form.elements.name.value.trim();
    const locationValue = form.elements.location.value.trim();
    form.elements.name.setCustomValidity(nameValue ? "" : "Enter an activity name.");
    form.elements.location.setCustomValidity(locationValue ? "" : "Enter an activity location.");
    if (!form.reportValidity()) return;
    form.querySelector(".activity-form-error").textContent = "";
    const activity = {
      id: form.dataset.activityId || makeId(),
      name: nameValue,
      location: locationValue,
      time: form.elements.time.value,
      note: form.elements.note.value.trim()
    };
    if (!activity.name || !activity.location || !activity.time) return;
    const existingIndex = day.activities.findIndex((item) => item.id === activity.id);
    if (existingIndex >= 0) day.activities[existingIndex] = activity;
    else day.activities.push(activity);
    renderDays();
    updateDraftBadge();
  });
  form.querySelector(".activity-cancel-button").addEventListener("click", () => {
    wrap.hidden = true;
    form.reset();
    delete form.dataset.activityId;
  });
  return form;
}

function showActivityForm(form, wrap, activity = null) {
  form.reset();
  if (activity) {
    form.dataset.activityId = activity.id;
    form.elements.name.value = activity.name;
    form.elements.location.value = activity.location;
    form.elements.time.value = activity.time;
    form.elements.note.value = activity.note || "";
  } else {
    delete form.dataset.activityId;
  }
  wrap.hidden = false;
  form.elements.name.focus();
}

function moveActivity(day, index, direction) {
  const nextIndex = index + direction;
  if (nextIndex < 0 || nextIndex >= day.activities.length) return;
  [day.activities[index], day.activities[nextIndex]] = [day.activities[nextIndex], day.activities[index]];
  renderDays();
  updateDraftBadge();
}

function addDay() {
  syncMetadataFromForm();
  formMessage.textContent = "";
  if (!currentItinerary.startDate || !currentItinerary.endDate || currentItinerary.endDate < currentItinerary.startDate) {
    formMessage.textContent = "Set a valid start and end date before adding a day.";
    return;
  }
  const plannedDates = new Set(currentItinerary.days.map((day) => day.date));
  const nextDate = dateRange(currentItinerary.startDate, currentItinerary.endDate).find((date) => !plannedDates.has(date));
  if (!nextDate) {
    formMessage.textContent = "There is already a day planned for every date in this trip.";
    return;
  }
  currentItinerary.days.push({ id: makeId(), date: nextDate, activities: [] });
  currentItinerary.days.sort((a, b) => a.date.localeCompare(b.date));
  renderDays();
  updateDraftBadge();
}

function saveItinerary(event) {
  event.preventDefault();
  syncMetadataFromForm();
  formMessage.textContent = "";
  saveFeedback.textContent = "";

  nameField.setCustomValidity(currentItinerary.name ? "" : "Enter a trip name.");
  if (currentItinerary.startDate && currentItinerary.endDate && currentItinerary.endDate < currentItinerary.startDate) {
    formMessage.textContent = "The end date cannot be earlier than the start date.";
    endField.focus();
    return;
  }
  if (!metadataForm.reportValidity()) {
    formMessage.textContent = "Please complete the trip name, destination, and dates.";
    return;
  }
  const outsideDateRange = currentItinerary.days.some((day) => day.date < currentItinerary.startDate || day.date > currentItinerary.endDate);
  if (outsideDateRange) {
    formMessage.textContent = "One or more planned days fall outside your trip dates. Update the dates or remove those days before saving.";
    return;
  }

  const exists = itineraries.some((trip) => trip.id === currentItinerary.id);
  if (exists) itineraries = itineraries.map((trip) => trip.id === currentItinerary.id ? clone(currentItinerary) : trip);
  else itineraries = [...itineraries, clone(currentItinerary)];

  if (!persistItineraries()) {
    itineraries = loadItineraries();
    saveFeedback.textContent = "This browser could not save the itinerary. Check local storage permissions and try again.";
    renderSavedList();
    return;
  }
  currentIsSaved = true;
  baselineItinerary = clone(currentItinerary);
  saveFeedback.textContent = exists ? "Your itinerary has been updated and saved in this browser." : "Your itinerary has been saved in this browser.";
  updateDraftBadge();
  renderSavedList();
}

function cancelEditing() {
  if (!currentItinerary) return;
  if (itineraryHasUnsavedChanges() && !window.confirm("Discard your unsaved itinerary changes?")) return;
  if (currentIsSaved) {
    const savedTrip = itineraries.find((trip) => trip.id === currentItinerary.id);
    if (savedTrip) {
      currentItinerary = clone(savedTrip);
      baselineItinerary = clone(savedTrip);
      showEditor();
      return;
    }
  }
  showWelcome();
  renderSavedList();
}

document.querySelectorAll("#new-itinerary, #empty-create-itinerary, #welcome-create-itinerary").forEach((button) => {
  button.addEventListener("click", () => {
    if (!canLeaveCurrentItinerary()) return;
    createBlankItinerary();
  });
});
document.querySelector("#add-itinerary-day").addEventListener("click", addDay);
document.querySelector("#cancel-itinerary").addEventListener("click", cancelEditing);
metadataForm.addEventListener("submit", saveItinerary);
metadataForm.addEventListener("input", () => {
  syncMetadataFromForm();
    nameField.setCustomValidity(nameField.value.trim() ? "" : "Enter a trip name.");
  formMessage.textContent = "";
  saveFeedback.textContent = "";
});
metadataForm.addEventListener("change", () => {
  syncMetadataFromForm();
  updateDaysGuidance();
});

const destinationAliases = { "amalfi-coast": "amalfi", amalfi: "amalfi", kyoto: "kyoto", marrakech: "marrakech" };
const query = new URLSearchParams(window.location.search);
const requestedDestination = query.get("destination")?.trim().toLowerCase().replaceAll(" ", "-");
const destinationId = destinationAliases[requestedDestination] || requestedDestination;
const packageTrip = (window.WANDERLY_PACKAGES || []).find((trip) => trip.id === query.get("package"));
const hotel = (window.WANDERLY_HOTELS || []).find((stay) => stay.id === query.get("hotel"));
const flight = (window.WANDERLY_FLIGHTS || []).find((option) => option.id === query.get("flight"));
const knownDestination = destinationNames[destinationId] ? destinationId : "";
const packageDestination = (window.WANDERLY_HOTELS || []).find((stay) => stay.destination === packageTrip?.destination)?.destinationId;

if (knownDestination || packageTrip || hotel || flight) {
  const resolvedDestination = knownDestination || packageDestination || hotel?.destinationId || flight?.destination || "";
  const name = destinationNames[resolvedDestination] || "";
  const descriptionParts = [];
  if (packageTrip) descriptionParts.push(`Inspired by ${packageTrip.title}.`);
  if (hotel) descriptionParts.push(`Stay idea: ${hotel.name}, ${hotel.location}.`);
  if (flight) descriptionParts.push(`Sample flight idea: ${flight.airline}, ${flight.flightNumber}.`);
  createBlankItinerary({
    destination: resolvedDestination,
    name: packageTrip ? `${packageTrip.title} itinerary` : (name ? `${name} trip` : ""),
    description: descriptionParts.join(" ")
  });
}

renderSavedList();
const currentYear = document.querySelector("#current-year");
if (currentYear) currentYear.textContent = new Date().getFullYear();
