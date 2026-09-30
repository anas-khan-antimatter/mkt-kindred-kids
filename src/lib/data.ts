export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  images: string[];
  category: string;
  season: string[];
  ageRange: string[];
  sizes: string[];
  colors: { name: string; hex: string }[];
  material: string;
  details: string[];
}

export const products: Product[] = [
  {
    id: "sunshine-smock",
    name: "Sunshine Smock Dress",
    price: 48,
    description: "A breezy cotton smock dress with embroidered daisies. Perfect for sunny days and twirling in the meadow.",
    image: "/images/sunshine-smock.jpg",
    images: ["/images/sunshine-smock.jpg", "/images/sunshine-smock-2.jpg"],
    category: "dresses",
    season: ["spring", "summer"],
    ageRange: ["toddler", "preschool", "school"],
    sizes: ["2T", "3T", "4T", "5", "6", "7", "8"],
    colors: [{ name: "Buttercup Yellow", hex: "#f5d742" }, { name: "Sky Blue", hex: "#87CEEB" }],
    material: "100% Organic Cotton",
    details: ["Ethically made", "Machine washable", "Button-back closure", "Petal sleeves"],
  },
  {
    id: "ramble-romper",
    name: "Ramble Romper",
    price: 42,
    description: "An earthy linen romper with patch pockets and elastic waist. Made for wild adventures and afternoon naps.",
    image: "/images/ramble-romper.jpg",
    images: ["/images/ramble-romper.jpg", "/images/ramble-romper-2.jpg"],
    category: "rompers",
    season: ["spring", "summer"],
    ageRange: ["toddler", "preschool"],
    sizes: ["2T", "3T", "4T", "5", "6", "7"],
    colors: [{ name: "Sage Green", hex: "#9CAF88" }, { name: "Terracotta", hex: "#D8825C" }],
    material: "80% Linen / 20% Cotton",
    details: ["Ethically made in India", "Snap closure at crotch", "Adjustable straps", "Oversized patch pockets"],
  },
  {
    id: "ocean-tee",
    name: "Ocean Stripe Tee",
    price: 28,
    description: "A soft striped t-shirt in nautical blues. Goes with everything from dungarees to tutus.",
    image: "/images/ocean-tee.jpg",
    images: ["/images/ocean-tee.jpg", "/images/ocean-tee-2.jpg"],
    category: "tops",
    season: ["spring", "summer", "fall"],
    ageRange: ["toddler", "preschool", "school"],
    sizes: ["2T", "3T", "4T", "5", "6", "7", "8"],
    colors: [{ name: "Navy Stripe", hex: "#1B2A4A" }, { name: "Red Stripe", hex: "#C23B22" }],
    material: "100% GOTS-Certified Organic Cotton",
    details: ["Certified organic", "Low-impact dyes", "Ribbed neckline", "Pair with our Wild Dungarees"],
  },
  {
    id: "wild-dungarees",
    name: "Wild Dungarees",
    price: 54,
    description: "Denim dungarees with adjustable straps, a roomy fit, and a hidden pocket for treasures.",
    image: "/images/wild-dungarees.jpg",
    images: ["/images/wild-dungarees.jpg", "/images/wild-dungarees-2.jpg"],
    category: "bottoms",
    season: ["spring", "summer", "fall"],
    ageRange: ["toddler", "preschool", "school"],
    sizes: ["2T", "3T", "4T", "5", "6", "7", "8"],
    colors: [{ name: "Indigo Wash", hex: "#2B3A67" }, { name: "Stone Wash", hex: "#B5B8B1" }],
    material: "100% Organic Cotton Denim",
    details: ["Adjustable button straps", "Elasticated back waist", "Hidden treasure pocket", "Reinforced knees"],
  },
  {
    id: "bloom-cardigan",
    name: "Bloom Cardigan",
    price: 46,
    description: "A chunky-knit cardigan with flower buttons. Snuggle-worthy for story time and forest walks.",
    image: "/images/bloom-cardigan.jpg",
    images: ["/images/bloom-cardigan.jpg", "/images/bloom-cardigan-2.jpg"],
    category: "layers",
    season: ["spring", "fall"],
    ageRange: ["toddler", "preschool", "school"],
    sizes: ["2T", "3T", "4T", "5", "6", "7", "8"],
    colors: [{ name: "Blush Pink", hex: "#F4C2C2" }, { name: "Mint", hex: "#B2D8B2" }],
    material: "100% Organic Cotton Knit",
    details: ["Wooden flower buttons", "Ribbed cuffs & hem", "Two front pockets", "Hypoallergenic yarn"],
  },
  {
    id: "cloud-joggers",
    name: "Cloud Joggers",
    price: 34,
    description: "Cloud-soft organic cotton joggers with a comfy elastic waist. Made for jumping, climbing, and lounging.",
    image: "/images/cloud-joggers.jpg",
    images: ["/images/cloud-joggers.jpg", "/images/cloud-joggers-2.jpg"],
    category: "bottoms",
    season: ["fall", "winter"],
    ageRange: ["toddler", "preschool", "school"],
    sizes: ["2T", "3T", "4T", "5", "6", "7", "8"],
    colors: [{ name: "Heather Grey", hex: "#C9C4BB" }, { name: "Dusty Lavender", hex: "#C4A4C4" }],
    material: "100% Organic Cotton French Terry",
    details: [" Elastic waistband", "Functional drawstring", "Ribbed cuffs", "Pill-resistant fabric"],
  },
  {
    id: "meadow-pinafore",
    name: "Meadow Pinafore",
    price: 50,
    description: "A floral-print pinafore with a swing silhouette. Layer over tees or turtlenecks all year round.",
    image: "/images/meadow-pinafore.jpg",
    images: ["/images/meadow-pinafore.jpg", "/images/meadow-pinafore-2.jpg"],
    category: "dresses",
    season: ["spring", "summer", "fall"],
    ageRange: ["toddler", "preschool"],
    sizes: ["2T", "3T", "4T", "5", "6", "7"],
    colors: [{ name: "Wildflower Print", hex: "#D4A574" }, { name: "Honeycomb Print", hex: "#E8B84B" }],
    material: "100% Organic Cotton Poplin",
    details: ["Adjustable cross-back straps", "Side smocking for growth", "Two front pockets", "Coordinating bloomers included"],
  },
  {
    id: "comet-hoodie",
    name: "Comet Hoodie",
    price: 44,
    description: "A tie-dye hoodie with a galaxy of color. Each one is uniquely hand-dyed for extra magic.",
    image: "/images/comet-hoodie.jpg",
    images: ["/images/comet-hoodie.jpg", "/images/comet-hoodie-2.jpg"],
    category: "layers",
    season: ["fall", "winter", "spring"],
    ageRange: ["toddler", "preschool", "school"],
    sizes: ["2T", "3T", "4T", "5", "6", "7", "8"],
    colors: [{ name: "Galaxy Tie-Dye", hex: "#5B4B8A" }, { name: "Sunset Tie-Dye", hex: "#E8735A" }],
    material: "100% Organic Cotton Fleece",
    details: ["Hand-dyed with low-impact dyes", "Each piece unique", "Kangaroo pocket", "Oversized star print on back"],
  },
];

