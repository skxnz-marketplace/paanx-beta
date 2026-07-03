export type StockState = "in_stock" | "low_stock" | "out_of_stock";

export type Product = {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: string;
  subcategory: string;
  packSize: string;
  price: number;
  mrp: number;
  priceType: "fixed" | "market";
  image: string;
  sourceUrl: string;
  sourceName: string;
  lastChecked: string;
  isRestricted: boolean;
  tags: string[];
  stock: StockState;
};

const checked = "2026-07-03";

const product = (
  id: number,
  slug: string,
  name: string,
  brand: string,
  category: string,
  subcategory: string,
  packSize: string,
  price: number,
  mrp: number,
  isRestricted = false,
  tags: string[] = [],
): Product => ({
  id: `paanx-${id.toString().padStart(3, "0")}`,
  slug,
  name,
  brand,
  category,
  subcategory,
  packSize,
  price,
  mrp,
  priceType: "fixed",
  image: "",
  sourceUrl: "local-sample-data",
  sourceName: "PAANX temporary catalog",
  lastChecked: checked,
  isRestricted,
  tags,
  stock: id % 11 === 0 ? "low_stock" : "in_stock",
});

export const restrictedCategories = [
  "Cigarettes",
  "Pan Masala",
  "Khaini / Zarda / Chewing Tobacco",
  "Hookah Flavours",
  "Lighters & Accessories",
];

