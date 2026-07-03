import fs from "node:fs";

const text = fs.readFileSync("src/data/products.ts", "utf8");
const lines = text.split(/\r?\n/).filter((line) => /^  \{ id:/.test(line));

function getField(line, field) {
  const quoted = line.match(new RegExp(`${field}: "([^"]*)"`));
  if (quoted) return quoted[1];
  const number = line.match(new RegExp(`${field}: ([0-9]+)`));
  return number ? number[1] : "";
}

const products = lines.map((line) => ({
  id: getField(line, "id"),
  slug: getField(line, "slug"),
  name: getField(line, "name"),
  brand: getField(line, "brand"),
  category: getField(line, "category"),
  subcategory: getField(line, "subcategory"),
  packSize: getField(line, "packSize"),
  price: getField(line, "price"),
  mrp: getField(line, "mrp"),
  priceType: getField(line, "priceType"),
  image: getField(line, "image"),
  sourceUrl: getField(line, "sourceUrl"),
  sourceName: getField(line, "sourceName"),
  lastChecked: getField(line, "lastChecked"),
  stock: getField(line, "stock"),
  isRestricted: line.includes("isRestricted: true"),
}));

function csv(rows, columns) {
  return [
    columns.join(","),
    ...rows.map((row) =>
      columns
        .map((column) => `"${String(row[column] ?? "").replace(/"/g, '""')}"`)
        .join(","),
    ),
  ].join("\n");
}

fs.mkdirSync("research", { recursive: true });

fs.writeFileSync(
  "research/paanx-product-source-log.csv",
  csv(
    products.map((product) => ({
      ...product,
      status: product.sourceUrl
        ? "product_identity_sourced"
        : "product_identity_seeded_price_unverified",
    })),
    [
      "id",
      "slug",
      "name",
      "brand",
      "category",
      "packSize",
      "sourceUrl",
      "sourceName",
      "lastChecked",
      "status",
    ],
  ),
);

fs.writeFileSync(
  "research/paanx-price-source-log.csv",
  csv(
    products.map((product) => ({
      ...product,
      notes:
        product.priceType === "source_mrp"
          ? "MRP verified from source"
          : "Needs live MRP verification before production launch",
    })),
    ["id", "slug", "name", "price", "mrp", "priceType", "sourceUrl", "notes"],
  ),
);

fs.writeFileSync(
  "research/paanx-image-source-log.csv",
  csv(
    products.map((product) => ({
      ...product,
      status: product.image ? "image_downloaded" : "image_needed",
      notes: product.image
        ? "Verified local image is available"
        : "No verified local image downloaded; app fallback is used",
    })),
    ["id", "slug", "name", "image", "status", "notes"],
  ),
);

const grouped = new Map();
for (const product of products) {
  const existing = grouped.get(product.category) ?? [];
  existing.push(product);
  grouped.set(product.category, existing);
}

const brandLines = [
  "# PAANX Brand Master List",
  "",
  "Generated from src/data/products.ts. Prices remain editable beta prices until source verification is completed.",
  "",
];

for (const category of [...grouped.keys()].sort()) {
  brandLines.push(`## ${category}`, "");
  const brands = new Set(grouped.get(category).map((product) => product.brand));
  for (const brand of [...brands].sort()) {
    brandLines.push(`- ${brand}`);
  }
  brandLines.push("");
}

fs.writeFileSync("research/paanx-brand-master-list.md", brandLines.join("\n"));

const restricted = products.filter((product) => product.isRestricted);
const restrictedLines = [
  "# PAANX Restricted Products Notes",
  "",
  "Restricted products are marked with isRestricted: true in src/data/products.ts and trigger age-gate handling in the customer app.",
  "",
  "Restricted catalog areas include pan masala, cigarettes, khaini/zarda/chewing tobacco, hookah flavours, and smoking accessories where appropriate.",
  "",
  "No vape, e-cigarette, vape liquid, alcohol, or illegal products are included in the catalog.",
  "",
  "## Restricted Product Count",
  String(restricted.length),
  "",
  "## Restricted Products",
  ...restricted.map(
    (product) => `- ${product.name} (${product.brand}, ${product.category})`,
  ),
];

fs.writeFileSync(
  "research/paanx-restricted-products-notes.md",
  restrictedLines.join("\n"),
);

console.log(
  JSON.stringify(
    {
      products: products.length,
      brands: new Set(products.map((product) => product.brand)).size,
      restricted: restricted.length,
    },
    null,
    2,
  ),
);
