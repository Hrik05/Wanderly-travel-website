// Gallery filters and accessible lightbox for the editorial photo collection.
const galleryItems = window.WANDERLY_GALLERY || [];
const galleryGrid = document.querySelector("#gallery-grid");
const destinationFilter = document.querySelector("#gallery-destination");
const searchInput = document.querySelector("#gallery-search");
const countLabel = document.querySelector("#gallery-count");
const emptyState = document.querySelector("#gallery-empty");
const lightbox = document.querySelector("#gallery-lightbox");
const lightboxImage = document.querySelector("#lightbox-image");
const categoryButtons = [...document.querySelectorAll(".gallery-category-button")];
let activeCategory = "all";
let visibleItems = [];
let currentLightboxIndex = 0;
let previousFocus = null;
let previousBodyOverflow = "";

function getMatches() {
  const search = searchInput.value.trim().toLowerCase();
  const destination = destinationFilter.value;
  return galleryItems.filter((item) => {
    const searchableText = `${item.destination} ${item.caption} ${item.category} ${item.alt}`.toLowerCase();
    return (activeCategory === "all" || item.category === activeCategory)
      && (!destination || item.destinationId === destination)
      && (!search || searchableText.includes(search));
  });
}

function createGalleryCard(item, index) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = `gallery-card gallery-item-${item.size}`;
  button.setAttribute("aria-label", `Open photograph: ${item.destination}. ${item.caption}`);

  const image = document.createElement("img");
  image.className = "gallery-card-image";
  image.src = item.thumbnail;
  image.alt = item.alt;
  image.loading = "lazy";
  image.decoding = "async";
  const overlay = document.createElement("span");
  overlay.className = "gallery-card-overlay";
  const metadata = document.createElement("span");
  metadata.className = "gallery-card-meta";
  const category = document.createElement("span");
  category.className = "gallery-card-category";
  category.textContent = item.category;
  const destination = document.createElement("span");
  destination.className = "gallery-card-destination";
  destination.textContent = item.destination;
  const caption = document.createElement("span");
  caption.className = "gallery-card-caption";
  caption.textContent = item.caption;
  const openIcon = document.createElement("span");
  openIcon.className = "gallery-card-open-icon";
  openIcon.setAttribute("aria-hidden", "true");
  openIcon.textContent = "↗";
  metadata.append(category, destination, caption);
  overlay.append(metadata, openIcon);
  button.append(image, overlay);
  button.addEventListener("click", () => openLightbox(index));
  return button;
}

function renderGallery() {
  visibleItems = getMatches();
  galleryGrid.replaceChildren(...visibleItems.map(createGalleryCard));
  countLabel.textContent = `${visibleItems.length} ${visibleItems.length === 1 ? "photograph" : "photographs"}`;
  emptyState.hidden = visibleItems.length > 0;
  galleryGrid.hidden = visibleItems.length === 0;
}

function updateLightbox() {
  const item = visibleItems[currentLightboxIndex];
  if (!item) return;
  lightboxImage.src = item.full;
  lightboxImage.alt = item.alt;
  document.querySelector("#lightbox-category").textContent = `${item.category} · WANDERLY FIELD NOTES`;
  document.querySelector("#lightbox-destination").textContent = item.destination;
  document.querySelector("#lightbox-description").textContent = item.caption;
  document.querySelector("#lightbox-position").textContent = `${currentLightboxIndex + 1} / ${visibleItems.length}`;
  const multipleImages = visibleItems.length > 1;
  document.querySelector("#lightbox-previous").disabled = !multipleImages;
  document.querySelector("#lightbox-next").disabled = !multipleImages;
}

function openLightbox(index) {
  currentLightboxIndex = index;
  previousFocus = document.activeElement;
  previousBodyOverflow = document.body.style.overflow;
  document.body.style.overflow = "hidden";
  lightbox.hidden = false;
  updateLightbox();
  document.querySelector("#lightbox-close").focus();
}

function closeLightbox() {
  if (lightbox.hidden) return;
  lightbox.hidden = true;
  lightboxImage.removeAttribute("src");
  document.body.style.overflow = previousBodyOverflow;
  if (previousFocus && typeof previousFocus.focus === "function") previousFocus.focus();
}

function moveLightbox(direction) {
  if (!visibleItems.length) return;
  currentLightboxIndex = (currentLightboxIndex + direction + visibleItems.length) % visibleItems.length;
  updateLightbox();
}

categoryButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeCategory = button.dataset.category;
    categoryButtons.forEach((item) => {
      const selected = item === button;
      item.classList.toggle("active", selected);
      item.setAttribute("aria-pressed", String(selected));
    });
    renderGallery();
  });
});

destinationFilter.addEventListener("change", renderGallery);
searchInput.addEventListener("input", renderGallery);
document.querySelector("#gallery-clear").addEventListener("click", () => {
  activeCategory = "all";
  destinationFilter.value = "";
  searchInput.value = "";
  categoryButtons.forEach((button) => {
    const selected = button.dataset.category === "all";
    button.classList.toggle("active", selected);
    button.setAttribute("aria-pressed", String(selected));
  });
  renderGallery();
});
document.querySelector("#gallery-empty-clear").addEventListener("click", () => document.querySelector("#gallery-clear").click());

document.querySelector("#lightbox-close").addEventListener("click", closeLightbox);
document.querySelector("#lightbox-previous").addEventListener("click", () => moveLightbox(-1));
document.querySelector("#lightbox-next").addEventListener("click", () => moveLightbox(1));
lightbox.addEventListener("click", (event) => {
  if (event.target.matches("[data-lightbox-close]")) closeLightbox();
});
document.addEventListener("keydown", (event) => {
  if (lightbox.hidden) return;
  if (event.key === "Escape") {
    closeLightbox();
  } else if (event.key === "ArrowLeft") {
    event.preventDefault();
    moveLightbox(-1);
  } else if (event.key === "ArrowRight") {
    event.preventDefault();
    moveLightbox(1);
  } else if (event.key === "Tab") {
    const focusable = [...lightbox.querySelectorAll("button:not(:disabled)")];
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
});

const aliases = { "amalfi-coast": "amalfi", amalfi: "amalfi", kyoto: "kyoto", marrakech: "marrakech" };
const queryDestination = new URLSearchParams(window.location.search).get("destination")?.trim().toLowerCase().replaceAll(" ", "-");
const resolvedDestination = aliases[queryDestination] || queryDestination;
if (galleryItems.some((item) => item.destinationId === resolvedDestination)) destinationFilter.value = resolvedDestination;

const currentYear = document.querySelector("#current-year");
if (currentYear) currentYear.textContent = new Date().getFullYear();
renderGallery();
