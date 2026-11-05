// Small, browser-only interactions for the Wanderly home page.

// Search matches the sample destinations shown on this page. Month and group size
// are collected as trip-planning details; no external booking service is contacted.
const searchForm = document.querySelector("#destination-search");
const searchInput = document.querySelector("#search-location");
const searchFeedback = document.querySelector("#search-feedback");
const destinationCards = [...document.querySelectorAll(".destination-card")];

if (searchForm && searchInput && searchFeedback) {
  searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const query = searchInput.value.trim().toLowerCase();

    destinationCards.forEach((card) => {
      const searchableText = `${card.dataset.destination} ${card.querySelector("h3").textContent}`.toLowerCase();
      card.hidden = Boolean(query) && !searchableText.includes(query);
    });

    const visibleCards = destinationCards.filter((card) => !card.hidden);
    if (!query) {
      searchFeedback.textContent = "Showing all featured destinations. Choose a place to narrow your search.";
    } else if (visibleCards.length) {
      searchFeedback.textContent = `${visibleCards.length} featured ${visibleCards.length === 1 ? "destination" : "destinations"} match “${searchInput.value.trim()}”. Your trip details are ready to explore.`;
    } else {
      searchFeedback.textContent = `No featured destinations match “${searchInput.value.trim()}”. Try Amalfi, Kyoto, or Marrakech.`;
    }

    document.querySelector("#destinations").scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

// Save destinations in localStorage so the heart state persists on this device.
const savedStorageKey = "wanderly-saved-destinations";
let savedDestinations = [];
try {
  savedDestinations = JSON.parse(localStorage.getItem(savedStorageKey) || "[]");
  if (!Array.isArray(savedDestinations)) savedDestinations = [];
} catch {
  savedDestinations = [];
}

document.querySelectorAll(".save-button").forEach((button) => {
  const card = button.closest(".destination-card");
  const destinationName = card.querySelector("h3").textContent.trim();
  const isSaved = savedDestinations.includes(destinationName);
  button.setAttribute("aria-pressed", String(isSaved));
  button.textContent = isSaved ? "♥" : "♡";

  button.addEventListener("click", () => {
    const currentlySaved = button.getAttribute("aria-pressed") === "true";
    savedDestinations = currentlySaved
      ? savedDestinations.filter((name) => name !== destinationName)
      : [...savedDestinations, destinationName];
    button.setAttribute("aria-pressed", String(!currentlySaved));
    button.textContent = currentlySaved ? "♡" : "♥";

    try {
      localStorage.setItem(savedStorageKey, JSON.stringify(savedDestinations));
    } catch {
      // Saving is a convenience; the button still works for this visit if storage is unavailable.
    }
  });
});

// This sample form validates locally and confirms the action without sending data.
const newsletterForm = document.querySelector("#newsletter-form");
const emailInput = document.querySelector("#newsletter-email");
const newsletterMessage = document.querySelector("#newsletter-message");

if (newsletterForm && emailInput && newsletterMessage) {
  newsletterForm.addEventListener("submit", (event) => {
    event.preventDefault();
    newsletterMessage.classList.remove("error", "success");

    if (!emailInput.validity.valid || !emailInput.value.trim()) {
      newsletterMessage.textContent = "Enter a valid email address to join the list.";
      newsletterMessage.classList.add("error");
      emailInput.focus();
      return;
    }

    newsletterMessage.textContent = "Thanks for stopping by. Newsletter signup is a demo and your email was not sent.";
    newsletterMessage.classList.add("success");
    newsletterForm.reset();
  });
}

const year = document.querySelector("#current-year");
if (year) year.textContent = new Date().getFullYear();
