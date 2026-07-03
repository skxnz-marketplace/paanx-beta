import fs from "node:fs";
import path from "node:path";
import { setTimeout as wait } from "node:timers/promises";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const productFile = "src/data/products.ts";
const today = "2026-07-04";
const maxProducts = Number(process.env.PAANX_IMAGE_LIMIT || "0");

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

const bannedHosts = [
  "facebook.com",
  "instagram.com",
  "pinterest.",
  "youtube.com",
  "ytimg.com",
];

function getField(line, field) {
  const match = line.match(new RegExp(`${field}: "([^"]*)"`));
  return match?.[1] ?? "";
}

function setField(line, field, value) {
  const escaped = value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
  if (line.includes(`${field}: "`)) {
    return line.replace(new RegExp(`${field}: "[^"]*"`), `${field}: "${escaped}"`);
  }
  if (field === "lastChecked" && line.includes("lastChecked: D")) {
    return line.replace(/lastChecked: D/, `lastChecked: "${escaped}"`);
  }
  return line.replace(/, isRestricted:/, `, ${field}: "${escaped}", isRestricted:`);
}

function removeImageNeeded(line) {
  return line
    .replace(/, "image_needed"/g, "")
    .replace(/"image_needed", /g, "")
    .replace(/"image_needed"/g, "");
}

