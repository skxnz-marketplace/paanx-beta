export type Category = {
  id: string;
  slug: string;
  name: string;
  description: string;
  isRestricted: boolean;
  sortOrder: number;
};

export const categories: Category[] = [
  {
    id: "cat-cold-drinks",
    slug: "cold-drinks",
    name: "Cold Drinks",
    description: "Chilled soft drinks, colas, juices and energy drinks.",
    isRestricted: false,
    sortOrder: 1,
  },
  {
    id: "cat-water-soda",
    slug: "water-soda",
    name: "Water & Soda",
    description: "Packaged drinking water, soda and tonic water.",
    isRestricted: false,
    sortOrder: 2,
  },
  {
    id: "cat-chips",
    slug: "chips",
    name: "Chips",
    description: "Potato chips, nachos, popcorn and crunchy snacks.",
    isRestricted: false,
    sortOrder: 3,
  },
  {
    id: "cat-namkeen",
    slug: "namkeen",
    name: "Namkeen",
    description: "Bhujia, mixtures and classic Indian namkeen.",
    isRestricted: false,
    sortOrder: 4,
  },
  {
    id: "cat-biscuits",
    slug: "biscuits",
    name: "Biscuits",
    description: "Glucose, cream, cookie and tea-time biscuits.",
    isRestricted: false,
    sortOrder: 5,
  },
  {
    id: "cat-chocolates",
    slug: "chocolates",
    name: "Chocolates",
    description: "Chocolate bars, wafers and chocolate candies.",
    isRestricted: false,
    sortOrder: 6,
  },
  {
    id: "cat-mints-gum",
    slug: "mints-gum",
    name: "Mints & Gum",
    description: "Chewing gum, mints and candy.",
    isRestricted: false,
    sortOrder: 7,
  },
  {
    id: "cat-mouth-fresheners",
    slug: "mouth-fresheners",
    name: "Mouth Fresheners",
    description: "Mukhwas, flavoured saunf, elaichi and after-meal fresheners.",
    isRestricted: false,
    sortOrder: 8,
  },
  {
    id: "cat-paan-ingredients",
    slug: "paan-ingredients",
    name: "Paan Ingredients",
    description: "Gulkand, kattha, chuna, toppings and paan essentials.",
    isRestricted: false,
    sortOrder: 9,
  },
  {
    id: "cat-supari-saunf",
    slug: "supari-saunf",
    name: "Supari & Saunf",
    description: "Sweet supari, cutting supari and saunf mixes.",
    isRestricted: false,
    sortOrder: 10,
  },
  {
    id: "cat-pan-masala",
    slug: "pan-masala",
    name: "Pan Masala",
    description: "Age-restricted pan masala products.",
    isRestricted: true,
    sortOrder: 11,
  },
  {
    id: "cat-cigarettes",
    slug: "cigarettes",
    name: "Cigarettes",
    description: "Age-restricted cigarette products.",
    isRestricted: true,
    sortOrder: 12,
  },
  {
    id: "cat-khaini-zarda",
    slug: "khaini-zarda",
    name: "Khaini / Zarda / Chewing Tobacco",
    description: "Age-restricted khaini, zarda and chewing tobacco products.",
    isRestricted: true,
    sortOrder: 13,
  },
  {
    id: "cat-hookah-flavours",
    slug: "hookah-flavours",
    name: "Hookah Flavours",
    description: "Age-restricted hookah flavours and related consumables.",
    isRestricted: true,
    sortOrder: 14,
  },
  {
    id: "cat-lighters-accessories",
    slug: "lighters-accessories",
    name: "Lighters & Accessories",
    description: "Matches, lighters, refills and smoking accessories.",
    isRestricted: true,
    sortOrder: 15,
  },
];

export const restrictedCategories = categories
  .filter((category) => category.isRestricted)
  .map((category) => category.name);

export function getCategoryBySlug(slug: string) {
  return categories.find((category) => category.slug === slug);
}