export const products: Product[] = [
  product(1, "classic-sweet-paan-kit", "Classic Sweet Paan Kit", "PAANX Atelier", "Paan Kits", "Sweet Paan", "Pack of 4", 149, 179, false, ["fresh", "bestseller"]),
  product(2, "banarasi-meetha-paan-kit", "Banarasi Meetha Paan Kit", "PAANX Atelier", "Paan Kits", "Regional", "Pack of 4", 169, 199, false, ["sweet"]),
  product(3, "calcutta-saada-paan-kit", "Calcutta Saada Paan Kit", "PAANX Atelier", "Paan Kits", "Saada", "Pack of 4", 139, 169, false, ["classic"]),
  product(4, "gulkand-rose-paan-kit", "Gulkand Rose Paan Kit", "PAANX Atelier", "Paan Kits", "Dessert", "Pack of 4", 189, 229, false, ["rose"]),
  product(5, "silver-varq-paan-kit", "Silver Varq Paan Kit", "PAANX Atelier", "Paan Kits", "Premium", "Pack of 4", 249, 299, false, ["premium"]),
  product(6, "betel-leaf-fresh-bundle", "Fresh Betel Leaf Bundle", "Leaf House", "Fresh Leaves", "Betel Leaf", "20 leaves", 89, 110, false, ["fresh"]),
  product(7, "maghai-paan-leaves", "Maghai Paan Leaves", "Leaf House", "Fresh Leaves", "Maghai", "20 leaves", 119, 149, false, ["premium"]),
  product(8, "calcutta-paan-leaves", "Calcutta Paan Leaves", "Leaf House", "Fresh Leaves", "Calcutta", "20 leaves", 99, 129, false, ["fresh"]),
  product(9, "gulkand-premium-jar", "Premium Gulkand Jar", "Royal Pantry", "Paan Ingredients", "Gulkand", "200 g", 159, 199, false, ["sweet"]),
  product(10, "rose-petal-preserve", "Rose Petal Preserve", "Royal Pantry", "Paan Ingredients", "Preserve", "250 g", 179, 220, false, ["rose"]),
  product(11, "saunf-silver-coated", "Silver Coated Saunf", "Mukhwaas Co.", "Mouth Fresheners", "Saunf", "100 g", 89, 110, false, ["aftermeal"]),
  product(12, "paan-mukhwas-mix", "Paan Mukhwas Mix", "Mukhwaas Co.", "Mouth Fresheners", "Mix", "150 g", 129, 160, false, ["aftermeal"]),
  product(13, "elaichi-premium-pods", "Premium Elaichi Pods", "Spice Vault", "Paan Ingredients", "Cardamom", "50 g", 199, 240, false, ["premium"]),
  product(14, "dry-dates-chopped", "Chopped Dry Dates", "Spice Vault", "Paan Ingredients", "Dry Fruit", "150 g", 149, 180, false, ["sweet"]),
  product(15, "tutti-frutti-cubes", "Tutti Frutti Cubes", "Dessert Pantry", "Paan Ingredients", "Topping", "200 g", 95, 120, false, ["dessert"]),
  product(16, "coconut-slivers-sweet", "Sweet Coconut Slivers", "Dessert Pantry", "Paan Ingredients", "Coconut", "150 g", 109, 140, false, ["sweet"]),
  product(17, "chuna-food-grade", "Food Grade Chuna", "PAANX Essentials", "Paan Ingredients", "Chuna", "50 g", 39, 50, false, ["essential"]),
  product(18, "katha-premium-paste", "Premium Katha Paste", "PAANX Essentials", "Paan Ingredients", "Katha", "50 g", 69, 90, false, ["essential"]),
  product(19, "clove-whole-premium", "Whole Clove Premium", "Spice Vault", "Paan Ingredients", "Clove", "50 g", 129, 160, false, ["spice"]),
  product(20, "supari-sweet-cut", "Sweet Cut Supari", "Mukhwaas Co.", "Mouth Fresheners", "Supari", "100 g", 89, 110, false, ["aftermeal"]),
  product(21, "premium-pan-masala-classic", "Premium Pan Masala Classic", "Regal Blend", "Pan Masala", "Classic", "100 g", 145, 160, true, ["18plus"]),
  product(22, "pan-masala-silver-blend", "Pan Masala Silver Blend", "Regal Blend", "Pan Masala", "Silver", "100 g", 175, 199, true, ["18plus"]),
  product(23, "classic-cigarette-pack", "Classic Cigarette Pack", "Age Verified Co.", "Cigarettes", "King Size", "Pack of 20", 340, 340, true, ["18plus"]),
  product(24, "mint-cigarette-pack", "Mint Cigarette Pack", "Age Verified Co.", "Cigarettes", "Filter", "Pack of 20", 360, 360, true, ["18plus"]),
  product(25, "zarda-premium-tin", "Premium Zarda Tin", "Heritage Leaf", "Khaini / Zarda / Chewing Tobacco", "Zarda", "50 g", 125, 140, true, ["18plus"]),
  product(26, "khaini-classic-pouch", "Classic Khaini Pouch", "Heritage Leaf", "Khaini / Zarda / Chewing Tobacco", "Khaini", "40 g", 65, 75, true, ["18plus"]),
  product(27, "hookah-flavour-mint", "Hookah Flavour Mint", "Cloud Table", "Hookah Flavours", "Mint", "50 g", 145, 175, true, ["18plus"]),
  product(28, "hookah-flavour-rose", "Hookah Flavour Rose", "Cloud Table", "Hookah Flavours", "Rose", "50 g", 145, 175, true, ["18plus"]),
  product(29, "soft-flame-lighter", "Soft Flame Lighter", "PAANX Essentials", "Lighters & Accessories", "Lighter", "1 unit", 49, 60, true, ["18plus"]),
  product(30, "metal-pocket-lighter", "Metal Pocket Lighter", "PAANX Essentials", "Lighters & Accessories", "Lighter", "1 unit", 149, 199, true, ["18plus"]),
  product(31, "paan-daan-brass-small", "Brass Paan Daan Small", "Home Ritual", "Accessories", "Storage", "1 unit", 899, 1199, false, ["gift"]),
  product(32, "paan-serving-tray", "Paan Serving Tray", "Home Ritual", "Accessories", "Serving", "1 unit", 549, 699, false, ["gift"]),
  product(33, "mini-silver-paan-box", "Mini Silver Paan Box", "Home Ritual", "Accessories", "Storage", "1 unit", 399, 499, false, ["premium"]),
  product(34, "rose-syrup-small", "Rose Syrup Small", "Royal Pantry", "Beverages", "Syrup", "500 ml", 129, 160, false, ["rose"]),
  product(35, "kesar-thandai-mix", "Kesar Thandai Mix", "Royal Pantry", "Beverages", "Mix", "200 g", 229, 275, false, ["premium"]),
  product(36, "masala-soda-pack", "Masala Soda Pack", "Fizz Table", "Beverages", "Soda", "Pack of 4", 120, 140, false, ["chilled"]),
  product(37, "premium-mouth-freshener-gift", "Premium Mouth Freshener Gift Box", "Mukhwaas Co.", "Mouth Fresheners", "Gift Box", "300 g", 349, 425, false, ["gift"]),
  product(38, "anardana-digestive-mix", "Anardana Digestive Mix", "Mukhwaas Co.", "Mouth Fresheners", "Digestive", "120 g", 99, 130, false, ["aftermeal"]),
  product(39, "paan-chocolate-bites", "Paan Chocolate Bites", "Dessert Pantry", "Sweets", "Chocolate", "12 pieces", 249, 299, false, ["dessert"]),
  product(40, "rose-gulkand-laddoo", "Rose Gulkand Laddoo", "Dessert Pantry", "Sweets", "Laddoo", "6 pieces", 299, 349, false, ["dessert"]),
];

export const categories = Array.from(
  new Map(
    products.map((item) => [
      item.category,
      {
        name: item.category,
        slug: slugify(item.category),
        count: products.filter((productItem) => productItem.category === item.category).length,
        isRestricted: restrictedCategories.includes(item.category),
      },
    ]),
  ).values(),
);

export function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/\//g, " ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function getProductBySlug(slug: string) {
  return products.find((item) => item.slug === slug);
}

export function getCategoryBySlug(slug: string) {
  return categories.find((category) => category.slug === slug);
}

export function getProductsByCategory(slug: string) {
  const category = getCategoryBySlug(slug);
  if (!category) return [];
  return products.filter((item) => item.category === category.name);
}
