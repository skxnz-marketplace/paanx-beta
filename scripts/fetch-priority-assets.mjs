import fs from "node:fs";
import path from "node:path";

const today = "2026-07-04";
const prioritySlugs = [
  "coca-cola-750ml",
  "coca-cola-can-300ml",
  "thums-up-750ml",
  "sprite-750ml",
  "fanta-750ml",
  "maaza-600ml",
  "pepsi-750ml",
  "mountain-dew-750ml",
  "sting-energy-250ml",
  "red-bull-250ml",
  "bisleri-1l",
  "kinley-1l",
  "lays-magic-masala-48g",
  "lays-classic-salted-48g",
  "lays-american-cream-onion-48g",
  "kurkure-masala-munch-75g",
  "bingo-mad-angles-achaari-masti-66g",
  "bingo-tedhe-medhe-80g",
  "uncle-chipps-spicy-treat-50g",
  "pringles-original-107g",
  "haldirams-aloo-bhujia-200g",
  "haldirams-moong-dal-200g",
  "parle-g-original-70g",
  "parle-hide-seek-chocolate-100g",
  "britannia-good-day-cashew-75g",
  "britannia-marie-gold-120g",
  "oreo-vanilla-creme-43g",
  "britannia-bourbon-100g",
  "cadbury-dairy-milk-23g",
  "cadbury-5-star-40g",
  "center-fresh-mint-pouch",
  "center-fruit-pouch",
  "orbit-spearmint-22g",
  "mentos-mint-roll",
  "pulse-kachcha-aam-candy",
  "happydent-white-pouch",
  "polo-mint-roll",
  "pass-pass-classic-pouch",
  "rajnigandha-pearls-tin",
  "baba-elaichi-pouch",
  "gulkand-jar-200g",
  "kattha-paste-50g",
  "chuna-tube-30g",
  "tutti-frutti-100g",
  "cutting-supari-100g",
  "flavoured-saunf-mix-100g",
  "rajnigandha-pan-masala-pouch",
  "rajnigandha-pan-masala-tin",
  "pan-bahar-pouch",
  "vimal-pan-masala-pouch",
  "classic-milds-pack-20",
  "gold-flake-kings-pack-20",
  "wills-navy-cut-pack-10",
  "marlboro-red-pack-20",
  "chaini-khaini-pouch",
  "hans-chhap-zarda",
  "afzal-pan-ras-flavour-50g",
  "soex-herbal-double-apple-50g",
  "ship-matchbox-single",
  "pocket-lighter-standard",
];

const folderByCategory = {
  "cold-drinks": "beverages",
  "water-soda": "beverages",
  chips: "chips-snacks",
  namkeen: "chips-snacks",
  biscuits: "biscuits-chocolates",
  chocolates: "biscuits-chocolates",
  "mints-gum": "mints-gum",
  "mouth-fresheners": "mouth-fresheners",
  "paan-ingredients": "paan-ingredients",
  "supari-saunf": "paan-ingredients",
  "pan-masala": "pan-masala",
  cigarettes: "cigarettes",
  "khaini-zarda": "khaini-zarda",
  "hookah-flavours": "hookah-accessories",
  "lighters-accessories": "accessories",
};

const productPath = "src/data/products.ts";
const sourceText = fs.readFileSync(productPath, "utf8");
const productLines = sourceText.split(/\r?\n/);

function field(line, name) {
  const match = line.match(new RegExp(`${name}: "([^"]*)"`));
  return match?.[1] ?? "";
}

function stripPack(packSize) {
  return packSize
    .replace(/\([^)]*\)/g, "")
    .replace(/\bPET\b/gi, "")
    .replace(/\bcan\b/gi, "")
    .replace(/\bbottle\b/gi, "")
    .replace(/\bpouch\b/gi, "")
    .replace(/\bpack\b/gi, "")
    .replace(/\bStandard\b/gi, "")
    .trim();
}

