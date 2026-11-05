// Frontend sample package catalog shared by the package listing and detail pages.
const defaultWanderlyPackages = [
  {
    id: "kyoto-7-days",
    destination: "Kyoto",
    country: "Japan",
    title: "Kyoto, at your own pace",
    description: "Temple mornings, tea-house afternoons, and a little time to wander the old lanes after dark.",
    duration: "7 days",
    durationDays: 7,
    price: 1690,
    priceLabel: "$1,690",
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1100&q=85",
    imageAlt: "Traditional Kyoto street with wooden houses",
    images: [
      { src: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1500&q=85", alt: "Traditional Kyoto street with wooden houses" },
      { src: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?auto=format&fit=crop&w=1000&q=85", alt: "Red torii gates along a Kyoto shrine path" }
    ],
    highlights: ["A private welcome walk through Gion", "A guided morning at Fushimi Inari", "A traditional tea ceremony", "Free time to explore Arashiyama"],
    activities: ["7 nights in a locally owned boutique stay", "Daily breakfast", "English-speaking local guide for two experiences", "Airport transfer on arrival"]
  },
  {
    id: "amalfi-6-days",
    destination: "Amalfi Coast",
    country: "Italy",
    title: "The Amalfi slow-down",
    description: "Coastal paths, long lunches, and an easy-going stay between cliffside villages and the sea.",
    duration: "6 days",
    durationDays: 6,
    price: 1890,
    priceLabel: "$1,890",
    image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1100&q=85",
    imageAlt: "Colorful Amalfi Coast houses overlooking the sea",
    images: [
      { src: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1500&q=85", alt: "Colorful Amalfi Coast houses overlooking the sea" },
      { src: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1000&q=85", alt: "Italian coastal village perched above the water" }
    ],
    highlights: ["A small-group boat day along the coast", "A guided lemon grove visit", "A scenic walk above the sea", "Time to discover Positano and Ravello"],
    activities: ["5 nights in a family-run coastal hotel", "Daily breakfast", "Boat excursion with local skipper", "One hosted dinner with regional specialties"]
  },
  {
    id: "marrakech-5-days",
    destination: "Marrakech",
    country: "Morocco",
    title: "A Marrakech medina story",
    description: "Find your way through the medina, share a slow meal, and discover the gardens beyond the souks.",
    duration: "5 days",
    durationDays: 5,
    price: 1290,
    priceLabel: "$1,290",
    image: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=1100&q=85",
    imageAlt: "Terracotta architecture and palms in Marrakech",
    images: [
      { src: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=1500&q=85", alt: "Terracotta architecture and palms in Marrakech" },
      { src: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1000&q=85", alt: "Warm lights and traditional architecture in a Moroccan city" }
    ],
    highlights: ["A guided introduction to the medina", "A hands-on Moroccan cooking afternoon", "A quiet pause at Jardin Majorelle", "A sunset rooftop tea"],
    activities: ["4 nights in a traditional riad", "Daily breakfast", "Medina walk with a local guide", "Cooking class and shared lunch"]
  },
  {
    id: "kyoto-10-days",
    destination: "Kyoto",
    country: "Japan",
    title: "Kyoto and the mountain villages",
    description: "Pair Kyoto’s timeless neighborhoods with a few restorative days in the surrounding countryside.",
    duration: "10 days",
    durationDays: 10,
    price: 2490,
    priceLabel: "$2,490",
    image: "https://images.unsplash.com/photo-1478436127897-769e1b3f0f36?auto=format&fit=crop&w=1100&q=85",
    imageAlt: "Pagoda framed by trees in Kyoto",
    images: [
      { src: "https://images.unsplash.com/photo-1478436127897-769e1b3f0f36?auto=format&fit=crop&w=1500&q=85", alt: "Pagoda framed by trees in Kyoto" },
      { src: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?auto=format&fit=crop&w=1000&q=85", alt: "Red torii gates leading up a forested shrine path" }
    ],
    highlights: ["Three nights in a countryside ryokan", "A guided temple and garden day", "A hands-on craft workshop", "Scenic rail journey into the hills"],
    activities: ["9 nights in boutique stays and a ryokan", "Daily breakfast and one ryokan dinner", "Rail transfers between destinations", "Two guided local experiences"]
  },
  {
    id: "amalfi-4-days",
    destination: "Amalfi Coast",
    country: "Italy",
    title: "A long weekend in Positano",
    description: "A few sunlit days with a beautiful base, a boat on the water, and plenty of time for nothing.",
    duration: "4 days",
    durationDays: 4,
    price: 1190,
    priceLabel: "$1,190",
    image: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1100&q=85",
    imageAlt: "Pastel buildings on the Italian coast",
    images: [
      { src: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1500&q=85", alt: "Pastel buildings on the Italian coast" },
      { src: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1000&q=85", alt: "Amalfi Coast village and blue sea" }
    ],
    highlights: ["A half-day coastal boat trip", "A sunset aperitivo tasting", "A free day for the beach or village lanes"],
    activities: ["3 nights in a Positano guesthouse", "Daily breakfast", "Shared boat excursion", "Arrival transfer from Naples"]
  }
];

// Admin edits are shared with the public package pages through this one catalog key.
const savedPackageCatalogKey = "wanderly-admin-packages-v1";
let publicPackages = defaultWanderlyPackages;
try {
  const savedPackages = JSON.parse(localStorage.getItem(savedPackageCatalogKey) || "null");
  if (Array.isArray(savedPackages)) {
    publicPackages = savedPackages
      .filter((trip) => trip && typeof trip.id === "string" && typeof trip.title === "string" && typeof trip.destination === "string" && typeof trip.country === "string" && typeof trip.duration === "string" && Number.isFinite(Number(trip.durationDays)) && Number(trip.durationDays) > 0 && Number.isFinite(Number(trip.price)) && Number(trip.price) > 0 && typeof trip.description === "string" && typeof trip.image === "string" && typeof trip.imageAlt === "string" && Array.isArray(trip.images) && trip.images.length > 0 && trip.images.every((photo) => photo && typeof photo.src === "string" && typeof photo.alt === "string") && Array.isArray(trip.highlights) && trip.highlights.every((item) => typeof item === "string") && Array.isArray(trip.activities) && trip.activities.every((item) => typeof item === "string"))
      .map((trip) => ({ ...trip, priceLabel: typeof trip.priceLabel === "string" ? trip.priceLabel : `$${Number(trip.price).toLocaleString("en-US")}` }));
  }
} catch (error) {
  // Keep the bundled examples available if local storage is missing or invalid.
}
window.WANDERLY_PACKAGES = publicPackages;