export const collections = [
  {
    id: "meadow",
    name: "Meadow Collection",
    description: "Floral prints, soft pastels, and lightweight layers for spring adventures.",
    image: "/images/meadow-collection.jpg",
    slug: "meadow",
  },
  {
    id: "seaside",
    name: "Seaside Collection",
    description: "Nautical stripes, ocean blues, and breathable linens for summer by the shore.",
    image: "/images/seaside-collection.jpg",
    slug: "seaside",
  },
  {
    id: "harvest",
    name: "Harvest Collection",
    description: "Earthy tones, chunky knits, and cozy layers for autumn explorations.",
    image: "/images/harvest-collection.jpg",
    slug: "harvest",
  },
  {
    id: "cosmos",
    name: "Cosmos Collection",
    description: "Starry prints, galaxy dyes, and magical metallics for dreamers of all ages.",
    image: "/images/cosmos-collection.jpg",
    slug: "cosmos",
  },
];

export const sizeChart = {
  infants: [
    { size: "0-3M", height: 'Up to 24"', weight: "Up to 14 lbs", chest: '16"', waist: '15"' },
    { size: "3-6M", height: '24-27"', weight: "14-18 lbs", chest: '17"', waist: '16"' },
    { size: "6-12M", height: '27-30"', weight: "18-24 lbs", chest: '18"', waist: '17"' },
    { size: "12-18M", height: '30-33"', weight: "24-28 lbs", chest: '19"', waist: '18"' },
    { size: "18-24M", height: '33-35"', weight: "28-30 lbs", chest: '20"', waist: '19"' },
  ],
  kids: [
    { size: "2T", height: '35-37"', weight: "30-32 lbs", chest: '21"', waist: '20"' },
    { size: "3T", height: '37-39"', weight: "32-35 lbs", chest: '22"', waist: '20.5"' },
    { size: "4T", height: '39-41"', weight: "35-39 lbs", chest: '23"', waist: '21"' },
    { size: "5", height: '41-44"', weight: "39-45 lbs", chest: '24"', waist: '22"' },
    { size: "6", height: '44-47"', weight: "45-50 lbs", chest: '25"', waist: '22.5"' },
    { size: "7", height: '47-50"', weight: "50-57 lbs", chest: '26"', waist: '23"' },
    { size: "8", height: '50-53"', weight: "57-65 lbs", chest: '27"', waist: '24"' },
  ],
};

export const lookbookLooks = [
  { id: 1, title: "Morning Meadow", image: "/images/lookbook-1.jpg", description: "Sunshine Smock + Bloom Cardigan" },
  { id: 2, title: "Beachcomber", image: "/images/lookbook-2.jpg", description: "Ocean Stripe Tee + Wild Dungarees" },
  { id: 3, title: "Autumn Ramble", image: "/images/lookbook-3.jpg", description: "Ramble Romper + Comet Hoodie" },
  { id: 4, title: "Cloud Nine", image: "/images/lookbook-4.jpg", description: "Cloud Joggers + Ocean Stripe Tee" },
  { id: 5, title: "Garden Party", image: "/images/lookbook-5.jpg", description: "Meadow Pinafore + Blush Cardigan" },
  { id: 6, title: "Stargazer", image: "/images/lookbook-6.jpg", description: "Comet Hoodie + Wild Dungarees" },
];