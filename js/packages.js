// Render sample packages, then narrow them with the search and filter controls.
const packages = window.WANDERLY_PACKAGES || [];
const packageGrid = document.querySelector("#package-grid");
const filtersForm = document.querySelector("#package-filters");
const searchField = document.querySelector("#package-search");
const destinationFilter = document.querySelector("#filter-destination");
const durationFilter = document.querySelector("#filter-duration");
const priceFilter = document.querySelector("#filter-price");
const resultCount = document.querySelector("#package-results-count");
const emptyState = document.querySelector("#package-empty-state");

function createPackageCard(trip) {
  const card = document.createElement("article");
  card.className = "package-card";

  const imageWrap = document.createElement("div");
  imageWrap.className = "package-card-image-wrap";
  const image = document.createElement("img");
  image.className = "package-card-image";
  image.src = trip.image;
  image.alt = trip.imageAlt;
  image.loading = "lazy";
  const duration = document.createElement("span");
  duration.className = "package-duration-badge";
  duration.textContent = trip.duration;
  imageWrap.append(image, duration);

  const body = document.createElement("div");
  body.className = "package-card-body";
  const eyebrow = document.createElement("p");
  eyebrow.className = "package-card-country";
  eyebrow.textContent = `${trip.destination} · ${trip.country}`;
  const title = document.createElement("h3");
  title.textContent = trip.title;
  const description = document.createElement("p");
  description.className = "package-card-description";
  description.textContent = trip.description;

  const meta = document.createElement("div");
  meta.className = "package-card-meta";
  const durationLabel = document.createElement("span");
  durationLabel.textContent = `◷ ${trip.duration}`;
  const price = document.createElement("span");
  price.className = "package-price";
  price.textContent = trip.priceLabel;
  const priceUnit = document.createElement("small");
  priceUnit.textContent = " / person";
  price.append(priceUnit);
  meta.append(durationLabel, price);

  const link = document.createElement("a");
  link.className = "button package-details-button";
  link.href = `package-details.html?package=${encodeURIComponent(trip.id)}`;
  link.innerHTML = 'View details <span aria-hidden="true">↗</span>';
  body.append(eyebrow, title, description, meta, link);
  card.append(imageWrap, body);
  return card;
}

function matchesDuration(trip, range) {
  if (range === "short") return trip.durationDays <= 4;
  if (range === "week") return trip.durationDays >= 5 && trip.durationDays <= 7;
  if (range === "long") return trip.durationDays >= 8;
  return true;
}

function matchesPrice(trip, range) {
  if (range === "under-1500") return trip.price < 1500;
  if (range === "1500-1999") return trip.price >= 1500 && trip.price < 2000;
  if (range === "2000-plus") return trip.price >= 2000;
  return true;
}

function renderPackages() {
  const query = searchField.value.trim().toLowerCase();
  const destination = destinationFilter.value;
  const duration = durationFilter.value;
  const price = priceFilter.value;

  const matchingPackages = packages.filter((trip) => {
    const searchableText = `${trip.title} ${trip.destination} ${trip.country} ${trip.description}`.toLowerCase();
    return (!query || searchableText.includes(query))
      && (!destination || trip.destination === destination)
      && matchesDuration(trip, duration)
      && matchesPrice(trip, price);
  });

  packageGrid.replaceChildren(...matchingPackages.map(createPackageCard));
  const count = matchingPackages.length;
  resultCount.textContent = `${count} ${count === 1 ? "journey" : "journeys"} to explore`;
  emptyState.hidden = count > 0;
  packageGrid.hidden = count === 0;
}

if (filtersForm) {
  filtersForm.addEventListener("input", renderPackages);
  filtersForm.addEventListener("change", renderPackages);
  filtersForm.addEventListener("reset", () => window.setTimeout(renderPackages, 0));
}

document.querySelector("#empty-reset")?.addEventListener("click", () => filtersForm.reset());
const year = document.querySelector("#current-year");
if (year) year.textContent = new Date().getFullYear();
renderPackages();
