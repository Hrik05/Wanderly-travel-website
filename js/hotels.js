// Render and filter the shared sample hotel catalog.
const hotels = window.WANDERLY_HOTELS || [];
const hotelGrid = document.querySelector("#hotel-grid");
const hotelFilters = document.querySelector("#hotel-filters");
const hotelSearch = document.querySelector("#hotel-search");
const hotelDestination = document.querySelector("#hotel-destination");
const hotelPrice = document.querySelector("#hotel-price");
const hotelRating = document.querySelector("#hotel-rating");
const hotelCount = document.querySelector("#hotel-results-count");
const hotelEmptyState = document.querySelector("#hotel-empty-state");

function createHotelCard(hotel) {
  const card = document.createElement("article");
  card.className = "hotel-card";

  const imageWrap = document.createElement("div");
  imageWrap.className = "hotel-card-image-wrap";
  const image = document.createElement("img");
  image.className = "hotel-card-image";
  image.src = hotel.image;
  image.alt = hotel.imageAlt;
  image.loading = "lazy";
  imageWrap.append(image);

  const body = document.createElement("div");
  body.className = "hotel-card-body";
  const location = document.createElement("p");
  location.className = "hotel-card-location";
  location.textContent = `${hotel.destination} · ${hotel.location}`;
  const heading = document.createElement("h3");
  heading.textContent = hotel.name;
  const stars = document.createElement("p");
  stars.className = "hotel-card-rating";
  stars.setAttribute("aria-label", `${hotel.rating} out of 5 stars`);
  stars.innerHTML = `<span aria-hidden="true">${"★".repeat(hotel.rating)}${"☆".repeat(5 - hotel.rating)}</span><small>${hotel.rating}.0</small>`;
  const description = document.createElement("p");
  description.className = "hotel-card-description";
  description.textContent = hotel.description;

  const meta = document.createElement("div");
  meta.className = "hotel-card-meta";
  const price = document.createElement("p");
  price.innerHTML = `${hotel.priceLabel}<small> / night</small>`;
  const link = document.createElement("a");
  link.className = "button hotel-details-button";
  link.href = `hotel-details.html?hotel=${encodeURIComponent(hotel.id)}`;
  link.innerHTML = 'View details <span aria-hidden="true">↗</span>';
  meta.append(price, link);
  body.append(location, heading, stars, description, meta);
  card.append(imageWrap, body);
  return card;
}

function matchesHotelPrice(hotel, range) {
  if (range === "under-150") return hotel.price < 150;
  if (range === "150-249") return hotel.price >= 150 && hotel.price < 250;
  if (range === "250-plus") return hotel.price >= 250;
  return true;
}

function renderHotels() {
  const query = hotelSearch.value.trim().toLowerCase();
  const destination = hotelDestination.value;
  const priceRange = hotelPrice.value;
  const minimumRating = Number(hotelRating.value) || 0;

  const matchingHotels = hotels.filter((hotel) => {
    const searchableText = `${hotel.name} ${hotel.destination} ${hotel.location} ${hotel.country}`.toLowerCase();
    return (!query || searchableText.includes(query))
      && (!destination || hotel.destinationId === destination)
      && matchesHotelPrice(hotel, priceRange)
      && hotel.rating >= minimumRating;
  });

  hotelGrid.replaceChildren(...matchingHotels.map(createHotelCard));
  const count = matchingHotels.length;
  hotelCount.textContent = `${count} ${count === 1 ? "stay" : "stays"} to explore`;
  hotelEmptyState.hidden = count > 0;
  hotelGrid.hidden = count === 0;
}

const requestedDestination = new URLSearchParams(window.location.search).get("destination");
const normalizedDestination = requestedDestination?.trim().toLowerCase().replaceAll(" ", "-");
const destinationAliases = { "amalfi-coast": "amalfi", amalfi: "amalfi", kyoto: "kyoto", marrakech: "marrakech" };
const resolvedDestination = destinationAliases[normalizedDestination] || normalizedDestination;
const validDestination = hotels.some((hotel) => hotel.destinationId === resolvedDestination);
if (validDestination) hotelDestination.value = resolvedDestination;

hotelFilters.addEventListener("input", renderHotels);
hotelFilters.addEventListener("change", renderHotels);
hotelFilters.addEventListener("submit", (event) => {
  event.preventDefault();
  renderHotels();
});
hotelFilters.addEventListener("reset", () => window.setTimeout(renderHotels, 0));
document.querySelector("#hotel-empty-reset")?.addEventListener("click", () => hotelFilters.reset());

const currentYear = document.querySelector("#current-year");
if (currentYear) currentYear.textContent = new Date().getFullYear();
renderHotels();