function parseProducts(lines) {
  return lines
    .map((line, index) => ({ line, index }))
    .filter(({ line }) => /^  \{ id:/.test(line))
    .map(({ line, index }) => ({
      index,
      slug: getField(line, "slug"),
      name: getField(line, "name"),
      brand: getField(line, "brand"),
      category: getField(line, "category"),
      packSize: getField(line, "packSize"),
      image: getField(line, "image"),
    }));
}

function wordsFor(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

function safeDecode(value) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function searchQuery(product) {
  const pack = product.packSize
    .replace(/\([^)]*\)/g, " ")
    .replace(/\bstandard\b/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
  return `${product.name} ${pack} ${product.brand} product image India`
    .replace(/[()]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function localBase(product) {
  const folder = folderByCategory[product.category] ?? "accessories";
  return `/products/${folder}/${product.slug}`;
}

function hostName(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "DuckDuckGo Images";
  }
}

function fileExt(contentType, url) {
  const cleanUrl = url.split("?")[0].toLowerCase();
  if (contentType.includes("png") || cleanUrl.endsWith(".png")) return ".png";
  if (contentType.includes("webp") || cleanUrl.endsWith(".webp")) return ".webp";
  if (cleanUrl.endsWith(".jpeg")) return ".jpg";
  return ".jpg";
}

async function fetchText(url, referer = "https://duckduckgo.com/") {
  const res = await fetch(url, {
    headers: {
      "user-agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/126 Safari/537.36",
      referer,
    },
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.text();
}

async function ddgCandidates(query) {
  const searchUrl = `https://duckduckgo.com/?q=${encodeURIComponent(query)}&iax=images&ia=images`;
  const html = await fetchText(searchUrl, "https://duckduckgo.com/");
  const vqd = html.match(/vqd=['"]?([^'"&<>]+)['"]?/)?.[1];
  if (!vqd) return [];

  const apiUrl = `https://duckduckgo.com/i.js?l=in-en&o=json&q=${encodeURIComponent(query)}&vqd=${vqd}&f=,,,&p=1`;
  const data = JSON.parse(await fetchText(apiUrl, searchUrl));
  return (data.results ?? [])
    .map((result) => ({
      imageUrl: result.image,
      pageUrl: result.url,
      title: result.title ?? "",
      source: result.source ?? "",
      width: result.width ?? 0,
      height: result.height ?? 0,
    }))
    .filter((candidate) => /^https?:\/\//i.test(candidate.imageUrl))
    .filter((candidate) => {
      const haystack = `${candidate.imageUrl} ${candidate.pageUrl}`.toLowerCase();
      return !bannedHosts.some((host) => haystack.includes(host));
    });
}

function scoreCandidate(candidate, product) {
  const haystack = safeDecode(`${candidate.title} ${candidate.pageUrl} ${candidate.imageUrl}`).toLowerCase();
  const badTerms = [
    "plant",
    "sapling",
    "garden",
    "field",
    "stadium",
    "jersey",
    "wallpaper",
    "logo",
    "poster",
    "clipart",
    "recipe",
  ];
  if (badTerms.some((term) => haystack.includes(term))) return -100;

  const hayWords = new Set(wordsFor(haystack));
  const brandWords = wordsFor(product.brand.replace(/\s*\([^)]*\)/g, ""));
  const nameWords = wordsFor(product.name).filter(
    (word) =>
      ![
        "soft",
        "drink",
        "can",
        "pet",
        "original",
        "classic",
        "standard",
        "pouch",
        "pack",
        "pc",
      ].includes(word),
  );
  const slugWords = product.slug.split("-").filter((word) => word.length > 2);
  const packWords = wordsFor(product.packSize).filter((word) => /\d/.test(word));
  const brandHits = brandWords.filter((word) => hayWords.has(word)).length;
  const nameHits = nameWords.filter((word) => hayWords.has(word)).length;
  const slugHits = slugWords.filter((word) => hayWords.has(word)).length;
  const packHits = packWords.filter((word) => haystack.includes(word)).length;
  const accessoryBrand = ["cricket", "classic", "original"].includes(product.brand.toLowerCase());

  if (accessoryBrand && !haystack.includes("lighter")) return -100;
  if (brandHits === 0 && !(product.brand.toLowerCase() === "7up" && haystack.includes("7up"))) return -100;
  if (nameHits === 0 && slugHits < 2) return -100;

  return brandHits * 4 + nameHits * 3 + Math.min(slugHits, 4) + packHits * 2;
}

async function downloadCandidate(candidate, localBasePath) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15000);
  try {
    const res = await fetch(candidate.imageUrl, {
      signal: controller.signal,
      headers: {
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/126 Safari/537.36",
        accept: "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
      },
    });
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    const contentType = res.headers.get("content-type") ?? "";
    if (!contentType.includes("image")) throw new Error(`not image: ${contentType}`);
    const bytes = Buffer.from(await res.arrayBuffer());
    if (bytes.length < 3000) throw new Error("image too small");
    const ext = fileExt(contentType, candidate.imageUrl);
    const localPath = `${localBasePath}${ext}`;
    const output = path.join("public", localPath.replace(/^\//, ""));
    fs.mkdirSync(path.dirname(output), { recursive: true });
    fs.writeFileSync(output, bytes);
    return { localPath, bytes, contentType };
  } finally {
    clearTimeout(timer);
  }
}

const lines = fs.readFileSync(productFile, "utf8").split(/\r?\n/);
const products = parseProducts(lines);
const targetProducts = products
  .filter((product) => !product.image)
  .slice(0, maxProducts > 0 ? maxProducts : undefined);
const results = [];

for (const [idx, product] of targetProducts.entries()) {
  const query = searchQuery(product);
  console.log(`[${idx + 1}/${targetProducts.length}] ${product.slug}`);
  try {
    const candidates = (await ddgCandidates(query))
      .map((candidate) => ({ ...candidate, score: scoreCandidate(candidate, product) }))
      .filter((candidate) => candidate.score >= 7)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8);
    let downloaded = null;
    let accepted = null;
    let lastError = "";

    for (const candidate of candidates) {
      try {
        downloaded = await downloadCandidate(candidate, localBase(product));
        accepted = candidate;
        break;
      } catch (error) {
        lastError = error.message;
      }
    }

    if (!downloaded || !accepted) {
      results.push({ slug: product.slug, status: "image_not_found", query, notes: lastError || "No matched candidate" });
      await wait(120);
      continue;
    }

    let line = lines[product.index];
    line = setField(line, "image", downloaded.localPath);
    line = setField(line, "sourceUrl", accepted.pageUrl || accepted.imageUrl);
    line = setField(line, "sourceName", hostName(accepted.pageUrl || accepted.imageUrl));
    line = setField(line, "lastChecked", today);
    line = removeImageNeeded(line);
    lines[product.index] = line;

    results.push({
      slug: product.slug,
      status: "image_downloaded",
      image: downloaded.localPath,
      bytes: downloaded.bytes.length,
      sourceUrl: accepted.pageUrl,
      title: accepted.title,
      score: accepted.score,
    });
  } catch (error) {
    results.push({ slug: product.slug, status: "search_failed", query, notes: error.message });
  }
  await wait(180);
}

fs.writeFileSync(productFile, `${lines.join("\n").replace(/\s+$/, "")}\n`);
fs.writeFileSync("research/paanx-ddg-image-fill-results.json", JSON.stringify(results, null, 2));

const downloaded = results.filter((result) => result.status === "image_downloaded").length;
console.log(
  JSON.stringify(
    {
      attempted: targetProducts.length,
      downloaded,
      unresolved: targetProducts.length - downloaded,
      totalImageBacked: parseProducts(lines).filter((product) => product.image).length,
    },
    null,
    2,
  ),
);
