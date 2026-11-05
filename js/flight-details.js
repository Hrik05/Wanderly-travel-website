// Build a readable sample itinerary from ?flight=sample-flight-id.
const flightParams = new URLSearchParams(window.location.search);
const selectedFlight = (window.WANDERLY_FLIGHTS || []).find((flight) => flight.id === flightParams.get("flight"));
const airportData = window.WANDERLY_AIRPORTS || {};
const cabinNames = { economy: "Economy", premium: "Premium Economy", business: "Business", first: "First Class" };
const flightDetailContent = document.querySelector("#flight-detail-content");
const flightInvalidState = document.querySelector("#flight-invalid");

function formatFlightDuration(minutes) {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h ${String(remainingMinutes).padStart(2, "0")}m`;
}

function formatFlightDate(dateString) {
  if (!dateString) return "Date not selected";
  return new Intl.DateTimeFormat("en", { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(new Date(`${dateString}T12:00:00`));
}

function formatFlightPrice(value) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
}

function createFlightLeg(label, date, origin, destination, departure, arrival, duration, stops, flightNumber, airline) {
  const leg = document.createElement("article");
  leg.className = "itinerary-leg-card";
  const heading = document.createElement("div");
  heading.className = "itinerary-leg-heading";
  const direction = document.createElement("span");
  direction.textContent = label;
  const dateText = document.createElement("span");
  dateText.textContent = formatFlightDate(date);
  heading.append(direction, dateText);

  const route = document.createElement("div");
  route.className = "itinerary-leg-route";
  route.append(createLegAirport(departure, origin));
  const middle = document.createElement("div");
  middle.className = "itinerary-leg-middle";
  const durationText = document.createElement("small");
  durationText.textContent = formatFlightDuration(duration);
  const line = document.createElement("span");
  const stopText = document.createElement("small");
  stopText.textContent = stops === 0 ? "Nonstop" : `${stops} ${stops === 1 ? "stop" : "stops"}`;
  middle.append(durationText, line, stopText);
  route.append(middle, createLegAirport(arrival, destination));

  const footer = document.createElement("div");
  footer.className = "itinerary-leg-footer";
  footer.textContent = `${airline} · ${flightNumber}`;
  leg.append(heading, route, footer);
  return leg;
}

function createLegAirport(time, airport) {
  const item = document.createElement("div");
  item.className = "itinerary-airport";
  const timeText = document.createElement("strong");
  timeText.textContent = time;
  const code = document.createElement("span");
  code.textContent = airport.code;
  const city = document.createElement("small");
  city.textContent = `${airport.city} · ${airport.name}`;
  item.append(timeText, code, city);
  return item;
}

if (selectedFlight) {
  const cabin = cabinNames[flightParams.get("cabin")] ? flightParams.get("cabin") : "economy";
  const tripType = flightParams.get("tripType") === "roundtrip" ? "roundtrip" : "oneway";
  const passengersValue = Number(flightParams.get("passengers"));
  const passengers = Number.isInteger(passengersValue) && passengersValue > 0 ? Math.min(passengersValue, 6) : 1;
  const origin = airportData[selectedFlight.origin];
  const destination = airportData[selectedFlight.destination];
  const oneWayPrice = selectedFlight.prices[cabin];
  const farePerPassenger = tripType === "roundtrip" ? Math.round(oneWayPrice * 1.8) : oneWayPrice;
  const basePerPassenger = Math.round(farePerPassenger * 0.82);
  const taxesPerPassenger = farePerPassenger - basePerPassenger;
  const baseTotal = basePerPassenger * passengers;
  const taxesTotal = taxesPerPassenger * passengers;
  const grandTotal = farePerPassenger * passengers;

  document.title = `${origin.city} to ${destination.city} — Wanderly sample flight`;
  document.querySelector("#flight-detail-title").textContent = `${origin.city} to ${destination.city}`;
  const logo = document.querySelector("#detail-airline-logo");
  logo.textContent = selectedFlight.airlineCode;
  logo.style.setProperty("--airline-color", selectedFlight.brandColor);
  document.querySelector("#detail-airline-name").textContent = selectedFlight.airline;
  document.querySelector("#detail-flight-number").textContent = selectedFlight.flightNumber;
  document.querySelector("#detail-trip-type").textContent = tripType === "roundtrip" ? "Round-trip" : "One-way";
  document.querySelector("#aside-route").textContent = `${origin.city} to ${destination.city}`;
  document.querySelector("#aside-route-codes").textContent = `${origin.code} → ${destination.code}`;
  document.querySelector("#detail-passengers").textContent = `${passengers} ${passengers === 1 ? "passenger" : "passengers"}`;
  document.querySelector("#detail-cabin").textContent = cabinNames[cabin];
  document.querySelector("#detail-baggage").textContent = selectedFlight.baggage;
  document.querySelector("#fare-subtitle").textContent = `${tripType === "roundtrip" ? "Round-trip" : "One-way"} sample fare · ${passengers} ${passengers === 1 ? "passenger" : "passengers"} · ${cabinNames[cabin]}`;
  document.querySelector("#fare-base").textContent = formatFlightPrice(baseTotal);
  document.querySelector("#fare-taxes").textContent = formatFlightPrice(taxesTotal);
  document.querySelector("#fare-total").textContent = formatFlightPrice(grandTotal);

  const itinerary = document.querySelector("#flight-itinerary-legs");
  itinerary.append(createFlightLeg(
    "Outbound", flightParams.get("departure"), origin, destination,
    selectedFlight.departure, selectedFlight.arrival, selectedFlight.durationMinutes,
    selectedFlight.stops, selectedFlight.flightNumber, selectedFlight.airline
  ));
  if (tripType === "roundtrip") {
    itinerary.append(createFlightLeg(
      "Return", flightParams.get("return"), destination, origin,
      selectedFlight.return.departure, selectedFlight.return.arrival, selectedFlight.return.durationMinutes,
      selectedFlight.return.stops, selectedFlight.return.flightNumber, selectedFlight.airline
    ));
  }

  const returnParams = new URLSearchParams({ to: selectedFlight.destination, from: selectedFlight.origin });
  document.querySelector("#return-to-search").href = `flights.html?${returnParams.toString()}`;
  const itineraryParams = new URLSearchParams({ destination: selectedFlight.destination, flight: selectedFlight.id });
  document.querySelector("#flight-itinerary-link").href = `itinerary.html?${itineraryParams.toString()}`;
} else {
  flightDetailContent.hidden = true;
  document.querySelector(".flight-detail-banner").hidden = true;
  flightInvalidState.hidden = false;
}

const currentYear = document.querySelector("#current-year");
if (currentYear) currentYear.textContent = new Date().getFullYear();
