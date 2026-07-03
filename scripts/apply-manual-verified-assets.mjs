import fs from "node:fs";
import path from "node:path";

const today = "2026-07-04";

const assets = [
  {
    slugs: ["sprite-750ml", "sprite-can-300ml"],
    image: "/products/beverages/sprite-official.png",
    sourceUrl: "https://www.coca-cola.com/in/en/brands/sprite",
    sourceName: "Coca-Cola India",
    imageSourceUrl:
      "https://www.coca-cola.com/content/dam/onexp/in/en/home-page-test-img/brands/sprite/Sprite-234x700.png",
  },
  {
    slugs: ["fanta-750ml"],
    image: "/products/beverages/fanta-official.png",
    sourceUrl: "https://www.coca-cola.com/in/en/brands/fanta",
    sourceName: "Coca-Cola India",
    imageSourceUrl:
      "https://www.coca-cola.com/content/dam/onexp/in/en/brands/fanta/fanta-prod-desktop.png",
  },
  {
    slugs: ["limca-750ml"],
    image: "/products/beverages/limca-official.jpg",
    sourceUrl: "https://www.coca-cola.com/in/en/brands/limca",
    sourceName: "Coca-Cola India",
    imageSourceUrl:
      "https://www.coca-cola.com/content/dam/onexp/in/en/home-page-test-img/brands/limca/limca%20new%20bottle%20desktop.jpg",
  },
  {
    slugs: ["maaza-600ml", "maaza-250ml"],
    image: "/products/beverages/maaza-official.jpg",
    sourceUrl: "https://www.coca-cola.com/in/en/brands/maaza",
    sourceName: "Coca-Cola India",
    imageSourceUrl:
      "https://www.coca-cola.com/content/dam/onexp/in/en/home-page-test-img/brands/maaza/maaza-bottles/maaza_packshot_1100x1100.jpg",
  },
];

const productsPath = "src/data/products.ts";
let text = fs.readFileSync(productsPath, "utf8");

function setField(line, field, value) {
  if (line.includes(`${field}: "`)) {
    return line.replace(new RegExp(`${field}: "[^"]*"`), `${field}: "${value}"`);
  }
  return line.replace(/, isRestricted:/, `, ${field}: "${value}", isRestricted:`);
}

function removeImageNeeded(line) {
  return line
    .replace(/, "image_needed"/g, "")
    .replace(/"image_needed", /g, "")
    .replace(/"image_needed"/g, "");
}

for (const asset of assets) {
  if (!fs.existsSync(path.join("public", asset.image.slice(1)))) {
    throw new Error(`Missing downloaded asset: ${asset.image}`);
  }

  for (const slug of asset.slugs) {
    const linePattern = new RegExp(`^  \\{[^\\n]*slug: "${slug}"[^\\n]*$`, "m");
    const match = text.match(linePattern);
    if (!match) throw new Error(`Product not found: ${slug}`);
    let line = match[0];
    line = setField(line, "image", asset.image);
    line = setField(line, "sourceUrl", asset.sourceUrl);
    line = setField(line, "sourceName", asset.sourceName);
    line = setField(line, "lastChecked", today);
    line = removeImageNeeded(line);
    text = text.replace(linePattern, line);
  }
}

fs.writeFileSync(productsPath, text);

fs.writeFileSync(
  "research/paanx-manual-verified-assets.json",
  JSON.stringify(assets, null, 2),
);
