// Sample hotel catalog shared by the listing and reusable hotel details page.
window.WANDERLY_HOTELS = [
  {
    id: "kyoto-grand-hotel", name: "The Kyoto Grand", destination: "Kyoto", destinationId: "kyoto", country: "Japan", location: "Higashiyama, Kyoto",
    rating: 5, price: 285, priceLabel: "$285", description: "A calm, contemporary hideaway close to Kyoto’s temple lanes, with considered rooms and a garden made for a quiet start to the day.",
    image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=85", imageAlt: "Elegant hotel exterior surrounded by greenery",
    images: [
      { src: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1600&q=85", alt: "Elegant hotel exterior surrounded by greenery" },
      { src: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1100&q=85", alt: "Warmly lit boutique hotel guest room" }
    ],
    amenities: ["Garden courtyard", "Onsen bath", "Complimentary Wi-Fi", "Tea lounge", "Concierge"],
    room: { name: "Garden King Room", description: "A quiet 32 m² room with a king bed, garden outlook, soaking tub, and locally made tea." },
    checkIn: "3:00 PM", checkOut: "11:00 AM",
    reviews: [{ name: "Maya R.", rating: 5, text: "The garden was the loveliest place to pause after a day exploring Kyoto. Thoughtful details everywhere." }, { name: "Oliver T.", rating: 5, text: "Peaceful, beautifully designed, and close to the old streets. We would happily return." }]
  },
  {
    id: "kyoto-machiya-house", name: "Sakura Machiya House", destination: "Kyoto", destinationId: "kyoto", country: "Japan", location: "Gion, Kyoto",
    rating: 4, price: 175, priceLabel: "$175", description: "A restored townhouse stay with timber details, a tiny courtyard, and the quiet charm of Kyoto’s historic Gion neighborhood.",
    image: "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=1200&q=85", imageAlt: "Intimate traditional guesthouse interior",
    images: [
      { src: "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=1600&q=85", alt: "Intimate traditional guesthouse interior" },
      { src: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1100&q=85", alt: "Natural wood and linen in a serene guest room" }
    ],
    amenities: ["Courtyard", "Breakfast room", "Complimentary Wi-Fi", "Bicycle hire", "Luggage storage"],
    room: { name: "Machiya Twin Room", description: "A 24 m² room with twin beds, tatami sitting nook, and views across the neighborhood rooftops." },
    checkIn: "3:00 PM", checkOut: "10:00 AM",
    reviews: [{ name: "Nina P.", rating: 5, text: "A lovely old house with a warm welcome. The location made early morning walks so easy." }, { name: "Sam K.", rating: 4, text: "Small and full of character, with a peaceful courtyard and great neighborhood cafés." }]
  },
  {
    id: "amalfi-vista-palace", name: "Vista di Amalfi", destination: "Amalfi Coast", destinationId: "amalfi", country: "Italy", location: "Amalfi, Salerno",
    rating: 5, price: 365, priceLabel: "$365", description: "A sun-washed coastal retreat with a terrace above the water, a lemon-scented garden, and an easy stroll to Amalfi’s old center.",
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=85", imageAlt: "Mediterranean hotel terrace and swimming pool",
    images: [
      { src: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1600&q=85", alt: "Mediterranean hotel terrace and swimming pool" },
      { src: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1100&q=85", alt: "Bright coastal hotel room with a balcony" }
    ],
    amenities: ["Sea-view terrace", "Outdoor pool", "Breakfast", "Complimentary Wi-Fi", "Shuttle to the harbor"],
    room: { name: "Sea View Balcony Room", description: "A 30 m² room with a private balcony, king bed, and a wide view across the coast." },
    checkIn: "2:00 PM", checkOut: "11:00 AM",
    reviews: [{ name: "Elena C.", rating: 5, text: "The view at breakfast was unforgettable. The team made everything feel relaxed and personal." }, { name: "Theo B.", rating: 5, text: "A beautiful base for exploring the coast, with a lovely terrace to come home to." }]
  },
  {
    id: "amalfi-casa-limone", name: "Casa del Limone", destination: "Amalfi Coast", destinationId: "amalfi", country: "Italy", location: "Ravello, Salerno",
    rating: 4, price: 210, priceLabel: "$210", description: "A small family-run guesthouse tucked among the lemon groves of Ravello, with welcoming rooms and a garden breakfast table.",
    image: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1200&q=85", imageAlt: "Colorful Amalfi Coast town and surrounding hills",
    images: [
      { src: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1600&q=85", alt: "Colorful Amalfi Coast town and surrounding hills" },
      { src: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1100&q=85", alt: "Comfortable guest room with soft natural light" }
    ],
    amenities: ["Lemon garden", "Breakfast", "Complimentary Wi-Fi", "Terrace", "Local walking maps"],
    room: { name: "Garden Double Room", description: "A 22 m² room with a queen bed, garden-facing windows, and locally crafted furnishings." },
    checkIn: "2:00 PM", checkOut: "10:30 AM",
    reviews: [{ name: "Grace L.", rating: 5, text: "Breakfast under the lemon trees was a highlight. Such a kind family and a peaceful place." }, { name: "Marco D.", rating: 4, text: "A lovely quiet stay above the coast, and a wonderful starting point for walks." }]
  },
  {
    id: "marrakech-riad-noor", name: "Riad Noor", destination: "Marrakech", destinationId: "marrakech", country: "Morocco", location: "Medina, Marrakech",
    rating: 5, price: 195, priceLabel: "$195", description: "Step through a carved cedar door into a calm riad of tiled courtyards, shaded corners, and rooftop views over the medina.",
    image: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=1200&q=85", imageAlt: "Warm terracotta architecture and palms in Marrakech",
    images: [
      { src: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=1600&q=85", alt: "Warm terracotta architecture and palms in Marrakech" },
      { src: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1100&q=85", alt: "Quietly decorated room with handcrafted details" }
    ],
    amenities: ["Rooftop terrace", "Plunge pool", "Breakfast", "Complimentary Wi-Fi", "Hammam treatments"],
    room: { name: "Patio Suite", description: "A 28 m² suite with a king bed, hand-finished tilework, and views into the central courtyard." },
    checkIn: "2:00 PM", checkOut: "11:00 AM",
    reviews: [{ name: "Aisha M.", rating: 5, text: "A peaceful oasis right in the medina. The rooftop and mint tea made every evening special." }, { name: "Ben W.", rating: 5, text: "Beautiful tilework, generous hospitality, and a wonderfully calm courtyard." }]
  },
  {
    id: "marrakech-dar-safran", name: "Dar Safran", destination: "Marrakech", destinationId: "marrakech", country: "Morocco", location: "Kasbah Quarter, Marrakech",
    rating: 3, price: 125, priceLabel: "$125", description: "A welcoming neighborhood riad with a leafy courtyard, colorful artisan details, and easy access to the Kasbah’s historic lanes.",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=85", imageAlt: "Traditional Moroccan architecture at golden hour",
    images: [
      { src: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1600&q=85", alt: "Traditional Moroccan architecture at golden hour" },
      { src: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1100&q=85", alt: "A calm guest room with natural textures" }
    ],
    amenities: ["Courtyard fountain", "Breakfast", "Complimentary Wi-Fi", "Airport transfer on request", "Rooftop seating"],
    room: { name: "Zellige Double Room", description: "A 20 m² double room with a queen bed, colorful zellige accents, and courtyard outlook." },
    checkIn: "1:00 PM", checkOut: "11:00 AM",
    reviews: [{ name: "Luca F.", rating: 4, text: "Friendly and full of character. We loved sitting in the courtyard after a busy day." }, { name: "Mina S.", rating: 5, text: "A warm welcome and a great location for exploring the Kasbah on foot." }]
  }
];
