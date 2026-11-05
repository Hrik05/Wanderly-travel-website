// Sample destination content for the reusable details page. Add destinations here
// as the homepage grows; each entry is selected with ?place=its-key.
const destinations = {
  amalfi: {
    name: "Amalfi Coast",
    country: "Italy · Southern Italy",
    region: "Amalfi Coast, Italy",
    tagline: "Salt air, slow afternoons, endless blue.",
    image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=2200&q=90",
    imageAlt: "Colorful villages climbing the cliffs above the Amalfi Coast",
    description: "Along southern Italy’s storied coastline, lemon groves spill toward the sea and pastel villages cling to the cliffs. Take the scenic road between towns, linger over a long lunch, and let the light over the water set the pace.",
    duration: "5–7 days",
    places: ["Positano — hillside lanes and a wide-open sea view", "Ravello — quiet gardens above the coastline", "Amalfi — the cathedral piazza and old harbor", "Path of the Gods — a cliffside walk between sky and sea"]
  },
  kyoto: {
    name: "Kyoto",
    country: "Japan · Kansai",
    region: "Kyoto, Japan",
    tagline: "Old souls and quiet rituals.",
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=2200&q=90",
    imageAlt: "Traditional wooden houses along a quiet Kyoto street",
    description: "Kyoto invites you to slow down and notice the details: a lantern glowing at dusk, the hush of a temple garden, the first tea of the morning. Ancient lanes and neighborhood cafés sit side by side, making every unhurried turn feel like a discovery.",
    duration: "4–6 days",
    places: ["Fushimi Inari Taisha — a path through thousands of red torii gates", "Arashiyama — bamboo groves and riverside walks", "Gion — lantern-lit streets and traditional wooden houses", "Philosopher’s Path — a leafy canal walk between temples"]
  },
  marrakech: {
    name: "Marrakech",
    country: "Morocco · Marrakech-Safi",
    region: "Marrakech, Morocco",
    tagline: "Get lost in a thousand shades.",
    image: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=2200&q=90",
    imageAlt: "Warm terracotta architecture and palms in Marrakech",
    description: "Marrakech is a city of contrasts and color, where the medina’s winding souks open onto peaceful courtyards and garden paths. Follow the scent of spices, pause for mint tea, and let the city’s generous energy draw you into its everyday rhythms.",
    duration: "3–5 days",
    places: ["Jemaa el-Fnaa — the lively central square", "Bahia Palace — intricate courtyards and tilework", "Jardin Majorelle — a calm garden in vivid blue", "The Medina souks — winding lanes full of local craft"]
  }
};

const requestedPlace = new URLSearchParams(window.location.search).get("place")?.toLowerCase();
const destination = destinations[requestedPlace];

if (destination) {
  document.title = `${destination.name} — Wanderly destination guide`;
  document.querySelector('meta[name="description"]').content = `Discover ${destination.name}, ${destination.country}. Find a suggested trip length and places to explore with Wanderly.`;
  document.querySelector("#destination-name").textContent = destination.name;
  document.querySelector("#destination-country").textContent = destination.country;
  document.querySelector("#destination-region").textContent = destination.region;
  document.querySelector("#destination-tagline").textContent = destination.tagline;
  document.querySelector("#destination-heading").textContent = `A little more about ${destination.name}.`;
  document.querySelector("#destination-description").textContent = destination.description;
  document.querySelector("#destination-duration").textContent = destination.duration;
  document.querySelector("#destination-hotels-link").href = `hotels.html?destination=${encodeURIComponent(requestedPlace)}`;
  document.querySelector("#destination-flights-link").href = `flights.html?to=${encodeURIComponent(requestedPlace)}`;
  document.querySelector("#destination-itinerary-link").href = `itinerary.html?destination=${encodeURIComponent(requestedPlace)}`;
  document.querySelector("#destination-gallery-link").href = `gallery.html?destination=${encodeURIComponent(requestedPlace)}`;
  document.querySelector("#destination-reviews-link").href = `reviews.html?destination=${encodeURIComponent(requestedPlace)}`;

  const image = document.querySelector("#destination-image");
  image.src = destination.image;
  image.alt = destination.imageAlt;

  const placesList = document.querySelector("#destination-places");
  destination.places.forEach((place) => {
    const listItem = document.createElement("li");
    listItem.textContent = place;
    placesList.append(listItem);
  });
} else {
  // Keep an unknown or missing query value useful and provide a clear route back.
  document.querySelector("#destination-name").textContent = "A place to begin again.";
  document.querySelector("#destination-country").textContent = "DESTINATION GUIDE";
  document.querySelector("#destination-tagline").textContent = "Choose a destination from the Wanderly homepage to see its guide.";
  document.querySelector("#destination-image").hidden = true;
  document.querySelector(".detail-hero").classList.add("detail-hero-empty");
  document.querySelector(".detail-content").hidden = true;
  document.querySelector(".detail-photo-credit").hidden = true;
}

const year = document.querySelector("#current-year");
if (year) year.textContent = new Date().getFullYear();