function queryFor(product) {
  return `${product.name} ${product.brand} ${stripPack(product.packSize)} India`
    .replace(/[()]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function localImagePath(product) {
  const folder = folderByCategory[product.category] ?? "accessories";
  return `/products/${folder}/${product.slug}.jpg`;
}

function updateStringField(line, name, value) {
  if (line.includes(`${name}: "`)) {
    return line.replace(new RegExp(`${name}: "[^"]*"`), `${name}: "${value}"`);
  }
  return line.replace(/, isRestricted:/, `, ${name}: "${value}", isRestricted:`);
}

function removeImageNeeded(line) {
  return line
    .replace(/, "image_needed"/g, "")
    .replace(/"image_needed", /g, "")
    .replace(/"image_needed"/g, "");
}

function parseProducts() {
  return productLines
    .map((line, index) => ({ line, index }))
    .filter(({ line }) => /^  \{ id:/.test(line))
    .map(({ line, index }) => ({
      index,
      id: field(line, "id"),
      slug: field(line, "slug"),
      name: field(line, "name"),
      brand: field(line, "brand"),
      category: field(line, "category"),
      packSize: field(line, "packSize"),
      image: field(line, "image"),
      sourceUrl: field(line, "sourceUrl"),
      sourceName: field(line, "sourceName"),
      lastChecked: field(line, "lastChecked"),
      priceType: field(line, "priceType"),
    }));
}

async function fetchJson(url) {
  const response = await fetch(url, {
    headers: {
      "User-Agent": "PAANX beta catalog research (contact: local)",
    },
  });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
  return response.json();
}

async function findOpenFoodFactsProduct(product) {
  const params = new URLSearchParams({
    search_terms: queryFor(product),
    search_simple: "1",
    action: "process",
    json: "1",
    page_size: "5",
    fields: "product_name,brands,quantity,image_front_url,image_url,url,countries_tags",
  });
  const json = await fetchJson(
    `https://world.openfoodfacts.org/cgi/search.pl?${params.toString()}`,
  );
  const candidates = json.products ?? [];
  const brandNeedle = product.brand
    .replace(/\s*\([^)]*\)/g, "")
    .replace(/!$/, "")
    .toLowerCase();
  return candidates.find((candidate) => {
    const imageUrl = candidate.image_front_url || candidate.image_url;
    if (!imageUrl) return false;
    const haystack = `${candidate.product_name ?? ""} ${candidate.brands ?? ""}`.toLowerCase();
    return brandNeedle === "loose / local" || haystack.includes(brandNeedle.split(" ")[0]);
  });
}

async function downloadImage(url, destination) {
  const response = await fetch(url, {
    headers: {
      "User-Agent": "PAANX beta catalog research (contact: local)",
    },
  });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
  const bytes = Buffer.from(await response.arrayBuffer());
  if (bytes.length < 1024) throw new Error("downloaded image too small");
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.writeFileSync(destination, bytes);
}

const products = parseProducts();
const priority = prioritySlugs
  .map((slug) => products.find((product) => product.slug === slug))
  .filter(Boolean);

const results = [];
for (const product of priority) {
  try {
    const source = await findOpenFoodFactsProduct(product);
    if (!source) {
      results.push({ ...product, status: "source_not_found" });
      continue;
    }

    const imageUrl = source.image_front_url || source.image_url;
    const imagePath = localImagePath(product);
    const destination = path.join("public", imagePath.replace(/^\//, ""));
    await downloadImage(imageUrl, destination);

    let line = productLines[product.index];
    line = updateStringField(line, "image", imagePath);
    line = updateStringField(line, "sourceUrl", source.url);
    line = updateStringField(line, "sourceName", "Open Food Facts");
    line = updateStringField(line, "lastChecked", today);
    line = removeImageNeeded(line);
    productLines[product.index] = line;

    results.push({
      ...product,
      image: imagePath,
      sourceUrl: source.url,
      sourceName: "Open Food Facts",
      imageSourceUrl: imageUrl,
      status: "image_downloaded",
    });
  } catch (error) {
    results.push({ ...product, status: "download_failed", notes: error.message });
  }
}

fs.writeFileSync(productPath, `${productLines.join("\n").replace(/\s+$/, "")}\n`);
fs.writeFileSync(
  "research/paanx-priority-asset-fetch-results.json",
  JSON.stringify(results, null, 2),
);

const downloaded = results.filter((result) => result.status === "image_downloaded").length;
console.log(
  JSON.stringify(
    {
      priorityRequested: priority.length,
      downloaded,
      unresolved: priority.length - downloaded,
    },
    null,
    2,
  ),
);
