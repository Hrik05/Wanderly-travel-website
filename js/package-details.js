// Fill this reusable page with the package selected by ?package=package-id.
const packageId = new URLSearchParams(window.location.search).get("package");
const trip = (window.WANDERLY_PACKAGES || []).find((item) => item.id === packageId);
const detailContent = document.querySelector("#package-detail-content");
const invalidState = document.querySelector("#package-invalid");

function addListItems(listElement, items) {
  items.forEach((text) => {
    const item = document.createElement("li");
    item.textContent = text;
    listElement.append(item);
  });
}

function renderIncludedItems(container, items) {
  const groups = [
    { title: "Accommodation", matches: (text) => /night|stay|hotel|riad|guesthouse|ryokan/i.test(text) },
    { title: "Meals", matches: (text) => /breakfast|lunch|dinner|meal|tea/i.test(text) },
    { title: "Excursions & activities", matches: (text) => /guided|walk|tour|class|workshop|experience|excursion|boat|tasting|ceremony/i.test(text) },
    { title: "Getting around", matches: () => true }
  ];
  const remainingItems = [...items];

  groups.forEach((group) => {
    const matchingItems = remainingItems.filter(group.matches);
    if (!matchingItems.length) return;

    const section = document.createElement("section");
    section.className = "inclusion-group";
    const heading = document.createElement("h3");
    heading.textContent = group.title;
    const list = document.createElement("ul");
    addListItems(list, matchingItems);
    section.append(heading, list);
    container.append(section);

    matchingItems.forEach((item) => {
      const itemIndex = remainingItems.indexOf(item);
      if (itemIndex !== -1) remainingItems.splice(itemIndex, 1);
    });
  });
}

if (trip) {
  document.title = `${trip.title} — Wanderly package details`;
  document.querySelector('meta[name="description"]').content = `${trip.title}: ${trip.duration} in ${trip.destination}, ${trip.country}. View the sample itinerary and included activities.`;
  document.querySelector("#package-title").textContent = trip.title;
  document.querySelector("#package-destination").textContent = `${trip.destination} · ${trip.country}`;
  document.querySelector("#package-duration").textContent = trip.duration;
  document.querySelector("#package-price").textContent = trip.priceLabel;
  document.querySelector("#booking-price").textContent = trip.priceLabel;
  document.querySelector("#package-heading").textContent = `A little more about ${trip.destination}.`;
  document.querySelector("#package-description").textContent = trip.description;
  document.querySelector("#package-reviews-link").href = `reviews.html?package=${encodeURIComponent(trip.id)}`;
  const hotelDestination = (window.WANDERLY_HOTELS || []).find((hotel) => hotel.destination === trip.destination)?.destinationId;
  if (hotelDestination) {
    document.querySelector("#package-hotels-link").href = `hotels.html?destination=${encodeURIComponent(hotelDestination)}`;
    document.querySelector("#package-hotels-link").textContent = `Explore hotels in ${trip.destination} ↗`;
    document.querySelector("#package-flights-link").href = `flights.html?to=${encodeURIComponent(hotelDestination)}`;
    document.querySelector("#package-flights-link").textContent = `Explore flights to ${trip.destination} ↗`;
    const itineraryParams = new URLSearchParams({ destination: hotelDestination, package: trip.id });
    document.querySelector("#package-itinerary-link").href = `itinerary.html?${itineraryParams.toString()}`;
    document.querySelector("#package-itinerary-link").textContent = `Create an itinerary for ${trip.destination} ↗`;
  }

  const heroImage = document.querySelector("#package-hero-image");
  heroImage.src = trip.images[0].src;
  heroImage.alt = trip.images[0].alt;

  const photoGrid = document.querySelector("#package-photos");
  trip.images.forEach((photo, index) => {
    const image = document.createElement("img");
    image.src = photo.src;
    image.alt = photo.alt;
    image.loading = "lazy";
    image.className = index === 0 ? "package-photo package-photo-primary" : "package-photo package-photo-secondary";
    photoGrid.append(image);
  });

  addListItems(document.querySelector("#package-highlights"), trip.highlights);
  renderIncludedItems(document.querySelector("#package-included"), trip.activities);
} else {
  detailContent.hidden = true;
  document.querySelector(".package-detail-hero").hidden = true;
  invalidState.hidden = false;
}

const year = document.querySelector("#current-year");
if (year) year.textContent = new Date().getFullYear();
