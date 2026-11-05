// Search and sort an illustrative catalog of sample routes.
const airports = window.WANDERLY_AIRPORTS || {};
const flights = window.WANDERLY_FLIGHTS || [];
const searchForm = document.querySelector("#flight-search-form");
const fromField = document.querySelector("#flight-from");
const toField = document.querySelector("#flight-to");
const tripTypeField = document.querySelector("#trip-type");
const departureField = document.querySelector("#departure-date");
const returnField = document.querySelector("#return-date");
const returnFieldWrap = document.querySelector("#return-date-field");
const passengerField = document.querySelector("#passengers");
const cabinField = document.querySelector("#cabin-class");
const validationMessage = document.querySelector("#flight-validation-message");
const resultsSection = document.querySelector("#flight-results-section");
const resultsList = document.querySelector("#flight-results-list");
const resultCount = document.querySelector("#flight-results-count");
const emptyState = document.querySelector("#flight-empty-state");
const sortField = document.querySelector("#flight-sort");

const cabinLabels = { economy: "Economy", premium: "Premium Economy", business: "Business", first: "First Class" };
let activeSearch = null;

function localDateString(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function addDays(dateString, days) {
  const date = new Date(`${dateString}T12:00:00`);
  date.setDate(date.getDate() + days);
  return localDateString(date);
}

function formatDate(dateString) {
  if (!dateString) return "Date not selected";
  return new Intl.DateTimeFormat("en", { weekday: "short", day: "numeric", month: "short", year: "numeric" }).format(new Date(`${dateString}T12:00:00`));
}

function formatDuration(minutes) {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h ${String(remainingMinutes).padStart(2, "0")}m`;
}

function formatPrice(amount) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(amount);
}

function sampleTripFare(flight) {
  const oneWayFare = flight.prices[activeSearch.cabin];
  return activeSearch.tripType === "roundtrip" ? Math.round(oneWayFare * 1.8) : oneWayFare;
}

function createFlightCard(flight) {
  const origin = airports[flight.origin];
  const destination = airports[flight.destination];
  const card = document.createElement("article");
  card.className = "flight-result-card";

  const airline = document.createElement("div");
  airline.className = "flight-airline-block";
  const logo = document.createElement("span");
  logo.className = "airline-monogram";
  logo.style.setProperty("--airline-color", flight.brandColor);
  logo.textContent = flight.airlineCode;
  const airlineText = document.createElement("span");
  airlineText.className = "airline-name";
  airlineText.textContent = flight.airline;
  const flightNumber = document.createElement("small");
  flightNumber.textContent = flight.flightNumber;
  airline.append(logo, airlineText, flightNumber);

  const schedule = document.createElement("div");
  schedule.className = "flight-schedule-block";
  schedule.append(createAirportTime(flight.departure, origin));
  const routeLine = document.createElement("div");
  routeLine.className = "flight-route-line";
  const duration = document.createElement("small");
  duration.textContent = formatDuration(flight.durationMinutes);
  const line = document.createElement("span");
  const stops = document.createElement("small");
  stops.textContent = flight.stops === 0 ? "Nonstop" : `${flight.stops} ${flight.stops === 1 ? "stop" : "stops"}`;
  routeLine.append(duration, line, stops);
  schedule.append(routeLine, createAirportTime(flight.arrival, destination));

  const priceBlock = document.createElement("div");
  priceBlock.className = "flight-price-block";
  const cabin = document.createElement("span");
  cabin.textContent = cabinLabels[activeSearch.cabin];
  const price = document.createElement("strong");
  price.textContent = formatPrice(sampleTripFare(flight));
  const priceCaption = document.createElement("small");
  priceCaption.textContent = `per passenger · ${activeSearch.tripType === "roundtrip" ? "round-trip" : "one-way"}`;
  const detailsLink = document.createElement("a");
  detailsLink.className = "button flight-details-button";
  const detailParams = new URLSearchParams({
    flight: flight.id,
    from: flight.origin,
    to: flight.destination,
    departure: activeSearch.departureDate,
    return: activeSearch.tripType === "roundtrip" ? activeSearch.returnDate : "",
    tripType: activeSearch.tripType,
    passengers: String(activeSearch.passengers),
    cabin: activeSearch.cabin
  });
  detailsLink.href = `flight-details.html?${detailParams.toString()}`;
  detailsLink.innerHTML = 'View details <span aria-hidden="true">↗</span>';
  priceBlock.append(cabin, price, priceCaption, detailsLink);
  card.append(airline, schedule, priceBlock);
  return card;
}

function createAirportTime(time, airport) {
  const block = document.createElement("div");
  block.className = "flight-airport-time";
  const timeText = document.createElement("strong");
  timeText.textContent = time;
  const city = document.createElement("span");
  city.textContent = airport.code;
  const airportName = document.createElement("small");
  airportName.textContent = airport.city;
  block.append(timeText, city, airportName);
  return block;
}

function sortFlights(items) {
  const sorted = [...items];
  if (sortField.value === "fastest") {
    sorted.sort((a, b) => a.durationMinutes - b.durationMinutes);
  } else if (sortField.value === "earliest") {
    sorted.sort((a, b) => a.departure.localeCompare(b.departure));
  } else {
    sorted.sort((a, b) => sampleTripFare(a) - sampleTripFare(b));
  }
  return sorted;
}

function renderResults() {
  if (!activeSearch) return;
  const matching = flights.filter((flight) => flight.origin === activeSearch.from && flight.destination === activeSearch.to);
  const sorted = sortFlights(matching);
  resultsList.replaceChildren(...sorted.map(createFlightCard));
  resultCount.textContent = `${sorted.length} illustrative ${sorted.length === 1 ? "flight" : "flights"} · ${activeSearch.passengers} ${activeSearch.passengers === 1 ? "passenger" : "passengers"} · ${cabinLabels[activeSearch.cabin]}`;
  emptyState.hidden = sorted.length > 0;
  resultsList.hidden = sorted.length === 0;
  const origin = airports[activeSearch.from];
  const destination = airports[activeSearch.to];
  document.querySelector("#flight-results-route").textContent = `${origin.city} (${origin.code}) → ${destination.city} (${destination.code}) · ${formatDate(activeSearch.departureDate)}${activeSearch.tripType === "roundtrip" ? ` · Return ${formatDate(activeSearch.returnDate)}` : " · One-way"}`;
}

function setReturnDateState() {
  const isRoundTrip = tripTypeField.value === "roundtrip";
  returnField.disabled = !isRoundTrip;
  returnField.required = isRoundTrip;
  returnFieldWrap.classList.toggle("field-disabled", !isRoundTrip);
  if (isRoundTrip && departureField.value) {
    returnField.min = departureField.value;
    if (returnField.value && returnField.value < departureField.value) returnField.value = departureField.value;
  }
}

const today = localDateString(new Date());
departureField.min = today;
departureField.value = addDays(today, 14);
returnField.value = addDays(departureField.value, 7);
setReturnDateState();

const requestedDestination = new URLSearchParams(window.location.search).get("to")?.trim().toLowerCase().replaceAll(" ", "-");
const destinationAliases = { "amalfi-coast": "amalfi", amalfi: "amalfi", kyoto: "kyoto", marrakech: "marrakech" };
const preselectedDestination = destinationAliases[requestedDestination] || requestedDestination;
if (Object.hasOwn(airports, preselectedDestination) && ["kyoto", "amalfi", "marrakech"].includes(preselectedDestination)) {
  toField.value = preselectedDestination;
}

tripTypeField.addEventListener("change", setReturnDateState);
departureField.addEventListener("change", setReturnDateState);
returnField.addEventListener("change", () => {
  if (tripTypeField.value === "roundtrip" && returnField.value < departureField.value) {
    validationMessage.textContent = "Return date must be the same day or later than departure.";
    returnField.value = departureField.value;
    returnField.focus();
  } else {
    validationMessage.textContent = "";
  }
});

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  validationMessage.textContent = "";
  const departureDate = departureField.value;
  const returnDate = returnField.value;

  if (!fromField.value || !toField.value || !departureDate || (tripTypeField.value === "roundtrip" && !returnDate)) {
    validationMessage.textContent = "Choose your departure city, destination, and travel dates to search.";
    searchForm.reportValidity();
    return;
  }
  if (tripTypeField.value === "roundtrip" && returnDate < departureDate) {
    validationMessage.textContent = "Return date must be the same day or later than departure.";
    returnField.focus();
    return;
  }

  activeSearch = {
    from: fromField.value,
    to: toField.value,
    departureDate,
    returnDate,
    tripType: tripTypeField.value,
    passengers: Number(passengerField.value),
    cabin: cabinField.value
  };
  resultsSection.hidden = false;
  renderResults();
  resultsSection.scrollIntoView({ behavior: "smooth", block: "start" });
});

sortField.addEventListener("change", renderResults);
const currentYear = document.querySelector("#current-year");
if (currentYear) currentYear.textContent = new Date().getFullYear();
