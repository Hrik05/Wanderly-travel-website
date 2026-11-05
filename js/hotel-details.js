// Populate the reusable hotel page from the selected hotel ID.
const hotelId = new URLSearchParams(window.location.search).get("hotel");
const hotel = (window.WANDERLY_HOTELS || []).find((item) => item.id === hotelId);
const hotelDetailContent = document.querySelector("#hotel-detail-content");
const hotelInvalidState = document.querySelector("#hotel-invalid");

function addHotelListItems(listElement, values) {
  values.forEach((value) => {
    const item = document.createElement("li");
    item.textContent = value;
    listElement.append(item);
  });
}

if (hotel) {
  document.title = `${hotel.name} — Wanderly hotel details`;
  document.querySelector('meta[name="description"]').content = `${hotel.name} in ${hotel.location}: see the sample rooms, amenities, nightly rate, and guest reviews.`;
  document.querySelector("#hotel-name").textContent = hotel.name;
  document.querySelector("#hotel-location").textContent = `${hotel.location} · ${hotel.country}`;
  document.querySelector("#hotel-heading").textContent = `A little more about ${hotel.name}.`;
  document.querySelector("#hotel-description").textContent = hotel.description;
  document.querySelector("#hotel-rating-label").textContent = `${hotel.rating}.0 · ${hotel.rating}-star stay`;
  document.querySelector("#hotel-stars").textContent = "★".repeat(hotel.rating) + "☆".repeat(5 - hotel.rating);
  document.querySelector("#hotel-price").textContent = hotel.priceLabel;
  document.querySelector("#hotel-booking-price").textContent = hotel.priceLabel;
  document.querySelector("#hotel-room-name").textContent = hotel.room.name;
  document.querySelector("#hotel-room-description").textContent = hotel.room.description;
  document.querySelector("#hotel-check-in").textContent = hotel.checkIn;
  document.querySelector("#hotel-check-out").textContent = hotel.checkOut;
  document.querySelector("#hotel-back-link").href = `hotels.html?destination=${encodeURIComponent(hotel.destinationId)}`;
  document.querySelector("#hotel-reviews-link").href = `reviews.html?hotel=${encodeURIComponent(hotel.id)}`;
  const itineraryParams = new URLSearchParams({ destination: hotel.destinationId, hotel: hotel.id });
  document.querySelector("#hotel-itinerary-link").href = `itinerary.html?${itineraryParams.toString()}`;

  const heroImage = document.querySelector("#hotel-hero-image");
  heroImage.src = hotel.images[0].src;
  heroImage.alt = hotel.images[0].alt;

  const gallery = document.querySelector("#hotel-gallery");
  hotel.images.forEach((photo, index) => {
    const image = document.createElement("img");
    image.src = photo.src;
    image.alt = photo.alt;
    image.loading = "lazy";
    image.className = index === 0 ? "hotel-gallery-image hotel-gallery-primary" : "hotel-gallery-image";
    gallery.append(image);
  });

  addHotelListItems(document.querySelector("#hotel-amenities"), hotel.amenities);

  const reviewsContainer = document.querySelector("#hotel-reviews");
  hotel.reviews.forEach((review) => {
    const article = document.createElement("article");
    article.className = "hotel-review-card";
    const stars = document.createElement("p");
    stars.className = "review-stars";
    stars.setAttribute("aria-label", `${review.rating} out of 5 stars`);
    stars.textContent = "★".repeat(review.rating) + "☆".repeat(5 - review.rating);
    const quote = document.createElement("blockquote");
    quote.textContent = `“${review.text}”`;
    const author = document.createElement("p");
    author.className = "review-author";
    author.textContent = review.name;
    article.append(stars, quote, author);
    reviewsContainer.append(article);
  });
} else {
  hotelDetailContent.hidden = true;
  document.querySelector(".hotel-detail-hero").hidden = true;
  hotelInvalidState.hidden = false;
}

const currentYear = document.querySelector("#current-year");
if (currentYear) currentYear.textContent = new Date().getFullYear();
